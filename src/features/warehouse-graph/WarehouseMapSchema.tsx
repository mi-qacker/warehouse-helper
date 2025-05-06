import {useWarehouseStore} from '@/storages/warehouse-storage';
import {useMemo} from 'react';

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
      <WarehouseGraphGrid />
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

const NAME_PADDING = 1;
export function CellSvgRect(props: {cellId: string}) {
  const {getCell} = useWarehouseStore();
  const cell = getCell(props.cellId);

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
        x={cell.position.x + NAME_PADDING}
        y={cell.position.y + NAME_PADDING}
        className="fill-stone-900 text-[8px] font-bold"
        style={{dominantBaseline: 'hanging'}}
      >
        {cell.name}
      </text>
    </>
  );
}

function WarehouseGraphGrid() {
  const {graph, warehouse} = useWarehouseStore();

  const verticalLines = useMemo(() => {
    if (!graph) return null;
    const lines = [];

    for (let i = 0; i < warehouse.size.width; i += graph.size) {
      const x1 = i;
      const x2 = i;
      const y1 = 0;
      const y2 = warehouse.size.height;
      lines.push(
        <line
          key={`v-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          className="stroke-cyan-500 stroke-1"
          strokeDasharray="4"
        />
      );
    }
    return lines;
  }, [graph, warehouse.size.height, warehouse.size.width]);

  const horizontalLines = useMemo(() => {
    if (!graph) return null;
    const lines = [];

    for (let i = 0; i < warehouse.size.height; i += graph.size) {
      const x1 = 0;
      const x2 = warehouse.size.width;
      const y1 = i;
      const y2 = i;
      lines.push(
        <line
          key={`v-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          className="stroke-cyan-500 stroke-1"
          strokeDasharray="4"
        />
      );
    }
    return lines;
  }, [graph, warehouse.size.height, warehouse.size.width]);

  return (
    <>
      {verticalLines}
      {horizontalLines}
    </>
  );
}
