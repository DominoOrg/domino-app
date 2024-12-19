# BASE IMAGE FOR RUST
FROM rust:1.82

WORKDIR /usr/src/domino-rs
COPY . .

# INSTALL HIGHS DEPENDENCY (COMPILING IT NOT FROM SOURCE BUT FROM highs-sys CRATE)
RUN apt-get update
RUN apt-get install -y g++ cmake openssl clang

# BUILD THE API
RUN cargo build --release

# COPY THE EXECUTABLE TO THE usr/local/bin FOLDER
RUN cp target/release/domino-rs /usr/local/bin/ 
RUN cp domino.sqlite /usr/local/bin/
RUN cp Rocket.toml /usr/local/bin/

# REMOVE SOURCE
RUN rm -rf /usr/src/domino-rs

# LAUNCH THE API
WORKDIR /usr/local/bin
CMD ["domino-rs"]
