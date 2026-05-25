# Deploying OOP Quest to AWS with a custom domain

This guide deploys the game to a single small Linux server (AWS Lightsail or
EC2), puts it behind a custom URL with HTTPS, and runs all learner-submitted
Java inside a locked-down Docker sandbox.

## Architecture

```
  Browser ──HTTPS──▶  nginx  ──proxy──▶  Node app (port 3000)
                                              │
                                              ▼  one throwaway container per run
                                   Docker:  oopquest-sandbox
                                   (no network, read-only FS,
                                    0.5 CPU, 128 MB, 10s limit)
```

The **Node app runs directly on the host** (managed by systemd). For each code
submission it launches a **short-lived, sandboxed Docker container** — that is
what keeps a public deployment safe.

## 1. Provision a server

Use **AWS Lightsail** (simplest) or **EC2**:

- Lightsail: create an instance, OS-only **Ubuntu 22.04**, the $5–$10 plan is fine.
- Attach a **static IP** to the instance.
- Open ports **22, 80, 443** in the instance firewall / security group.

The free-tier-sized box is enough — the sandbox limits below are tuned for it.

## 2. Install Node.js and Docker

SSH into the server, then:

```bash
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER      # let your user run docker without sudo
exit                               # log out and back in for the group to apply
```

## 3. Get the code onto the server

```bash
git clone <your-repo-url> oopquest      # or scp the project folder up
cd oopquest
npm install --omit=dev
```

## 4. Build the Java sandbox image

```bash
docker build -t oopquest-sandbox ./sandbox
```

Verify it works:

```bash
echo 'public class Main { public static void main(String[] a){ System.out.println("sandbox ok"); } }' > /tmp/Main.java
docker run --rm --network none -v /tmp:/code:ro oopquest-sandbox java /code/Main.java
```

## 5. Run the app as a service

Create `/etc/systemd/system/oopquest.service` (adjust `User` and the two paths):

```ini
[Unit]
Description=OOP Quest
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/oopquest
ExecStart=/usr/bin/node server.js
Restart=always
Environment=PORT=3000
Environment=OOPQUEST_SANDBOX=docker

[Install]
WantedBy=multi-user.target
```

The `User` must be in the `docker` group (step 2). Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now oopquest
systemctl status oopquest          # should show "active (running)"
journalctl -u oopquest -n 20       # logs — look for "🐳 Live Java execution ON"
```

## 6. Put nginx in front

Create `/etc/nginx/sites-available/oopquest`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/oopquest /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 7. Point your domain at the server

In your DNS provider (Route 53, or wherever the domain is registered):

- `A` record — `yourdomain.com` → your server's static IP
- `A` record — `www.yourdomain.com` → the same IP

Wait for DNS to propagate (`dig yourdomain.com` should show your IP).

## 8. Enable HTTPS (free, auto-renewing)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot edits the nginx config for TLS and sets up auto-renewal. Your game is
now live at **https://yourdomain.com**.

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `3000` | Port the Node app listens on |
| `OOPQUEST_SANDBOX` | `auto` | `docker` (production), `direct` (local dev), `off`, or `auto` |
| `OOPQUEST_SANDBOX_IMAGE` | `oopquest-sandbox` | Name of the sandbox Docker image |

For any public deployment, set `OOPQUEST_SANDBOX=docker` so execution is never
unsandboxed. If the image is missing the app logs a warning and live execution
turns off — the game stays fully playable on the structural checker.

## How the sandbox protects the server

Every code run is a separate `docker run` that is removed afterwards. Each
container gets:

- **`--network none`** — no internet and no access to your AWS network
- **`--memory 128m`** — a hard RAM ceiling
- **`--cpus 0.5`** — at most half a CPU core
- **`--pids-limit 128`** — blocks fork / thread bombs
- **`--read-only`** root filesystem + a tiny 16 MB `/tmp` tmpfs
- **`--cap-drop ALL`** and **`--security-opt no-new-privileges`**
- **`--ulimit cpu=10`** — a hard 10 CPU-second kernel backstop
- a **12-second wall-clock timeout** enforced by the app, after which the
  container is force-removed
- runs as an **unprivileged user**, never root

The app also limits concurrent runs (`MAX_CONCURRENT_RUNS` in `server.js`) so a
small box is never swamped. An infinite loop is capped by the CPU limit and
killed within the timeout — it cannot exhaust the host.

## Notes & limits

- Progress is stored in `data/progress.json` — a flat file. This is fine for one
  instance; do **not** run multiple app instances behind a load balancer without
  first moving progress to a database.
- Back up `data/progress.json` if you care about players' saves.
- To update the game: `git pull`, `npm install --omit=dev`,
  `sudo systemctl restart oopquest` (rebuild the sandbox image only if anything
  under `sandbox/` changed).
