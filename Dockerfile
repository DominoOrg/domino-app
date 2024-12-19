# BASE IMAGE FOR RUST
FROM rust:1.82

WORKDIR /usr/src/domino-rs
COPY . .

# INSTALL HIGHS DEPENDENCY (COMPILING IT NOT FROM SOURCE BUT FROM highs-sys CRATE)
RUN apt-get update
RUN apt-get install -y g++ cmake openssl clang

# BUILD DOMINO-RS
RUN cargo build --release

# MOVE THE BINARY OUT OF THE SOURCE FOLDER
RUN cp target/release/domino-rs /usr/local/bin/ 
RUN cp domino.sqlite /usr/local/bin/
RUN cp Rocket.toml /usr/local/bin/

# REMOVE SOURCE
RUN rm -rf /usr/src/domino-rs

# ENSURE THE IMAGE CONTINUES RUNNING
WORKDIR /usr/local/bin
CMD ["domino-rs"]
