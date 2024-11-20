pub use sea_orm_migration::prelude::*;

mod m20241115_000001_create_tile_table;
mod m20241115_000002_create_tile_placement_table;
mod m20241115_000003_create_collection_table;
mod m20241115_000004_create_sequence_table;
mod m20241115_000005_create_puzzle_table;
mod m20241117_000001_alter_puzzle_table;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20241115_000001_create_tile_table::Migration),
            Box::new(m20241115_000002_create_tile_placement_table::Migration),
            Box::new(m20241115_000003_create_collection_table::Migration),
            Box::new(m20241115_000004_create_sequence_table::Migration),
            Box::new(m20241115_000005_create_puzzle_table::Migration),
            Box::new(m20241117_000001_alter_puzzle_table::Migration)
        ]
    }
}
