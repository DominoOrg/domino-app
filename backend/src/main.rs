use rocket::routes;
use rocket::http::Method;
use rocket::fs::FileServer;
use rocket_cors::{AllowedHeaders, AllowedOrigins, Cors};
use endpoints::{insert_puzzles, select_puzzle, get_puzzle_by_id};

mod endpoints;
mod db;

fn cors() -> Cors {
    let allowed_origins = AllowedOrigins::all();
    rocket_cors::CorsOptions {
        allowed_origins,
        allowed_methods: vec![Method::Get, Method::Post, Method::Delete]
            .into_iter()
            .map(From::from)
            .collect(),
        allowed_headers: AllowedHeaders::all(),
        allow_credentials: true,
        ..Default::default()
    }
    .to_cors()
    .unwrap()
}

#[rocket::launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", FileServer::from("static"))
        .mount("/api", routes![select_puzzle, get_puzzle_by_id, insert_puzzles])
        .attach(cors())
}