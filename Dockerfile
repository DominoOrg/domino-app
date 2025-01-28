# BASE IMAGE FOR RUST BUILD OF THE SOURCES
# INSTALL HIGHS DEPENDENCIES (COMPILING IT NOT FROM SOURCE BUT FROM highs-sys CRATE)
# THEN BUILD FROM SOURCES
FROM rust:1.82-slim-bullseye AS backend-builder
WORKDIR /usr/src/backend
COPY ./backend .
# RUN rustup target add aarch64-unknown-linux-gnu
RUN cargo install --path .

FROM node:23-bullseye-slim AS frontend-builder
WORKDIR /usr/src/frontend
COPY ./frontend .
RUN npm install && npm run build

# SMALLER IMAGE TO USE TO RUN THE BINARY
FROM debian:bullseye-slim
ENV ROCKET_PORT=8080
ENV ROCKET_ADDRESS=0.0.0.0
WORKDIR /usr/local/bin
COPY --from=backend-builder /usr/local/cargo/bin/backend ./backend
COPY ./backend/domino.db /usr/local/bin/
COPY --from=frontend-builder /usr/src/frontend/dist/. ./dist/
RUN mv ./dist ./static

CMD ["/usr/local/bin/backend"]
