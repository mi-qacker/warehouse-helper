import {useWarehouseStore} from '@/storages/warehouse-storage';

const SVG_PADDING = 10;

export default function WarehouseMapSchema() {
  const {warehouse, cells} = useWarehouseStore();

  const viewBox = `-${SVG_PADDING} -${SVG_PADDING} ${warehouse.size.width + SVG_PADDING * 2} ${warehouse.size.height + SVG_PADDING * 2}`;
  const svgCells = cells.map(({id}) => <CellSvgRect key={id} cellId={id} />);

  return (
    <svg
      className="rounded-sm border shadow-md"
      version="1.1"
      baseProfile="full"
      width="100%"
      height="480"
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
    >
      <WarehouseSvgRect />
      {svgCells}
    </svg>
  );
}

export function WarehouseSvgRect() {
  const {
    warehouse: {size},
  } = useWarehouseStore();

  return (
    <rect
      className="fill-stone-100 stroke-stone-500 stroke-2"
      x="0"
      y="0"
      width={size.width}
      height={size.height}
    />
  );
}

export function CellSvgRect(props: {cellId: string}) {
  const {getCell} = useWarehouseStore();
  const cell = getCell(props.cellId);
  const namePadding = 1;

  if (!cell) {
    return null;
  }

  return (
    <>
      <rect
        className="fill-blue-100 stroke-blue-500 stroke-2"
        x={cell.position.x}
        y={cell.position.y}
        width={cell.size.width}
        height={cell.size.height}
      />
      <text
        x={cell.position.x + namePadding}
        y={cell.position.y + namePadding}
        className="fill-stone-600 text-xs"
        style={{dominantBaseline: 'hanging'}}
      >
        {cell.name}
      </text>
    </>
  );
}
