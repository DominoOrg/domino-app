use rand::prelude::*;

use crate::endpoints::ApiPuzzle;

fn open_connection() -> Result<sqlite::Connection, sqlite::Error> {
    sqlite::open("./domino.db")
}

pub fn query_puzzle(n: usize, c: usize) -> Result<ApiPuzzle, sqlite::Error> {
    let connection = open_connection()?;
    let mut stmt = "
        SELECT P.id, C.len
        FROM puzzle P, collection C
        WHERE n = ".to_owned() + &n.to_string() + " 
        AND c = " + &c.to_string() + " 
        AND P.collection_id = C.id
    ";
    //println!("stmt: {}", stmt);
    let mut valid_puzzle_ids = vec![];
    let mut valid_puzzle_lengths = vec![];
    connection.iterate(stmt, |result| {
        for (column, value) in result {
            if column.to_string() == "id".to_string() {
                if let Some(value) = value {
                    let puzzle_id = value.to_string();                    
                    valid_puzzle_ids.push(puzzle_id);
                }
            } else if column.to_string() == "len".to_string() {
                if let Some(value) = value {
                    let puzzle_length = value.to_string().parse::<i32>().unwrap();
                    valid_puzzle_lengths.push(puzzle_length);
                }
            }
        }
        true
    }).expect("Error fetching the puzzle id");

    let mut rand_seed = rand::thread_rng();
    if valid_puzzle_ids.len() == 0 {
        return Ok(ApiPuzzle{
            id: "".to_string(),
            tiles: vec![]
        });
    }
    let rand_index = rand_seed.gen_range(0..valid_puzzle_ids.len());
    let puzzle_id = valid_puzzle_ids[rand_index].clone();
    let puzzle_len = valid_puzzle_lengths[rand_index];
    let mut tiles_info: Vec<(String, String)> = vec![];
    stmt = "SELECT tile_id, position FROM inserted_tile WHERE collection_id = \"".to_owned() + &puzzle_id +"\"";
    //println!("stmt: {}", stmt);
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

    let mut tiles: Vec<Option<Vec<i32>>> = vec![];
    for tile_index in 0..puzzle_len {
        let tile_info = tiles_info.iter().find(|tile_info| tile_info.1 == tile_index.to_string());
        if let Some(tile_info) = tile_info {
            stmt = "SELECT left, right FROM tile WHERE id = \"".to_owned() + &tile_info.0 +"\"";
            //println!("stmt: {}", stmt);
            connection.iterate(stmt, |result| {
                let mut left = -1;
                let mut right = -1;
    
                for (column, value) in result {
    
                    if column.to_string() == "left".to_string() {
                        left = value.unwrap().parse::<i32>().unwrap();
                        if right != -1 {
                            let tile = vec![left, right];
                            tiles.push(Some(tile));
                            return true;
                        }
                    } else if column.to_string() == "right".to_string() {
                        right = value.unwrap().parse::<i32>().unwrap();
                        if left != -1 {
                            let tile = vec![left, right];
                            tiles.push(Some(tile));
                            return true;
                        }
                    }
                }
    
                false
            }).expect("Error fetching the tiles");    
        } else {
            tiles.push(None);
            continue;
        }
    }
    Ok(ApiPuzzle { id: puzzle_id, tiles})
}

pub fn query_puzzle_by_id(id: String) -> Result<ApiPuzzle, sqlite::Error> {
    let connection = open_connection()?;
    let mut stmt = "
        SELECT *
        FROM puzzle P, collection C
        WHERE P.id = \"".to_owned() + &id+"\" AND P.collection_id = C.id";

    println!("stmt: {}", stmt);
    let mut valid_puzzle_ids = vec![];
    let mut valid_puzzle_lengths = vec![];
    connection.iterate(stmt, |result| {
        for (column, value) in result {
            if column.to_string() == "id".to_string() {
                if let Some(value) = value {
                    let puzzle_id = value.to_string();                    
                    valid_puzzle_ids.push(puzzle_id);
                }
            } else if column.to_string() == "len".to_string() {
                if let Some(value) = value {
                    let puzzle_length = value.to_string().parse::<i32>().unwrap();
                    valid_puzzle_lengths.push(puzzle_length);
                }
            }
        }
        true
    }).expect("Error fetching the puzzle id");

    let mut tiles_info: Vec<(String, String)> = vec![];
    stmt = "SELECT tile_id, position FROM inserted_tile WHERE collection_id = \"".to_owned() + &id +"\"";
    //println!("stmt: {}", stmt);
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

    let puzzle_len = valid_puzzle_lengths[0];
    let mut tiles: Vec<Option<Vec<i32>>> = vec![];
    for tile_index in 0..puzzle_len {
        let tile_info = tiles_info.iter().find(|tile_info| tile_info.1 == tile_index.to_string());
        if let Some(tile_info) = tile_info {
            stmt = "SELECT left, right FROM tile WHERE id = \"".to_owned() + &tile_info.0 +"\"";
            //println!("stmt: {}", stmt);
            connection.iterate(stmt, |result| {
                let mut left = -1;
                let mut right = -1;
    
                for (column, value) in result {
    
                    if column.to_string() == "left".to_string() {
                        left = value.unwrap().parse::<i32>().unwrap();
                        if right != -1 {
                            let tile = vec![left, right];
                            tiles.push(Some(tile));
                            return true;
                        }
                    } else if column.to_string() == "right".to_string() {
                        right = value.unwrap().parse::<i32>().unwrap();
                        if left != -1 {
                            let tile = vec![left, right];
                            tiles.push(Some(tile));
                            return true;
                        }
                    }
                }
    
                false
            }).expect("Error fetching the tiles");    
        } else {
            tiles.push(None);
            continue;
        }
    }
    Ok(ApiPuzzle { id, tiles})
}

pub fn mutation(query: String) -> Result<(), sqlite::Error> {
    let connection = open_connection()?;
    connection.execute(query)
}