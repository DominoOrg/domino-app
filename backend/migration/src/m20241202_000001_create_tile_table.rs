use sea_orm_migration::prelude::*;

pub struct Migration;

impl MigrationName for Migration {
    fn name(&self) -> &str {
        "m20241115_000001_create_tile_table" // Make sure this matches with the file name
    }
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Tile::Table)
                    .col(
                        ColumnDef::new(Tile::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Tile::LeftHalve).integer().not_null())
                    .col(ColumnDef::new(Tile::RightHalve).integer().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Tile::Table).to_owned())
            .await
    }
}

#[derive(Iden)]
pub enum Tile {
    Table,
    Id,
    LeftHalve,
    RightHalve,
}