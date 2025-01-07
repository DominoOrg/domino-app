use std::collections::{HashMap, HashSet};

use super::tile::Tile;

#[derive(Debug, Default, Clone, PartialEq, Eq)]
pub struct Puzzle {
  pub tiles: HashSet<Tile>,
  pub positions: HashMap<usize, Tile>
}

impl Puzzle {

    pub fn insert(&mut self, position: usize, tile: Tile) {
        if self.tiles.insert(tile) {
          self.positions.insert(position, tile);
        }
    }

    pub fn remove(&mut self, position: usize) {
        if let Some(tile) = self.positions.remove(&position) {
          self.tiles.remove(&tile);
        }
    }

    pub fn at(&self, position: usize) -> Option<Tile> {
        self.positions.get(&position).cloned()
    }

    pub fn contains(&self, tile: Tile) -> Option<usize> {
        self.tiles.iter().position(|t| *t == tile)  
    }

    pub fn len(&self) -> usize {
        self.positions.len()
    }
}

impl From<Vec<Option<(usize, usize)>>> for Puzzle {
    fn from(value: Vec<Option<(usize, usize)>>) -> Self {
        let mut puzzle = Puzzle::default();
        for (position, tile) in value.iter().enumerate() {
            if let Some(tile) = tile {
                puzzle.insert(position, Tile(tile.0, tile.1));
            }
        }
        puzzle
    }
}

pub struct FitPuzzleChecker;

impl FitPuzzleChecker {
    fn check_left(&self, puzzle: &Puzzle, position: usize, tile: Tile) -> bool {
      let left_tile = puzzle.at(position - 1);
      if let Some(left_tile) = left_tile {
        if left_tile.1 == tile.0 {
          true
        } else {
          false
        }
      } else {
        true
      } 
    }

    fn check_right(&self, puzzle: &Puzzle, position: usize, tile: Tile) -> bool {
      let right_tile = puzzle.at(position + 1);
      if let Some(right_tile) = right_tile {
        if right_tile.0 == tile.1 {
          true
        } else {
          false
        }
      } else {
        true
      }
    }

    pub fn check(&self, puzzle: &Puzzle, position: usize, tile: Tile) -> bool {
        match position {
            0 => {
              self.check_right(puzzle, position, tile)
            }, 
            position if position == puzzle.len() - 1 => {
              self.check_left(puzzle, position, tile)
            },
            position => {
              self.check_left(puzzle, position, tile) &&
              self.check_right(puzzle, position, tile)
            }
        }
    }

}