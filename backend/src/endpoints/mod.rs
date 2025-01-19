use rocket::{get, serde::json::Json};
use crate::db::select_puzzle_from_db;

type ApiPuzzle = Vec<Option<Vec<i32>>>;

#[get("/select_puzzle?<n>&<c>")]
pub async fn select_puzzle(n: i32, c: i32) -> Option<Json<ApiPuzzle>> {
    println!("n: {}, c: {}", n, c);
    let result = select_puzzle_from_db(n, 0).ok();
    result.map(|puzzle|
        Json(
            puzzle
            .into_iter()
            .map(|option_tile|
                option_tile.map(|tile| vec![tile.0, tile.1])
            )
            .collect()
        )
    )
}