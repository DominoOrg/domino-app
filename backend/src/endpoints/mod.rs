//! This module defines API endpoints for managing and retrieving Domino puzzles.
//!
//! It provides functions to:
//! - Retrieve a puzzle by its size and complexity.
//! - Retrieve a puzzle by its unique ID.
//! - Insert new puzzles into the database.

use std::collections::HashMap;
use domino_lib::{generate_puzzle, solve_puzzle, Puzzle};
use rocket::{get, http::Status, post, serde::json::Json};
use crate::db::{insert_puzzle, select_puzzle_by_id_from_db, select_puzzle_from_db};

/// Represents a puzzle in API responses.
///
/// Each puzzle consists of an `id` and a list of `tiles`, where each tile is either `None`
/// (for missing tiles) or `Some(Vec<i32>)` representing a tile with two values.
#[derive(serde::Serialize)]
pub(crate) struct ApiPuzzle {
  pub id: String,
  pub tiles: Vec<Option<Vec<i32>>>,
}

/// Retrieves a puzzle from the database based on size `n` and complexity `c`.
///
/// The puzzle is retrieved and mapped into an API-friendly format.
///
/// # Arguments
///
/// * `n` - The size of the puzzle.
/// * `c` - The complexity of the puzzle.
///
/// # Returns
///
/// * `Ok(Json<ApiPuzzle>)` - The requested puzzle in JSON format.
/// * `Err(Status::NotFound)` - If the puzzle is not found in the database.
///
/// # Example
///
/// ```
/// GET /select_puzzle?n=4&c=2
/// ```
#[get("/select_puzzle?<n>&<c>")]
pub fn select_puzzle(n: i32, c: i32) -> Result<Json<ApiPuzzle>, Status> {
  if let Ok(puzzle) = select_puzzle_from_db(n, c) {
      let mapped_puzzle = puzzle
          .tiles
          .into_iter()
          .map(|option_tile| {
              option_tile.map(|tile| vec![tile[0], tile[1]])
          })
          .collect();

      let json_puzzle = Json(ApiPuzzle { id: puzzle.id, tiles: mapped_puzzle });
      Ok(json_puzzle)
  } else {
      Err(Status::NotFound)
  }
}

/// Retrieves a puzzle by its unique identifier.
///
/// This function looks up a puzzle in the database using its `id` and maps it into an API response.
///
/// # Arguments
///
/// * `id` - The unique identifier of the puzzle.
///
/// # Returns
///
/// * `Ok(Json<ApiPuzzle>)` - The requested puzzle in JSON format.
/// * `Err(Status::NotFound)` - If no puzzle is found with the given ID.
///
/// # Example
///
/// ```
/// GET /get_puzzle_by_id?id=abcd1234
/// ```
#[get("/get_puzzle_by_id?<id>")]
pub fn get_puzzle_by_id(id: String) -> Result<Json<ApiPuzzle>, Status> {
  if let Ok(puzzle) = select_puzzle_by_id_from_db(id) {
      let mapped_puzzle = puzzle
          .tiles
          .into_iter()
          .map(|option_tile| {
              option_tile.map(|tile| vec![tile[0], tile[1]])
          })
          .collect();

      let json_puzzle = Json(ApiPuzzle { id: puzzle.id.clone(), tiles: mapped_puzzle });
      Ok(json_puzzle)
  } else {
      Err(Status::NotFound)
  }
}

/// Represents the response when inserting puzzles into the database.
///
/// The `inserted` field maps puzzle sizes to the number of successfully inserted puzzles.
#[derive(serde::Serialize)]
pub struct InsertedResponse {
  pub inserted: HashMap<usize, usize>,
}

/// Inserts a batch of generated puzzles into the database.
///
/// This function generates `number_of_puzzles` puzzles of size `n`,
/// validates them, and inserts them into the database.
/// Each puzzle is generated and checked for solvability before insertion.
///
/// # Arguments
///
/// * `n` - The size of each generated puzzle.
/// * `number_of_puzzles` - The number of puzzles to generate and insert.
///
/// # Returns
///
/// * `Ok(Json<InsertedResponse>)` - A JSON response indicating the number of inserted puzzles.
/// * `Err(Status::InternalServerError)` - If an error occurs during insertion.
///
/// # Example
///
/// ```
/// POST /insert_puzzles?n=5&number_of_puzzles=10
/// ```
#[post("/insert_puzzles?<n>&<number_of_puzzles>")]
pub async fn insert_puzzles(n: usize, number_of_puzzles: Option<usize>) -> Result<Json<InsertedResponse>, Status> {
    if n < 2 {
      return Err(Status::from_code(400).unwrap());
    }
    let mut inserted_counts = HashMap::new();
    let desired_count = number_of_puzzles.unwrap_or(100);

    // Generate and insert the specified number of puzzles
    for _ in 0..desired_count {
        for c in 1..=3 {
            // Generate a valid puzzle of size `n` with complexity `c`
            let puzzle: Puzzle = generate_puzzle(n, c, true).into();
            let solution = solve_puzzle(&puzzle.clone()).unwrap();
            match insert_puzzle(puzzle.clone(), solution, n, c) {
                Ok(true) => {
                    *inserted_counts.entry(n).or_insert(0) += 1;
                },
                Ok(false) => continue,
                // Return an error if insertion fails
                Err(error) => {
                    println!("Error inserting puzzle: {error:?}");

                    return Err(Status::InternalServerError);
                }
            }
        }
    }

    // Return the count of successfully inserted puzzles
    Ok(Json(InsertedResponse { inserted: inserted_counts }))
}

