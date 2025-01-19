use rocket::{get, serde::json::Json};
use crate::db::select_puzzle_from_db;

type ApiPuzzle = Vec<Option<Vec<i32>>>;

#[get("/select_puzzle?<n>&<c>")]
pub async fn select_puzzle(n: i32, c: i32) -> Json<ApiPuzzle> {
    println!("n: {}, c: {}", n, c);
    if let Ok(puzzle) = select_puzzle_from_db(n, 0) {
        Json(
            puzzle
            .into_iter()
            .map(|option_tile|
                if let Some(tile) = option_tile {
                    Some(vec![tile.0, tile.1])
                } else {
                    None
                }
            )
            .collect()
        )
    } else {
        Json(vec![])
    }
}