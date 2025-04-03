use endpoints::{get_puzzle_by_id, insert_puzzles, select_puzzle};
use rocket::fs::FileServer;
use rocket::http::Method;
use rocket::routes;
use rocket_cors::{AllowedHeaders, AllowedOrigins, Cors};

mod db;
mod endpoints;

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
        .mount(
            "/api",
            routes![select_puzzle, get_puzzle_by_id, insert_puzzles],
        )
        .mount("/", FileServer::from("static").rank(2))
        .mount("/game", FileServer::from("static").rank(3))
        .attach(cors())
}
