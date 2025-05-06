import {useWarehouseStore} from '@/storages/warehouse-storage';
import clsx from 'clsx';
import {ReactElement, useMemo} from 'react';

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
      <TrailSvgLines />

      {svgCells}

      <LoadingPointSvgCircle type="input" />
      <LoadingPointSvgCircle type="output" />
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
  const {placement, getProduct, getCell} = useWarehouseStore();
  const cell = getCell(props.cellId);

  const productsInCell = placement?.[props.cellId]
    .map(productId => getProduct(productId))
    .filter(product => product !== undefined);

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

      {productsInCell && productsInCell.length > 0 && (
        <text
          x={x0 + NAME_PADDING}
          y={y0 + NAME_PADDING + 8}
          className="fill-stone-600 text-[8px]"
          style={{dominantBaseline: 'hanging'}}
        >
          {productsInCell.map(p => p.name).join(', ')}
        </text>
      )}
    </>
  );
}

function LoadingPointSvgCircle(props: {type: 'input' | 'output'}) {
  const {
    warehouse: {inputPoint, outputPoint},
  } = useWarehouseStore();

  const position = useMemo(
    () => (props.type === 'input' ? inputPoint : outputPoint),
    [inputPoint, outputPoint, props.type]
  );

  const [x, y] = position.geometry.coordinates;

  const RADIUS = 5;
  return (
    <>
      <circle
        cx={x}
        cy={y}
        r={RADIUS}
        className={clsx({
          'fill-red-700': props.type === 'input',
          'fill-yellow-700': props.type === 'output',
        })}
      />
      <text
        x={x}
        y={y}
        className="fill-stone-900 text-xs"
        style={{dominantBaseline: 'hanging'}}
      >
        {props.type}
      </text>
    </>
  );
}

function TrailSvgLines() {
  const {
    route,
    warehouse: {inputPoint, outputPoint},
  } = useWarehouseStore();

  const points = useMemo(() => {
    if (!route) return [];
    return [inputPoint, ...route.map(cell => cell.loadingPoint), outputPoint];
  }, [inputPoint, outputPoint, route]);

  const lines = useMemo(() => {
    const linesElements: ReactElement[] = [];
    for (let i = 1; i < points.length; i++) {
      const [x1, y1] = points[i - 1].geometry.coordinates;
      const [x2, y2] = points[i].geometry.coordinates;
      linesElements.push(
        <line
          key={`${i - 1}-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          className="stroke-cyan-500 stroke-1"
          strokeDasharray="4"
        />
      );
    }
    return linesElements;
  }, [points]);

  return <>{lines}</>;
}
