use sea_orm_migration::prelude::*;

use crate::m20241115_000003_create_collection_table::Collection;

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
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk-collection_id")
                        .from(Puzzle::Table, Puzzle::CollectionId)
                        .to(Collection::Table, Collection::Id)
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
}