use super::model_execution_lib::execute;
use model::compute_model;

mod model;

type Puzzle = Vec<Option<(usize, usize)>>;

pub fn validate(puzzle: &Puzzle, n: usize) -> Result<(), String> {
    let model = compute_model(puzzle, n);
    let result = execute(model);
    if let Ok(_) = result {
        Ok(())
    } else {
        Err(result.err().unwrap())
    }
}

#[cfg(test)]
mod tests {
    use crate::lp_models::generate_sequence_model::generate_sequence;

    use crate::lp_models::validate_puzzle_model::validate;

    #[test]
    fn validate_valid_puzzle() {
        for n in 2..=4 {
            let sequence = generate_sequence(n, false).unwrap();
            let mut puzzle = sequence
                .into_iter()
                .map(|tile| Some(tile))
                .collect::<Vec<Option<(usize, usize)>>>();
            puzzle[0] = None;
            assert!(validate(&puzzle, n).is_ok());
        }
    }

    #[test]
    fn validate_invalid_puzzle() {
        for n in 2..=4 {
            let sequence = generate_sequence(n, false).unwrap();
            let mut puzzle = sequence
                .into_iter()
                .map(|tile| Some(tile))
                .collect::<Vec<Option<(usize, usize)>>>();
            for i in 0..puzzle.len() {
                puzzle[i] = None;
            }
            assert!(validate(&puzzle, n).is_err());
        }
    }
}
