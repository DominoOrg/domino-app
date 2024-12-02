use sea_orm_migration::prelude::*;

use crate::{m20241202_000003_create_collection_table::Collection, m20241202_000004_create_sequence_table::Sequence};

pub struct Migration;

impl MigrationName for Migration {
    fn name(&self) -> &str {
        "m20241115_000005_create_puzzle_table" // Make sure this matches with the file name
    }
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Puzzle::Table)
                    .col(
                        ColumnDef::new(Puzzle::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(Puzzle::CollectionId)
                        .string()
                        .not_null()
                    )
                    .col(
                        ColumnDef::new(Puzzle::Difficulty)
                        .integer()
                        .not_null()
                        .default(0)
                    )
                    .col(
                        ColumnDef::new(Puzzle::SolvedBy)
                        .string()
                        .not_null()    
                    )
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk-collection_id")
                        .from(Puzzle::Table, Puzzle::CollectionId)
                        .to(Collection::Table, Collection::Id)
                    )
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk-solved_by")
                        .from(Puzzle::Table, Puzzle::SolvedBy)
                        .to(Sequence::Table, Sequence::Id)
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Puzzle::Table).to_owned())
            .await
    }
}

#[derive(Iden)]
pub enum Puzzle {
    Table,
    Id,
    CollectionId,
    Difficulty,
    SolvedBy
}