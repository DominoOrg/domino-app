use std::hash::{DefaultHasher, Hash, Hasher};
use prost::Message;
use proto::Puzzle;
use query::{mutation, query_puzzle};
use crate::proto;
use domino_lib::Solution;

mod query;

fn hash_id<T: Hash>(element: T) -> String {
    let mut hasher = DefaultHasher::new();
    element.hash(&mut hasher);
    hasher.finish().to_string()
}

pub fn insert_puzzle(puzzle: Puzzle, solution: Solution, n: usize, complexity: usize) -> bool {
    // if puzzle, collection, inserted_tile, solution and tile do not exist create tables
    mutation("CREATE TABLE IF NOT EXISTS puzzle (
        id TEXT PRIMARY KEY,
        collection_id TEXT NOT NULL,
        c INT NOT NULL,
        solved_by INT NOT NULL
    );".to_string());
    mutation("CREATE TABLE IF NOT EXISTS collection (
        id TEXT PRIMARY KEY,
        n INT NOT NULL,
        len INT NOT NULL
    );".to_string());
    mutation("CREATE TABLE IF NOT EXISTS inserted_tile (
        collection_id TEXT NOT NULL,
        tile_id TEXT NOT NULL,
        position: INT NOT NULL,
        PRIMARY KEY(collection_id, tile_id)
    );".to_string());
    mutation("CREATE TABLE IF NOT EXISTS solution (
        id TEXT PRIMARY KEY,
        collection_id TEXT NOT NULL,
    );".to_string());
    mutation("CREATE TABLE IF NOT EXISTS tile (
        id TEXT PRIMARY KEY,
        left INT NOT NULL,
        right INT NOT NULL
    );".to_string());
    // hash puzzle for id
    let puzzle_id = hash_id(puzzle.encode_to_vec());
    // insert collection entity
    let mut stmt = ("INSERT INTO collection (id, n, len) VALUES (".to_string() +
        &puzzle_id.to_string() + ", " +
        &n.to_string() + ", " +
        &complexity.to_string() +
    ");").to_string();
    mutation(stmt);
    for (i, tile) in puzzle.tiles.iter().enumerate() {
        // insert inserted_tile relation
        let tile_id = hash_id(tile.encode_to_vec());
        stmt = ("INSERT INTO inserted_tile(collection_id, tile_id, position) VALUES (".to_string() +
            &puzzle_id.to_string() + ", " +
            &tile_id + ", " +
            &i.to_string() +
        ");").to_string();
        mutation(stmt);
        // insert tile 
        stmt = ("INSERT INTO tile(id, left, right) VALUES (".to_string() +
            &tile_id + ", " +
            &tile.left.to_string() + ", " +
            &tile.right.to_string() +
        ");").to_string();
        mutation(stmt);
    }
    // insert solution
    let solution_id = hash_id(solution.encode_to_vec());
    stmt = ("INSERT INTO solution(id, collection_id) VALUES (".to_string() +
        &solution_id + ", " +
        &puzzle_id +
    ");").to_string();
    mutation(stmt);
    // insert puzzle
    stmt = ("INSERT INTO puzzle(id, collection_id, c, solved_by) VALUES (".to_string() +
        &puzzle_id + ", " +
        &puzzle_id + ", " +
        &complexity.to_string() + ", " +
        &solution_id +
    ");").to_string();
    mutation(stmt);
    true
}

pub fn select_puzzle(n: i32, c: i32) -> Option<Puzzle> {
    // select puzzle by length n and complexity c
    let puzzle = query_puzzle(n.try_into().unwrap(), c.try_into().unwrap()); 
    // if no puzzle match the criteria return None
    puzzle.ok()
}