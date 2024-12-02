use sea_orm_migration::prelude::*;

use crate::m20241115_000004_create_sequence_table::Sequence;

pub struct Migration;

impl MigrationName for Migration {
    fn name(&self) -> &str {
        "m20241202_000001_alter_puzzle_table" // Make sure this matches with the file name
    }
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Puzzle::Table)
                    .add_foreign_key(
                        ForeignKey::create()
                        .name("fk-solved_by")
                        .from(Puzzle::Table, Sequence::Id)
                        .to(Sequence::Table, Puzzle::SolvedBy)
                        .get_foreign_key()
                    )
                    .to_owned()
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter().table(Puzzle::Table)
                .drop_foreign_key(Puzzle::SolvedBy)
                .to_owned()
            )
            .await
    }
}

#[derive(Iden)]
pub enum Puzzle {
    Table,
    SolvedBy
}