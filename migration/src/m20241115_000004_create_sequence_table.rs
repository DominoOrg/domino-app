use sea_orm_migration::prelude::*;

use crate::m20241115_000003_create_collection_table::Collection;

pub struct Migration;

impl MigrationName for Migration {
    fn name(&self) -> &str {
        "m20241115_000004_create_sequence_table" // Make sure this matches with the file name
    }
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Sequence::Table)
                    .col(
                        ColumnDef::new(Sequence::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(Sequence::CollectionId)
                        .string()
                        .not_null()
                    )
                    .foreign_key(
                        ForeignKey::create()
                        .name("fk-collection_id")
                        .from(Sequence::Table, Sequence::CollectionId)
                        .to(Collection::Table, Collection::Id)
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Sequence::Table).to_owned())
            .await
    }
}

#[derive(Iden)]
pub enum Sequence {
    Table,
    Id,
    CollectionId,
}