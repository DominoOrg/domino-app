use sea_orm_migration::prelude::*;

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
                    .add_column(
                        ColumnDef::new(Puzzle::SolvedBy)
                        .string()
                        .not_null()    
                    )
                    .to_owned()
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter().table(Puzzle::Table)
                .drop_column(Puzzle::SolvedBy)
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