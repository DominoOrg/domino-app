use proto::domino_server::{Domino, DominoServer};
use tonic::{transport::Server, Response};
use utils::cors;
use db::{insert_puzzle, select_puzzle};
use domino_lib::{generate_puzzle, validate_puzzle, solve_puzzle, classify_puzzle};
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
        let response = proto::SelectPuzzleResponse { puzzle };
        Ok(Response::new(response))
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
                let puzzle = generate_puzzle(n);
                // validate puzzle
                if !validate_puzzle(&puzzle) {
                    continue;
                }
                // solve puzzle
                let solution = solve_puzzle(&puzzle);
                // classify puzzle
                let c = classify_puzzle(&puzzle);
                let result: bool = insert_puzzle(puzzle, solution, n, c);
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