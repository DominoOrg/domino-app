use std::{collections::HashMap, sync::{Arc, Mutex}, thread::spawn};
use domino_lib::{classify_puzzle, generate_puzzle, solve_puzzle, validate_puzzle};
use rocket::{get, http::Status, post, serde::json::Json};
use crate::db::{insert_puzzle, select_puzzle_by_id_from_db, select_puzzle_from_db};

#[derive(serde::Serialize)]
pub(crate) struct ApiPuzzle { 
    pub id: String,
    pub tiles: Vec<Option<Vec<i32>>>
}

#[get("/select_puzzle?<n>&<c>")]
pub fn select_puzzle(n: i32, c: i32) -> Result<Json<ApiPuzzle>,Status> {
    if let Ok(puzzle) = select_puzzle_from_db(n, c) {
        let mapped_puzzle = puzzle.tiles
        .into_iter()
        .map(|option_tile|
            if let Some(tile) = option_tile {
                Some(vec![tile[0], tile[1]])
            } else {
                None
            }
        )
        .collect();
        let json_puzzle = Json(ApiPuzzle { id: puzzle.id, tiles: mapped_puzzle });
        Ok(json_puzzle)
    } else {
        Err(Status { code: 404 })
    }
}


#[get("/get_puzzle_by_id?<id>")]
pub fn get_puzzle_by_id(id: String) -> Result<Json<ApiPuzzle>,Status> {
    if let Ok(puzzle) = select_puzzle_by_id_from_db(id) {
        let mapped_puzzle = puzzle.tiles
        .into_iter()
        .map(|option_tile|
            if let Some(tile) = option_tile {
                Some(vec![tile[0], tile[1]])
            } else {
                None
            }
        )
        .collect();
        let json_puzzle = Json(ApiPuzzle { id: puzzle.id.clone(), tiles: mapped_puzzle });
        Ok(json_puzzle)
    } else {
        Err(Status { code: 404 })
    }
}


#[derive(serde::Serialize)]
pub struct InsertedResponse {
    pub inserted: HashMap<usize, usize>
}

#[post("/insert_puzzles?<n>&<number_of_puzzles>")]
pub async fn insert_puzzles(n: usize, number_of_puzzles: usize) -> Result<Json<InsertedResponse>, Status> {
    let inserted = Arc::new(Mutex::new(HashMap::new()));
    let mut handles = Vec::new();
    for _ in 0..number_of_puzzles {
        let inserted_clone = inserted.clone();
        let handle = spawn(move || {
            if let Ok(complexity) = insert_valid_puzzle(n) {
                println!("Inserted puzzle with complexity: {}", complexity);
                inserted_clone.lock().unwrap().entry(complexity).and_modify(|v| *v += 1).or_insert(1);
            }
        });
        handles.push(handle);
    }
    
    for handle in handles {
        let _ = handle.join();
    }

    let inserted_map = inserted.clone().lock().unwrap().clone();
    Ok(Json(InsertedResponse {
        inserted: inserted_map
    }))
}

fn insert_valid_puzzle(n: usize) -> Result<usize, String> {
    let l = if n%2==0 {(n + 1) * (n + 2) / 2} else {(n + 1) * (n + 1) / 2}; 
    let max_hole = l - (n as f32 / 2.0).floor() as usize;
    let puzzle = generate_puzzle(n, max_hole, true);
    if let Ok(solution) = solve_puzzle(&puzzle) {
        if validate_puzzle(&puzzle, &solution).is_err() {
            return Err("The puzzle generated is not valid".to_string());
        }
        let complexity = classify_puzzle(&puzzle);
        let result = insert_puzzle(puzzle.clone(), solution.clone(), n, complexity);
        if let Err(error) = result{
            return Err(error.message.unwrap());
        } else {
            if let Ok(result) = result {
                if result {
                    return Ok(complexity);
                } else {
                    let error_msg = format!("Failed to insert duplicate puzzle: {:?} with solution: {:?} with complexity: {}", puzzle, solution, complexity);
                    return Err(error_msg);
                }
            } else {
                let error_msg = format!("Failed to insert puzzle: {:?} with solution: {:?} with complexity: {}", puzzle, solution, complexity);
                return Err(error_msg);
            }
        }
    } else {
        return Err("The puzzle generated is not solvable".to_string());
    }

}