use proto::domino_server::{Domino, DominoServer};
use tonic::{transport::Server, Response};
use utils::cors;
use db::{insert_puzzle, select_puzzle};
use domino_lib::functionalities::{generate::generate_puzzle, validate::validate_puzzle, solve::solve_puzzle, classify::classify_puzzle};

mod utils;
mod db;
pub mod proto {
    tonic::include_proto!("domino");

    pub(crate) const FILE_DESCRIPTOR_SET: &[u8] =
        tonic::include_file_descriptor_set!("domino_descriptor");
}

#[derive(Debug, Default)]
struct DominoService;

#[tonic::async_trait]
impl Domino for DominoService {
    async fn select_puzzle(&self, request: tonic::Request<proto::SelectPuzzleRequest>)
        -> Result<tonic::Response<proto::SelectPuzzleResponse>, tonic::Status> {
        println!("Received request: {:?}", request);
        let message = request.get_ref();
        let n = message.n;
        let c = message.c;
        let puzzle = select_puzzle(n, c);
        if let Ok(puzzle) = puzzle {
            let proto_puzzle = proto::Puzzle { tiles: puzzle.into_iter().map(|tile| proto::Tile { left: tile.unwrap().0, right: tile.unwrap().1 }).collect() };
            let response = proto::SelectPuzzleResponse { puzzle: Some(proto_puzzle) };
            Ok(Response::new(response))                
        } else {
            Err(tonic::Status::not_found("Puzzle not found"))
        }
    }
    
    async fn insert_puzzles(&self, request: tonic::Request<proto::InsertPuzzlesRequest>)
        -> Result<tonic::Response<proto::InsertPuzzlesResponse>, tonic::Status> {
        println!("Received request: {:?}", request);
        let message = request.get_ref();
        let number_of_puzzles = message.number_of_puzzles;
        let chunk_size = number_of_puzzles / 3;
        let mut inserted = 0;
        let mut n = 3;
        for _ in 0..3 {
            n += 3;
            for _ in 0..chunk_size {
                // generate puzzle
                let puzzle = generate_puzzle(n, true);
                // validate puzzle
                if validate_puzzle(&puzzle).is_err() {
                    continue;
                }
                // solve puzzle
                let solution = solve_puzzle(&puzzle).unwrap();
                // classify puzzle
                let c = classify_puzzle(&puzzle);
                let result: bool = insert_puzzle(puzzle, solution, n, c).unwrap();
                if result {
                    inserted += 1;
                }   
            }
        }
        let response = proto::InsertPuzzlesResponse { inserted };
        Ok(Response::new(response))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:50051".parse()?;
    println!("Listening on {}", addr);

    let service = tonic_reflection::server::Builder::configure()
        .register_encoded_file_descriptor_set(proto::FILE_DESCRIPTOR_SET)
        .build()?;

    let domino = DominoService::default();

    Server::builder()
        .accept_http1(true)
        .layer(cors())
        .add_service(service)
        .add_service(tonic_web::enable(DominoServer::new(domino)))
        .serve(addr)
        .await?;

    Ok(())
}