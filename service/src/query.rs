use dto::dto::PuzzleDto;
use ::entity::{
  sequence::Entity as Sequence,
  puzzle, puzzle::Entity as Puzzle,
  collection, collection::Entity as Collection,
  tile_placement, tile_placement::Entity as TilePlacement,
  tile::Entity as Tile
};
use rand::Rng;
use sea_orm::*;

pub struct Query;

impl Query {
  pub async fn select_puzzle_by_n_difficulty(
    db: &DbConn,
    n: u64,
    difficulty: u64
  ) -> Result<PuzzleDto, DbErr> {
    let puzzles = Puzzle::find().filter(puzzle::Column::Difficulty.eq(difficulty)).all(db).await?;
    let mut puzzle = puzzles[rand::thread_rng().gen_range(0..puzzles.len())].clone();
    let mut collection = Collection::find_by_id(puzzle.collection_id).filter(collection::Column::N.eq(n)).one(db).await?;
    
    while collection.is_none() {
      puzzle = puzzles[rand::thread_rng().gen_range(0..puzzles.len())].clone();
      collection = Collection::find_by_id(puzzle.collection_id).filter(collection::Column::N.eq(n)).one(db).await?;
    }

    let collection = collection.unwrap();
    let id = puzzle.id;
    let mut puzzle = vec![None; collection.len.try_into().unwrap()];
    let placements = TilePlacement::find().filter(tile_placement::Column::CollectionId.eq(collection.id)).all(db).await?;
    for placement in placements {
        let mut tile = Tile::find_by_id(placement.tile_id).one(db).await?.unwrap();
        if placement.rotation {
            (tile.left_halve, tile.right_halve) = (tile.right_halve, tile.left_halve);
        }
        puzzle[placement.position as usize] = Some((tile.left_halve, tile.right_halve));
    }
    Ok(PuzzleDto { id, puzzle })
  }

  pub async fn select_sequences(db: &DatabaseConnection) -> Result<Vec<Vec<(i32, i32)>>, DbErr> {
    let sequences_rows = Sequence::find().all(db).await?;
    let mut sequences = Vec::new();
    for sequence_row in sequences_rows {
        let collection = Collection::find_by_id(sequence_row.collection_id).one(db).await?.unwrap();
        let mut sequence = vec![(0,0); collection.len.try_into().unwrap()];
        let placements = TilePlacement::find().filter(tile_placement::Column::CollectionId.eq(collection.id)).all(db).await?;
        for placement in placements {
            let mut tile = Tile::find_by_id(placement.tile_id).one(db).await?.unwrap();
            if placement.rotation {
                (tile.left_halve, tile.right_halve) = (tile.right_halve, tile.left_halve);
            }
            sequence[placement.position as usize] = (tile.left_halve, tile.right_halve);
        }
        sequences.push(sequence);
    }
    Ok(sequences)
}
}