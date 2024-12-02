use std::hash::Hasher;
use domino_lib::{
    graph_models::{
        classify_puzzle::classify_puzzle,
        generate_puzzle::generate_puzzle,
        generate_sequence::generate_solution
    },
    lp_models::validate_puzzle_model::validate
};
use entity::tile;
use sea_orm::{ActiveValue, DatabaseConnection, DbErr, EntityTrait};
use ::entity::{
    sequence, sequence::Entity as Sequence,
    puzzle, puzzle::Entity as Puzzle,
    collection, collection::Entity as Collection,
    tile_placement, tile_placement::Entity as TilePlacement,
    tile::Entity as Tile
};

use crate::Query;

pub struct Mutation;

impl Mutation {
    pub async fn insert_sequences(db: &DatabaseConnection, retrials: usize) -> Result<(), DbErr> {
        let total_sequences = 11 * retrials;
    
        println!("Inserting sequences");
        // Insert tiles upfront
        insert_tiles(db).await?;
    
        // Insert collections and decompose sequences
        for n in [6,9,12] {
            for i in 0..retrials {
                let sequence = generate_solution(n, true);
                if let Ok(collection_id) = insert_collection(db, &sequence).await {
                    // Insert the sequence entry
                    let sequence_id = collection_id.clone().replace("collection_", "sequence_");
                    let sequence_obj = sequence::ActiveModel {
                        id: ActiveValue::Set(sequence_id.clone()),
                        collection_id: ActiveValue::Set(collection_id.clone()),
                    };
                    if let Err(_error) = Sequence::insert(sequence_obj).exec(db).await {
                        continue;
                    }
    
                    let seq_as_puzzle = sequence.into_iter().map(|tile| Some(tile)).collect::<Vec<Option<(String, String)>>>();
                    // Decompose and insert the sequence referencing the collection
                    insert_tile_placements(db, &seq_as_puzzle, collection_id).await?;
                    print!("\rProgress: {}/{}", (n-2)*retrials+i, total_sequences);
                } else {
                    continue;
                }
                
            }
        }
        println!("\r Inserted all the sequences");
        Ok(())
    }
    
    
    pub async fn insert_puzzles(db: &DatabaseConnection, retrials: usize) -> Result<(), DbErr> {
        println!("Inserting puzzles...");
        let sequences = Query::select_sequences(db).await?;
        let total_puzzles = sequences.len()*retrials;
    
        for (i, sequence_model) in sequences.iter().enumerate() {
            let sequence = sequence_model.tiles.clone().into_iter().map(|tile| (tile.0.to_string(), tile.1.to_string())).collect::<Vec<(String, String)>>();
    
            for j in 0..10 {
                let puzzle: Vec<Option<(String, String)>> = generate_puzzle(&sequence);
                let puzzle_remapped: Vec<Option<(usize, usize)>> = puzzle.iter().map(|tile| if let Some((halve1, halve2)) = tile {
                    Some((usize::from_str_radix(&halve1.clone(), 10).unwrap(), usize::from_str_radix(&halve2.clone(), 10).unwrap()))
                } else {
                    None
                }
                ).collect();
                if validate(&puzzle_remapped, get_n(&puzzle_remapped)).is_err() {
                    continue;
                }
                if let Ok(collection_id) = insert_collection(db, &puzzle).await {
                    // Insert the sequence entry
                    let puzzle_id = collection_id.clone().replace("collection_", "puzzle_");
                    let puzzle_complexity = classify_puzzle(&puzzle);
                    let puzzle_obj = puzzle::ActiveModel {
                        id: ActiveValue::Set(puzzle_id.clone()),
                        collection_id: ActiveValue::Set(collection_id.clone()),
                        difficulty: ActiveValue::Set(puzzle_complexity as i32),
                        solved_by: ActiveValue::Set(sequence_model.id.clone())
                    };
                    if let Err(_error) = Puzzle::insert(puzzle_obj).exec(db).await {
                        continue;
                    }
    
                    // Decompose and insert the sequence referencing the collection
                    insert_tile_placements(db, &puzzle, collection_id).await?;
                    print!("\rProgress: {}/{}", (i+1)*retrials+j, total_puzzles);
                } else {
                    continue;
                }
            }
        }
        println!("\r Inserted all the sequences");
        Ok(())
    }
}

pub fn generate_hash_identifier<H: std::hash::Hash>(value: &H) -> String {
    let mut hasher = std::collections::hash_map::DefaultHasher::new();
    value.hash(&mut hasher);
    format!("{:x}" ,hasher.finish())
}
  
pub fn get_n<T>(puzzle: &Vec<T>) -> usize {
    let l = puzzle.len();
    let n_p = (-3.0 + (1.0 + 8.0 * (l as f64)).sqrt()) / 2.0;
    let n_d = (-2.0 + (8.0 * (l as f64)).sqrt()) / 2.0;
    let n = if (n_p - n_p.floor()).abs() == 0.0 {
        n_p.floor() as usize
    } else {
        n_d.floor() as usize
    };
    n
}

#[allow(dead_code)]
async fn insert_tiles(db: &DatabaseConnection) -> Result<(), DbErr> {
    for i in 0..=12 {
        for j in 0..=i {
            let tile_obj = tile::ActiveModel {
                id: ActiveValue::Set("tile_".to_owned() + &generate_hash_identifier(&(i.to_string(), j.to_string()))),
                left_halve: ActiveValue::Set(i),
                right_halve: ActiveValue::Set(j),
            };
            // Insert tiles and log errors
            if let Err(error) = Tile::insert(tile_obj).exec(db).await {
                println!("Error inserting tile (i: {i}, j: {j}): {error:?}");
            }
        }
    }
    Ok(())
}

#[allow(dead_code)]
async fn insert_collection<T: std::hash::Hash>(db: &DatabaseConnection, sequence: &Vec<T>) -> Result<String, DbErr> {
    let n = get_n(&sequence);

    // Insert the collection
    let collection_id = "collection_".to_owned() + &generate_hash_identifier(sequence);
    let collection_obj = collection::ActiveModel {
        id: ActiveValue::Set(collection_id.clone()),
        len: ActiveValue::Set(sequence.len() as i32),
        n: ActiveValue::Set(n as i32),
    };
    Collection::insert(collection_obj.clone()).exec(db).await?;
    Ok(collection_id)
}

#[allow(dead_code)]
async fn insert_tile_placements(db: &DatabaseConnection, sequence: &Vec<Option<(String, String)>>, collection_id: String) -> Result<(), DbErr> {
    for (pos, tile) in sequence.iter().enumerate() {
        if let Some(tile) = tile {
            let left = i32::from_str_radix(&tile.0, 10).unwrap();
            let right = i32::from_str_radix(&tile.1, 10).unwrap();
            let normalized_tile = (left.max(right).to_string(), left.min(right).to_string());
            let tile_id = "tile_".to_owned() + &generate_hash_identifier(&normalized_tile);
    
            // Insert the tile placement
            let tile_placement_obj = tile_placement::ActiveModel {
                collection_id: ActiveValue::Set(collection_id.clone()),
                tile_id: ActiveValue::Set(tile_id.clone()),
                position: ActiveValue::Set(pos as i32),
                rotation: ActiveValue::Set(*tile != normalized_tile),
            };
            if let Err(error) = TilePlacement::insert(tile_placement_obj).exec(db).await {
                println!("Error inserting tile placement (collection_id: {collection_id}, tile_id: {tile_id}, position: {pos}): {error:?}");
            }    
        }
    }

    Ok(())
}
