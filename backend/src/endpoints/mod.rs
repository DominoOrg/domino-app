use rocket::{get, http::Status, serde::json::Json, Data};
use crate::db::select_puzzle_from_db;

type ApiPuzzle = Vec<Option<Vec<i32>>>;

#[get("/select_puzzle?<n>&<c>")]
pub async fn select_puzzle(n: i32, c: i32) -> Result<Json<ApiPuzzle>,Status> {
    println!("n: {}, c: {}", n, c);
    if let Ok(puzzle) = select_puzzle_from_db(n, 0) {
        println!("puzzle: {:?}", puzzle);
        let mapped_puzzle = puzzle
        .into_iter()
        .map(|option_tile|
            if let Some(tile) = option_tile {
                Some(vec![tile.0, tile.1])
            } else {
                None
            }
        )
        .collect();
        println!("mapped_puzzle: {:?}", mapped_puzzle);
        let json_puzzle = Json(mapped_puzzle);
        Ok(json_puzzle)
    } else {
        Err(Status { code: 404 })
    }
}