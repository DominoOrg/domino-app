#[macro_use]
extern crate rocket;

use api::{insert_puzzles, select_puzzle};
use rocket::fairing::{self, AdHoc};
use rocket::{Build, Rocket};
use rocket::fs::FileServer;

use migration::MigratorTrait;
use sea_orm_rocket::Database;

use rocket::http::Method;
use rocket_cors::{AllowedHeaders, AllowedMethods, AllowedOrigins, Cors};

mod pool;
use pool::Db;
mod error;
mod api;

async fn run_migrations(rocket: Rocket<Build>) -> fairing::Result {
    let conn = &Db::fetch(&rocket).unwrap().conn;
    let _ = migration::Migrator::up(conn, None).await;
    Ok(rocket)
}

fn cors() -> Cors {
    rocket_cors::CorsOptions::default()
    .to_cors()
    .unwrap()
}

#[tokio::main]
async fn start() -> Result<(), rocket::Error> {
    let figment = rocket::Config::figment()
        .merge(("databases.sea_orm.url", "sqlite://./db/domino.sqlite?mode=rwc"));
    rocket::custom(figment)
        .attach(Db::init())
        .attach(AdHoc::try_on_ignite("Migrations", run_migrations))
        .mount("/", FileServer::from("static"))
        .mount(
            "/api",
            routes![select_puzzle, insert_puzzles],
        )
        .attach(cors())
        .launch()
        .await
        .map(|_| ())
}


pub fn main() {
    let result = start();

    println!("Rocket: deorbit.");

    if let Some(err) = result.err() {
        println!("Error: {err}");
    }
}
