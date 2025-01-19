use std::fmt::Error;

use domino_lib::types::{Puzzle, Tile};
use rand::prelude::*;

fn open_connection() -> Result<sqlite::Connection, sqlite::Error> {
    sqlite::open("./domino.db")
}

pub fn query_puzzle(n: usize, c: usize) -> Result<Puzzle, sqlite::Error> {
    let mut puzzle = Puzzle::default();
    let connection = open_connection()?;
    let mut stmt = "
        SELECT P.id
        FROM puzzle P, collection C
        WHERE n = ".to_owned() + &n.to_string() + " 
        AND c = " + &c.to_string() + " 
        AND P.collection_id = C.id
    ";
    println!("stmt: {}", stmt);
    let mut valid_puzzle_ids = vec![];
    connection.iterate(stmt, |result| {
        for (column, value) in result {
            if column.to_string() == "id".to_string() {
                if let Some(value) = value {
                    let puzzle_id = value.to_string();                    
                    valid_puzzle_ids.push(puzzle_id);
                }
            }
        }
        true
    }).expect("Error fetching the puzzle id");

    if valid_puzzle_ids.len() == 0 {
        return Ok(vec![]);
    }
    let mut rand_seed = rand::thread_rng();
    let rand_index = rand_seed.gen_range(0..valid_puzzle_ids.len());
    let puzzle_id = valid_puzzle_ids[rand_index].clone();
    let mut tiles_info: Vec<(String, String)> = vec![];
    stmt = "SELECT tile_id, position FROM inserted_tile WHERE collection_id = \"".to_owned() + &puzzle_id +"\"";
    println!("stmt: {}", stmt);
    connection.iterate(stmt, |result| {
        let mut tile_info: (String, String) = ("".to_string(), "".to_string());
        for (column, value) in result {

            if column.to_string() == "tile_id".to_string() {
                tile_info.0 = value.unwrap().to_owned();
            } else if column.to_string() == "position".to_string() {
                tile_info.1 = value.unwrap().to_owned();
            }
        }
        tiles_info.push(tile_info);
        true
    }).expect("Error fetching inserted tiles");

    let mut tiles: Vec<Option<Tile>> = vec![];
    for tile_info in tiles_info {
        stmt = "SELECT left, right FROM tile WHERE id = \"".to_owned() + &tile_info.0 +"\"";
        println!("stmt: {}", stmt);
        connection.iterate(stmt, |result| {
            let mut left = -1;
            let mut right = -1;

            for (column, value) in result {

                if column.to_string() == "left".to_string() {
                    left = value.unwrap().parse::<i32>().unwrap();
                    if right != -1 {
                        let tile = Tile(left, right);
                        tiles.push(Some(tile));
                        return true;
                    }
                } else if column.to_string() == "right".to_string() {
                    right = value.unwrap().parse::<i32>().unwrap();
                    if left != -1 {
                        let tile = Tile(left, right);
                        tiles.push(Some(tile));
                        return true;
                    }
                }
            }

            false
        }).expect("Error fetching the tiles");
    }
    puzzle.extend_from_slice(tiles.as_slice());
    Ok(puzzle)
}

pub fn mutation(query: String) -> Result<(), sqlite::Error> {
    let connection = open_connection()?;
    connection.execute(query)
}