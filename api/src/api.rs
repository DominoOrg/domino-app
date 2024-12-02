use dto::dto;
use rocket::serde::json::Json;
use service::Mutation;
use service::Query;

use sea_orm_rocket::Connection;

use crate::error;
use crate::pool;
use pool::Db;

pub type R<T> = std::result::Result<rocket::serde::json::Json<T>, error::Error>;

/// # Get puzzle by n and difficulty
#[get("/select_puzzle?<n>&<difficulty>")]
pub async fn select_puzzle(
    conn: Connection<'_, Db>,
    n: Option<u64>,
    difficulty: Option<u64>
) -> R<dto::PuzzleDto> {
    let db = conn.into_inner();
    let n = n.unwrap_or(2);
    let difficulty = difficulty.unwrap_or(1);
    let dto = Query::select_puzzle_by_n_difficulty(db, n, difficulty).await.expect("Unable to find a puzzle with the parameters specified");

    Ok(Json(dto))
}

#[post("/insert_puzzles?<retrials>")]
pub async fn insert_puzzles(
    conn: Connection<'_, Db>,
    retrials: Option<u64>
) -> R<()> {
    let db = conn.into_inner();
    let retrials = retrials.unwrap_or(10);
    let _ = Mutation::insert_sequences(db, retrials as usize);
    let _ = Mutation::insert_puzzles(db, retrials as usize);

    Ok(Json(()))
}