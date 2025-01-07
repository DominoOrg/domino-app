use graph_models::{generate_puzzle::generate_puzzle, generate_sequence::generate_solution, validate_puzzle::validate};

mod domino_types;
mod graph_models;

fn main() {
  let sequence = generate_solution(6, true);
  let puzzle = generate_puzzle(&sequence);
  let mut is_valid = validate(&puzzle).is_ok();
  println!("{}", puzzle);
  println!("The current puzzle is {}", if is_valid { "valid" } else { "not valid" });
  println!("-----------------------------------");
  while !is_valid {
    let sequence = generate_solution(6, true);
    let puzzle = generate_puzzle(&sequence);
    println!("{}", puzzle);
    is_valid = validate(&puzzle).is_ok();      
    println!("The current puzzle is {}", if is_valid { "valid" } else { "not valid" });
    println!("-----------------------------------");
  }
}