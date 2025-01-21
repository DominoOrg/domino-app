use domino_lib::functionalities::{classify::classify_puzzle, generate::generate_puzzle, solve::solve_puzzle, validate::validate_puzzle};
use rocket::{get, http::Status, post, serde::json::Json};
use crate::db::{insert_puzzle, select_puzzle_from_db};

type ApiPuzzle = Vec<Option<Vec<i32>>>;

#[get("/select_puzzle?<n>&<c>")]
pub fn select_puzzle(n: i32, c: i32) -> Result<Json<ApiPuzzle>,Status> {
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

#[derive(serde::Serialize)]
pub struct InsertedResponse {
    pub inserted: usize
}

#[post("/insert_puzzles?<number_of_puzzles>")]
pub fn insert_puzzles(number_of_puzzles: usize) -> Result<Json<InsertedResponse>, Status> {
    let mut inserted = 0;
    let mut n = 3;
    for _ in 0..3 {
        for _ in 0..(number_of_puzzles/3) {
            println!("n: {}", n);
            let puzzle = generate_puzzle(n, true);
            if validate_puzzle(&puzzle).is_err() {
                continue;
            }
            if let Ok(solution) = solve_puzzle(&puzzle) {
                let complexity = classify_puzzle(&puzzle);
                if insert_puzzle(puzzle, solution, n, complexity).is_ok() {
                    inserted += 1;
                }    
            }
        }
        n += 3;
    };
    Ok(Json(InsertedResponse {
        inserted
    }))
}