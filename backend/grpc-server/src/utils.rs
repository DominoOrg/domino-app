use std::env::var;
use tower_http::cors::{Any, CorsLayer};

fn is_prod() -> bool {
    let env = var("RUST_ENV").expect("RUST_ENV must be set");

    match env.as_str() {
        "development" => {
            println!("Running in development environment");
            false
        },
        "production" => {
            println!("Running in production environment");
            true
        },
        _ => {
            eprintln!("Unknown environment, defaulting to development");
            false
        }
    }
}

pub fn cors() -> CorsLayer {
    let allowed_origins = ["domino.myddns.me".parse().unwrap()];
    let tmp = tower_http::cors::CorsLayer::new()
        .allow_methods(Any);

    if is_prod() {
        tmp.allow_origin(allowed_origins)
    } else {
        tmp.allow_origin(Any)
    }
}