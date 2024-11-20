use sea_orm_migration::prelude::*;

use crate::{m20241115_000001_create_tile_table::Tile, m20241115_000003_create_collection_table::Collection};

pub struct Migration;

impl MigrationName for Migration {
    fn name(&self) -> &str {
        "m20241115_000002_create_tile_placement_table" // Make sure this matches with the file name
    }
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(TilePlacement::Table)
                    .col(
                        ColumnDef::new(TilePlacement::CollectionId)
                        .string()
                        .not_null()
                    )
                    .col(
                        ColumnDef::new(TilePlacement::TileId)
                        .string()
                        .not_null()
                    )
                    .col(ColumnDef::new(TilePlacement::Position).integer().not_null())
                    .col(ColumnDef::new(TilePlacement::Rotation).boolean().not_null())
                    .primary_key(
                        Index::create()
                            .col(TilePlacement::TileId)
                            .col(TilePlacement::CollectionId)
                    )                    
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-tile_id")
                            .from(TilePlacement::Table, TilePlacement::TileId)
                            .to(Tile::Table, Tile::Id)
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-collection_id")
                            .from(TilePlacement::Table, TilePlacement::CollectionId)
                            .to(Collection::Table, Collection::Id)
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(TilePlacement::Table).to_owned())
            .await
    }
}

#[derive(Iden)]
pub enum TilePlacement {
    Table,
    CollectionId,
    TileId,
    Position,
    Rotation
}