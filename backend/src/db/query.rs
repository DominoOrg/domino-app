use crate::endpoints::ApiPuzzle;
use rand::prelude::*;
use sqlite::{Connection, Error};

/// Opens a connection to the SQLite database.
///
/// # Returns
/// * `Ok(Connection)` - The database connection if successful.
/// * `Err(Error)` - If the connection fails.
fn open_connection() -> Result<Connection, Error> {
    sqlite::open("./domino.db")
}

/// Executes a mutation query in the database.
///
/// # Arguments
/// * `query` - The SQL query string.
///
/// # Returns
/// * `Ok(())` - If the execution is successful.
/// * `Err(Error)` - If the query fails.
pub fn mutation(query: String) -> Result<(), Error> {
    let connection = open_connection()?;
    connection.execute(query)
}

/// Fetches a puzzle from the database based on size `n` and complexity `c`.
///
/// # Arguments
/// * `n` - The puzzle size.
/// * `c` - The complexity level.
///
/// # Returns
/// * `Ok(ApiPuzzle)` - The retrieved puzzle.
/// * `Err(Error)` - If an error occurs during retrieval.
pub fn query_puzzle(n: usize, c: usize) -> Result<ApiPuzzle, Error> {
    let connection = open_connection()?;
    let query = format!(
        "SELECT P.id, C.len, P.c, C.n FROM puzzle P, collection C WHERE n = {} AND c = {} AND P.collection_id = C.id",
        n, c
    );

    let result = fetch_puzzle_info(&connection, &query)?;
    let (puzzle_id, puzzle_len, c, n) = result;
    if puzzle_id.is_empty() {
        return Ok(ApiPuzzle {
            id: "".to_string(),
            tiles: vec![],
            n,
            c,
        });
    }

    let tiles_info = fetch_tiles_info(&connection, &puzzle_id)?;
    let tiles = fetch_tile_data(&connection, &tiles_info, puzzle_len);

    Ok(ApiPuzzle {
        id: puzzle_id,
        tiles,
        n,
        c,
    })
}

/// Fetches a puzzle from the database by its unique ID.
///
/// # Arguments
/// * `id` - The unique identifier of the puzzle.
///
/// # Returns
/// * `Ok(ApiPuzzle)` - The retrieved puzzle.
/// * `Err(Error)` - If an error occurs during retrieval.
pub fn query_puzzle_by_id(id: String) -> Result<ApiPuzzle, Error> {
    let connection = open_connection()?;
    let query = format!(
        "SELECT * FROM puzzle P, collection C WHERE P.id = \"{}\" AND P.collection_id = C.id",
        id
    );

    let (_, puzzle_len, c, n) = fetch_puzzle_info(&connection, &query)?;
    let tiles_info = fetch_tiles_info(&connection, &id)?;
    let tiles = fetch_tile_data(&connection, &tiles_info, puzzle_len);

    Ok(ApiPuzzle { id, tiles, n, c })
}

/// Fetches a puzzle ID and its length from the database.
///
/// # Arguments
/// * `connection` - The SQLite connection.
/// * `query` - The SQL query string.
///
/// # Returns
/// * `Ok((String, i32))` - The puzzle ID and its length.
/// * `Err(Error)` - If an error occurs during retrieval.
fn fetch_puzzle_info(
    connection: &Connection,
    query: &str,
) -> Result<(String, i32, i32, i32), Error> {
    let mut puzzle_ids = vec![];
    let mut puzzle_lengths = vec![];
    let mut puzzle_complexities = vec![];
    let mut puzzle_sizes = vec![];

    connection.iterate(query, |rows| {
        for (column, value) in rows {
            match *column {
                "id" => {
                    if let Some(value) = value {
                        puzzle_ids.push(value.to_string());
                    }
                }
                "len" => {
                    if let Some(value) = value {
                        if let Ok(parsed_len) = value.parse::<i32>() {
                            puzzle_lengths.push(parsed_len);
                        }
                    }
                },
                "c" => {
                    if let Some(value) = value {
                      if let Ok(parsed_value) = value.parse::<i32>() {
                          puzzle_complexities.push(parsed_value);
                      }
                    }
                },
                "n" => {
                  if let Some(value) = value {
                    if let Ok(parsed_value) = value.parse::<i32>() {
                        puzzle_sizes.push(parsed_value);
                    }
                  }
                }
                _ => {}
            }
        }
        true
    })?;

    if puzzle_ids.is_empty() {
        return Ok(("".to_string(), 0, 0, 0));
    }

    let rand_index = thread_rng().gen_range(0..puzzle_ids.len());
    Ok((puzzle_ids[rand_index].clone(), puzzle_lengths[rand_index], puzzle_complexities[rand_index], puzzle_sizes[rand_index]))
}

/// Fetches the tiles information (ID and position) associated with a puzzle.
///
/// # Arguments
/// * `connection` - The SQLite connection.
/// * `puzzle_id` - The puzzle ID.
///
/// # Returns
/// * `Ok(Vec<(String, String)>)` - A vector of (tile_id, position) tuples.
/// * `Err(Error)` - If an error occurs during retrieval.
fn fetch_tiles_info(
    connection: &Connection,
    puzzle_id: &str,
) -> Result<Vec<(String, String)>, Error> {
    let query = format!(
        "SELECT tile_id, position FROM inserted_tile WHERE collection_id = \"{}\"",
        puzzle_id
    );

    let mut tiles_info = vec![];

    connection.iterate(&query, |rows| {
        let mut tile_info = ("".to_string(), "".to_string());
        for (column, value) in rows {
            match *column {
                "tile_id" => {
                    tile_info.0 = value.unwrap_or("").to_string();
                }
                "position" => {
                    tile_info.1 = value.unwrap_or("").to_string();
                }
                _ => {}
            }
        }
        tiles_info.push(tile_info);
        true
    })?;

    Ok(tiles_info)
}

/// Fetches the tile data (left and right values) for a given puzzle.
///
/// # Arguments
/// * `connection` - The SQLite connection.
/// * `tiles_info` - A vector containing tile IDs and positions.
/// * `puzzle_len` - The length of the puzzle.
///
/// # Returns
/// * `Vec<Option<Vec<i32>>>` - A vector containing tile data.
fn fetch_tile_data(
    connection: &Connection,
    tiles_info: &[(String, String)],
    puzzle_len: i32,
) -> Vec<Option<Vec<i32>>> {
    let mut tiles = vec![None; puzzle_len as usize];

    for tile_index in 0..puzzle_len {
        if let Some((tile_id, _)) = tiles_info
            .iter()
            .find(|(_, pos)| pos == &tile_index.to_string())
        {
            let query = format!("SELECT left, right FROM tile WHERE id = \"{}\"", tile_id);
            connection
                .iterate(&query, |rows| {
                    let mut left = None;
                    let mut right = None;

                    for (column, value) in rows {
                        match *column {
                            "left" => left = value.and_then(|v| v.parse::<i32>().ok()),
                            "right" => right = value.and_then(|v| v.parse::<i32>().ok()),
                            _ => {}
                        }
                    }

                    if let (Some(l), Some(r)) = (left, right) {
                        tiles[tile_index as usize] = Some(vec![l, r]);
                        return true;
                    }

                    false
                })
                .expect("Error fetching tile data");
        }
    }

    tiles
}
