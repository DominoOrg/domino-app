use rocket::serde::{Deserialize, Serialize};
use rocket_okapi::okapi::schemars::{self, JsonSchema};

#[derive(Clone, Debug, PartialEq, Eq, Deserialize, Serialize, JsonSchema)]
#[serde(crate = "rocket::serde")]
pub struct PuzzleDto {
    pub id: String,
    pub puzzle: Vec<Option<(i32, i32)>> 
}