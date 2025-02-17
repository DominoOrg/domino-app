import { ReactNode } from "react";

export const TileHalve = ({ value, sideIndex, color }: { value: number, sideIndex: number, color: string }) => {
    let result: ReactNode[] = [];
    const rotation = sideIndex % 2 == 0;
    const size = !rotation? 'w-[1/2]': 'h-[1/2]';
    switch(value) {
        case 0:
            break;
        case 1:
            result = [
                <Dot key={0} size={size} row={4} column={4} color={color}/>
            ];
            break;
        case 2:
            result = [
                <Dot key={0} size={size} row={!rotation? 4: 2} column={!rotation? 2: 4} color={color}/>,
                <Dot key={1} size={size} row={!rotation? 4: 6} column={!rotation? 6: 4} color={color}/>,
            ]
            break;
        case 3:
            result = [
                <Dot key={0} size={size} row={!rotation? 4: 2} column={!rotation? 2: 4} color={color}/>,
                <Dot key={1} size={size} row={4} column={4} color={color}/>,
                <Dot key={2} size={size} row={!rotation? 4: 6} column={!rotation? 6: 4} color={color}/>,
            ]
            break;
        case 4:
            result = [
                <Dot key={0} size={size} row={2} column={2} color={color}/>,
                <Dot key={1} size={size} row={2} column={6} color={color}/>,
                <Dot key={2} size={size} row={6} column={2} color={color}/>,
                <Dot key={3} size={size} row={6} column={6} color={color}/>,
            ]
            break;
        case 5:
            result = [
                <Dot key={0} size={size} row={2} column={2} color={color}/>,
                <Dot key={1} size={size} row={2} column={6} color={color}/>,
                <Dot key={2} size={size} row={4} column={4} color={color}/>,
                <Dot key={3} size={size} row={6} column={2} color={color}/>,
                <Dot key={4} size={size} row={6} column={6} color={color}/>,
            ]
            break;
        case 6:
            result = [
                <Dot key={0} size={size} row={2} column={2} color={color}/>,
                <Dot key={1} size={size} row={2} column={6} color={color}/>,
                <Dot key={2} size={size} row={!rotation? 4: 2} column={!rotation? 2: 4} color={color}/>,
                <Dot key={3} size={size} row={!rotation? 4: 6} column={!rotation? 6: 4} color={color}/>,
                <Dot key={4} size={size} row={6} column={2} color={color}/>,
                <Dot key={5} size={size} row={6} column={6} color={color}/>,
            ]
            break;
        case 7:
            result = [
                <Dot key={0} size={size} row={2} column={2} color={color}/>,
                <Dot key={1} size={size} row={2} column={6} color={color}/>,
                <Dot key={2} size={size} row={!rotation? 4: 2} column={!rotation? 2: 4} color={color}/>,
                <Dot key={3} size={size} row={4} column={4} color={color}/>,
                <Dot key={4} size={size} row={!rotation? 4: 6} column={!rotation? 6: 4} color={color}/>,
                <Dot key={5} size={size} row={6} column={2} color={color}/>,
                <Dot key={6} size={size} row={6} column={6} color={color}/>,
            ]
            break;
        case 8:
            result = [
                <Dot key={0} size={size} row={2} column={2} color={color}/>,
                <Dot key={1} size={size} row={!rotation? 4: 2} column={!rotation? 2: 4} color={color}/>,
                <Dot key={2} size={size} row={2} column={6} color={color}/>,
                <Dot key={3} size={size} row={!rotation? 2: 4} column={!rotation? 4: 2} color={color}/>,
                <Dot key={4} size={size} row={!rotation? 6: 4} column={!rotation? 4: 6} color={color}/>,
                <Dot key={5} size={size} row={6} column={2} color={color}/>,
                <Dot key={6} size={size} row={!rotation? 4: 6} column={!rotation? 6: 4} color={color}/>,
                <Dot key={7} size={size} row={6} column={6} color={color}/>,
            ]
            break;
        case 9:
            result = [
                <Dot key={0} size={size} row={2} column={2} color={color}/>,
                <Dot key={1} size={size} row={!rotation? 4: 2} column={!rotation? 2: 4} color={color}/>,
                <Dot key={2} size={size} row={2} column={6} color={color}/>,
                <Dot key={3} size={size} row={!rotation? 2: 4} column={!rotation? 4: 2} color={color}/>,
                <Dot key={4} size={size} row={4} column={4} color={color}/>,
                <Dot key={5} size={size} row={!rotation? 6: 4} column={!rotation? 4: 6} color={color}/>,
                <Dot key={6} size={size} row={6} column={2} color={color}/>,
                <Dot key={7} size={size} row={!rotation? 4: 6} column={!rotation? 6: 4} color={color}/>,
                <Dot key={8} size={size} row={6} column={6} color={color}/>,
            ]
            break;
    }

    return <div
        style={{
            display: "grid",
            gridRowStart: sideIndex === 0? 1: 2,
            gridColumnStart: sideIndex === 0? 2: 1,
            gridTemplateRows: `repeat(7, 1fr)`,
            gridTemplateColumns: `repeat(7, 1fr)`,            
        }}
        className="aspect-square p-0.5"
        >
        {result}
    </div>;
}

const Dot = ({size, row, column, color}: {size: string, row: number, column: number, color: string}) => {
    return <span
            style={{
                gridRowStart: row,
                gridColumnStart: column,
                gridRowEnd: row + 1,
                gridColumnEnd: column + 1
            }}
            className={`${size} aspect-square ${color} rounded-full`}></span>;
}