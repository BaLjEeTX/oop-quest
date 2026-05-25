# OOP Quest — sandbox image for executing learner-submitted Java.
#
# Build it once:
#     docker build -t oopquest-sandbox ./sandbox
#
# server.js then launches one throwaway container per code run, with
# no network, a read-only filesystem, and capped CPU / memory / pids.
#
# A full JDK is required (not just a JRE): the Java single-file source
# launcher — `java File.java` — compiles the source in memory and needs
# the compiler module.
FROM eclipse-temurin:21-jdk-alpine

# Never run submissions as root. Home points at /tmp, which the server
# mounts as a small writable tmpfs at run time.
RUN addgroup -S runner && adduser -S -G runner -h /tmp runner
USER runner
ENV HOME=/tmp
WORKDIR /code

# No ENTRYPOINT / CMD on purpose: server.js passes the exact command
# (`java /code/Quest.java`) and all the security limits explicitly.
