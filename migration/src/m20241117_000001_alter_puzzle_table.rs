use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Puzzle::Table)
                    .add_column(
                        ColumnDef::new(Puzzle::Difficulty)
                            .integer()
                            .not_null()
                            .default(0)
                    )
                    .to_owned()
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Puzzle::Table)
                    .drop_column(Puzzle::Difficulty)
                    .to_owned()
            )
            .await
    }
}

#[derive(DeriveIden)]
enum Puzzle {
    Table,
    Difficulty,
}
