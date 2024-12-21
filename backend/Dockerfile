# BASE IMAGE FOR RUST BUILD OF THE SOURCES
# INSTALL HIGHS DEPENDENCIES (COMPILING IT NOT FROM SOURCE BUT FROM highs-sys CRATE)
# THEN BUILD FROM SOURCES
FROM rust:1.82-slim-bullseye AS builder
WORKDIR /usr/src/domino-rs
COPY ./backend .
RUN apt-get update \
  && apt-get install -y g++ cmake libssl-dev pkg-config clang\
  && cargo install --path .

# SMALLER IMAGE TO USE TO RUN THE BINARY
FROM debian:bullseye-slim
COPY --from=builder /usr/local/cargo/bin/domino-rs /usr/local/bin/domino-rs
COPY ./backend/db/domino.sqlite /usr/local/bin/domino.sqlite
CMD ["/usr/local/bin/domino-rs"]
