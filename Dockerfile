# BASE IMAGE FOR RUST BUILD OF THE SOURCES
# INSTALL HIGHS DEPENDENCIES (COMPILING IT NOT FROM SOURCE BUT FROM highs-sys CRATE)
# THEN BUILD FROM SOURCES
FROM rust:1.82-slim-bullseye AS backend-builder
WORKDIR /usr/src/backend
COPY ./backend .
RUN apt-get update \
  && apt-get install -y g++ cmake libssl-dev pkg-config clang\
  && cargo install --path .

FROM node:23-bullseye-slim AS frontend-builder
WORKDIR /usr/src/frontend
COPY ./frontend .
RUN npm install && npm run build

# SMALLER IMAGE TO USE TO RUN THE BINARY
FROM debian:bullseye-slim
WORKDIR /usr/local/bin
COPY --from=backend-builder /usr/local/cargo/bin/domino-rs ./domino-rs
COPY ./backend/db/domino.sqlite /usr/local/bin/db/
COPY --from=frontend-builder /usr/src/frontend/dist/. ./dist/
RUN mv ./dist ./static
EXPOSE 8000
CMD ["/usr/local/bin/domino-rs"]
