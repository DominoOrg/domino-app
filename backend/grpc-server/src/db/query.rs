use domino_lib::types::{Puzzle, Tile};

pub fn query_puzzle(n: usize, c: usize) -> Result<Puzzle, sqlite::Error> {
    let mut puzzle = Puzzle::default();
    let connection = sqlite::open(":memory:").unwrap();
    let mut stmt = "
        SELECT P.id
        FROM puzzle P, collection C
        WHERE n = ".to_owned() + &n.to_string() + " 
        AND c = " + &c.to_string() + " 
        AND P.collection_id = C.id
    ";
    let mut puzzle_id: Option<String> = None;
    connection.iterate(stmt, |result| {
        for (column, value) in result {
            println!("{:?}: {:?}", column, value);
            if column.to_string() == "id".to_string() {
                puzzle_id = value.map(|s| s.to_string());
                break;
            }
        }
        true
    }).expect("Error fetching the puzzle id");

    let mut tiles_info: Vec<(String, String)> = vec![];
    stmt = "SELECT tile_id, position FROM inserted_tile WHERE collection_id = ".to_owned() + &puzzle_id.unwrap();
    connection.iterate(stmt, |result| {
        let mut tile_info: (String, String) = ("".to_string(), "".to_string());
        for (column, value) in result {
            println!("{:?}: {:?}", column, value);

            if column.to_string() == "tile_id".to_string() {
                tile_info.0 = value.unwrap().to_owned();
            } else if column.to_string() == "position".to_string() {
                tile_info.1 = value.unwrap().to_owned();
            }
        }
        tiles_info.push(tile_info);
        true
    }).expect("Error fetching inserted tiles");

    let mut tiles: Vec<Option<Tile>> = vec![];
    for tile_info in tiles_info {
        stmt = "SELECT left, right FROM tile WHERE id = ".to_owned() + &tile_info.0;
        connection.iterate(stmt, |result| {
            let mut left = 0;
            let mut right = 0;

            for (column, value) in result {
                println!("{:?}: {:?}", column, value);

                if column.to_string() == "left".to_string() {
                    left = value.unwrap().parse::<i32>().unwrap();
                } else if column.to_string() == "right".to_string() {
                    right = value.unwrap().parse::<i32>().unwrap();
                }
            }

            let tile = Tile(left, right);

            tiles.push(Some(tile));
            true
        }).expect("Error fetching the tiles");
    }
    puzzle.extend_from_slice(tiles.as_slice());
    Ok(puzzle)
}

pub fn mutation(query: String) -> Result<(), sqlite::Error> {
    let connection = sqlite::open(":memory:").unwrap();
    connection.execute(query)
}