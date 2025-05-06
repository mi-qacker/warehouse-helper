import {useWarehouseStore} from '@/storages/warehouse-storage';
import {useMemo} from 'react';

const SVG_PADDING = 10;

export default function WarehouseMapSchema() {
  const {warehouse, cells} = useWarehouseStore();

  const [x0, y0, x1, y1] = warehouse.bounds;

  const viewBox = `-${SVG_PADDING} -${SVG_PADDING} ${x1 - x0 + SVG_PADDING * 2} ${y1 - y0 + SVG_PADDING * 2}`;
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
  const {warehouse} = useWarehouseStore();
  const [x0, y0, x1, y1] = warehouse.bounds;

  return (
    <rect
      className="fill-stone-100 stroke-stone-500 stroke-2"
      x={x0}
      y={y0}
      width={x1 - x0}
      height={y1 - y0}
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
  const [x0, y0, x1, y1] = cell.bounds;

  return (
    <>
      <rect
        className="fill-blue-100 stroke-blue-500 stroke-2"
        x={x0}
        y={y0}
        width={x1 - x0}
        height={y1 - y0}
      />

      <text
        x={x0 + NAME_PADDING}
        y={y0 + NAME_PADDING}
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
  const [x0, y0, x1, y1] = warehouse.bounds;
  const width = x1 - x0;
  const height = y1 - y0;

  const verticalLines = useMemo(() => {
    if (!graph) return null;
    const lines = [];

    for (let i = 0; i < width; i += graph.size) {
      const x1 = i;
      const x2 = i;
      const y1 = 0;
      const y2 = height;
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
  }, [graph, height, width]);

  const horizontalLines = useMemo(() => {
    if (!graph) return null;
    const lines = [];

    for (let i = 0; i < height; i += graph.size) {
      const x1 = 0;
      const x2 = width;
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
  }, [graph, height, width]);

  return (
    <>
      {verticalLines}
      {horizontalLines}
    </>
  );
}
