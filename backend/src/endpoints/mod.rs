use std::{collections::HashMap, sync::{Arc, Mutex}, thread::spawn, time::Instant};
use domino_lib::functionalities::{classify::classify_puzzle, generate::generate_puzzle, solve::solve_puzzle, validate::validate_puzzle};
use rocket::{get, http::Status, post, serde::json::Json};
use crate::db::{insert_puzzle, select_puzzle_from_db};
pub use performance::PerformanceTimer;

mod performance;

#[derive(serde::Serialize)]
pub(crate) struct ApiPuzzle { 
    id: String,
    tiles: Vec<Option<Vec<i32>>>
}

#[get("/select_puzzle?<n>&<c>")]
pub fn select_puzzle(n: i32, c: i32) -> Result<Json<ApiPuzzle>,Status> {
    if let Ok(puzzle) = select_puzzle_from_db(n, c) {
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
        let json_puzzle = Json(ApiPuzzle { id: "".to_string(), tiles: mapped_puzzle });
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
    let timer = Arc::new(Mutex::new(PerformanceTimer::new()));
    let mut last_print: Instant = Instant::now();
    for _ in 0..number_of_puzzles {
        let inserted_clone = inserted.clone();
        let timer_clone = Arc::clone(&timer);
        let handle = spawn(move || {
            if let Ok(complexity) = insert_valid_puzzle(n, timer_clone) {
                inserted_clone.lock().unwrap().entry(complexity).and_modify(|v| *v += 1).or_insert(1);
            }
        });
        handles.push(handle);
    }
    
    for (i, handle) in handles.into_iter().enumerate() {
        if last_print.elapsed().as_millis() > 1000 {
            last_print = Instant::now();
            print!("\rCompleted {} out of {} tentatives", i+1, number_of_puzzles);
        }
        let _ = handle.join();
    }
    timer.lock().unwrap().stop();

    let inserted_map = inserted.clone().lock().unwrap().clone();
    Ok(Json(InsertedResponse {
        inserted: inserted_map
    }))
}

fn insert_valid_puzzle(n: usize, timer: Arc<Mutex<PerformanceTimer>>) -> Result<usize, String> {
    let l = if n%2==0 {(n + 1) * (n + 2) / 2} else {(n + 1) * (n + 1) / 2}; 
    let max_hole = l - (2 * n + 1);
    let mut start = Instant::now();
    let puzzle = generate_puzzle(n, max_hole, true);
    timer.lock().unwrap().generations.push(start.elapsed());
    timer.clear_poison();
    start = Instant::now();
    if validate_puzzle(&puzzle).is_err() {
        timer.lock().unwrap().validations.push(start.elapsed());
        timer.clear_poison();
        return Err("The puzzle generated is not valid".to_string());
    }
    timer.lock().unwrap().validations.push(start.elapsed());
    timer.clear_poison();
    start = Instant::now();
    if let Ok(solution) = solve_puzzle(&puzzle) {
        timer.lock().unwrap().validations.push(start.elapsed());
        timer.clear_poison();
        start = Instant::now();
        let complexity = classify_puzzle(&puzzle);
        timer.lock().unwrap().classifications.push(start.elapsed());
        timer.clear_poison();
        start = Instant::now();
        let result = insert_puzzle(puzzle.clone(), solution.clone(), n, complexity);
        timer.lock().unwrap().dbinsertions.push(start.elapsed());
        timer.clear_poison();
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
        timer.lock().unwrap().validations.push(start.elapsed());
        timer.clear_poison();
        return Err("The puzzle generated is not solvable".to_string());
    }

}