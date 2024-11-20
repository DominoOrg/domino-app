use domino_lib::graph_models::{
    generate_puzzle::generate_puzzle, generate_sequence::generate_solution,
};

fn main() {
    let n = 6;
    let sequence = generate_solution(n, true);
    println!("{sequence:?}");
    let puzzle = generate_puzzle(&sequence);
    println!("{puzzle:?}");
}
