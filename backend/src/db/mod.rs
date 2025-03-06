use std::hash::{DefaultHasher, Hash, Hasher};
use domino_lib::{Puzzle, Solution, Tile};
use crate::endpoints::ApiPuzzle;
use query::{mutation, query_puzzle, query_puzzle_by_id};

mod query;

/// Generates a hash-based unique ID for a given element.
///
/// # Arguments
/// * `element` - The element to hash.
///
/// # Returns
/// A `String` representing the hashed ID.
fn hash_id<T: Hash>(element: T) -> String {
    let mut hasher = DefaultHasher::new();
    element.hash(&mut hasher);
    format!("{:x}", hasher.finish())
}

/// Inserts a puzzle and its solution into the database.
///
/// # Arguments
/// * `puzzle` - The puzzle to insert.
/// * `solution` - The solution corresponding to the puzzle.
/// * `n` - The puzzle size.
/// * `complexity` - The complexity level of the puzzle.
///
/// # Returns
/// * `Ok(true)` if the insertion was successful.
/// * `Ok(false)` if the puzzle already exists.
/// * `Err(sqlite::Error)` if an error occurs.
pub fn insert_puzzle(
    puzzle: Puzzle,
    solution: Solution,
    n: usize,
    complexity: usize,
) -> Result<bool, sqlite::Error> {
    setup_tables()?;

    let puzzle_id = hash_id(puzzle.clone());
    let solution_id = hash_id(solution.clone());

    if mutation(format!(
        "INSERT INTO collection (id, n, len) VALUES (\"{}\", {}, {});",
        puzzle_id, n, puzzle.len()
    ))
    .is_err()
    {
        return Ok(false);
    }

    mutation(format!(
        "INSERT INTO collection (id, n, len) VALUES (\"{}\", {}, {});",
        solution_id, n, solution.len()
    ))?;

    for (i, &tile) in solution.iter().enumerate() {
        insert_tile(tile)?;
        if let Some(puzzle_tile) = puzzle.get(i).unwrap() {
            insert_inserted_tile(&puzzle_id, puzzle_tile, i)?;
        }
        insert_inserted_tile(&solution_id, &tile, i)?;
    }

    mutation(format!(
        "INSERT INTO solution(id, collection_id) VALUES (\"{}\", \"{}\");",
        solution_id, solution_id
    ))?;

    mutation(format!(
        "INSERT INTO puzzle(id, collection_id, c, solved_by) VALUES (\"{}\", \"{}\", {}, \"{}\");",
        puzzle_id, puzzle_id, complexity, solution_id
    ))?;

    Ok(true)
}

/// Inserts a tile into the database if it does not already exist.
///
/// # Arguments
/// * `tile` - The tile to insert.
///
/// # Returns
/// * `Ok(())` if successful.
/// * `Err(sqlite::Error)` if an error occurs.
fn insert_tile(tile: Tile) -> Result<(), sqlite::Error> {
    let tile_id = hash_id(tile);
    mutation(format!(
        "INSERT INTO tile (id, left, right) VALUES (\"{}\", {}, {});",
        tile_id, tile.0, tile.1
    ))
}

/// Inserts an inserted_tile relationship into the database.
///
/// # Arguments
/// * `collection_id` - The ID of the collection (puzzle or solution).
/// * `tile` - The tile being inserted.
/// * `position` - The position of the tile in the sequence.
///
/// # Returns
/// * `Ok(())` if successful.
/// * `Err(sqlite::Error)` if an error occurs.
fn insert_inserted_tile(collection_id: &str, tile: &Tile, position: usize) -> Result<(), sqlite::Error> {
    let tile_id = hash_id(tile);
    mutation(format!(
        "INSERT INTO inserted_tile (collection_id, tile_id, position) VALUES (\"{}\", \"{}\", {});",
        collection_id, tile_id, position
    ))
}

/// Retrieves a puzzle from the database based on its size and complexity.
///
/// # Arguments
/// * `n` - The size of the puzzle.
/// * `c` - The complexity level.
///
/// # Returns
/// * `Ok(ApiPuzzle)` if found.
/// * `Err(sqlite::Error)` if an error occurs.
pub fn select_puzzle_from_db(n: i32, c: i32) -> Result<ApiPuzzle, sqlite::Error> {
    setup_tables()?;
    query_puzzle(n.try_into().unwrap(), c.try_into().unwrap())
}

/// Retrieves a puzzle from the database by its ID.
///
/// # Arguments
/// * `id` - The unique identifier of the puzzle.
///
/// # Returns
/// * `Ok(ApiPuzzle)` if found.
/// * `Err(sqlite::Error)` if an error occurs.
pub fn select_puzzle_by_id_from_db(id: String) -> Result<ApiPuzzle, sqlite::Error> {
    setup_tables()?;
    query_puzzle_by_id(id)
}

/// Ensures that all required tables exist in the database.
///
/// # Returns
/// * `Ok(())` if successful.
/// * `Err(sqlite::Error)` if an error occurs.
fn setup_tables() -> Result<(), sqlite::Error> {
    let table_definitions = [
        "CREATE TABLE IF NOT EXISTS tile (
            id TEXT PRIMARY KEY,
            left INT NOT NULL,
            right INT NOT NULL
        );",
        "CREATE TABLE IF NOT EXISTS collection (
            id TEXT PRIMARY KEY,
            n INT NOT NULL,
            len INT NOT NULL
        );",
        "CREATE TABLE IF NOT EXISTS inserted_tile (
            collection_id TEXT NOT NULL REFERENCES collection(id),
            tile_id TEXT NOT NULL REFERENCES tile(id),
            position INT NOT NULL,
            PRIMARY KEY(collection_id, tile_id)
        );",
        "CREATE TABLE IF NOT EXISTS solution (
            id TEXT PRIMARY KEY,
            collection_id TEXT NOT NULL REFERENCES collection(id)
        );",
        "CREATE TABLE IF NOT EXISTS puzzle (
            id TEXT PRIMARY KEY,
            collection_id TEXT NOT NULL REFERENCES collection(id),
            c INT NOT NULL,
            solved_by INT NOT NULL REFERENCES solution(id)
        );",
    ];

    for query in &table_definitions {
        mutation(query.to_string())?;
    }

    Ok(())
}
