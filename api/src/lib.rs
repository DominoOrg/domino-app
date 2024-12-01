#[macro_use]
extern crate rocket;

use api::{insert_puzzles, select_puzzle};
use rocket::fairing::{self, AdHoc};
use rocket::{Build, Rocket};

use migration::MigratorTrait;
use sea_orm_rocket::Database;

use rocket::http::Method;
use rocket_cors::{AllowedHeaders, AllowedOrigins, Cors};

mod pool;
use pool::Db;
mod error;
mod api;

async fn run_migrations(rocket: Rocket<Build>) -> fairing::Result {
    let conn = &Db::fetch(&rocket).unwrap().conn;
    let _ = migration::Migrator::up(conn, None).await;
    Ok(rocket)
}

#[tokio::main]
async fn start() -> Result<(), rocket::Error> {
    rocket::build()
        .attach(Db::init())
        .attach(AdHoc::try_on_ignite("Migrations", run_migrations))
        .mount(
            "/",
            routes![select_puzzle, insert_puzzles],
        )
        .attach(cors())
        .launch()
        .await
        .map(|_| ())
}

fn cors() -> Cors {
    let allowed_origins = AllowedOrigins::some_exact(&["http://localhost:8000", "http://127.0.0.1:8000"]);
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

pub fn main() {
    let result = start();

    println!("Rocket: deorbit.");

    if let Some(err) = result.err() {
        println!("Error: {err}");
    }
}
