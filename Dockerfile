# BASE IMAGE FOR RUST BUILD OF THE SOURCES
FROM rust:1.82-slim-bullseye AS build
WORKDIR /usr/src/domino-rs
COPY . .
# INSTALL HIGHS DEPENDENCIES (COMPILING IT NOT FROM SOURCE BUT FROM highs-sys CRATE)
# THEN BUILD FROM SOURCES
RUN apt-get update \
  && apt-get install -y g++ cmake libssl-dev pkg-config clang\
  && cargo install --path .

# SMALLER IMAGE TO USE TO RUN THE BINARY
FROM debian:bullseye-slim
COPY --from=build /usr/local/cargo/bin/domino-rs /usr/local/bin/domino-rs
COPY ./domino.sqlite /usr/local/bin/domino.sqlite
COPY ./Rocket.toml /usr/local/bin/Rocket.toml
CMD ["/usr/local/bin/domino-rs"]
