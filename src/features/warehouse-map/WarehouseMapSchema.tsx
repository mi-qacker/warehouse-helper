import {useWarehouseStore} from '@/storages/warehouse-storage';
import clsx from 'clsx';
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

      {svgCells}

      <LoadingPointSvgCircle type="input" />
      <LoadingPointSvgCircle type="output" />
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
  const {placement, getProduct, getCell} = useWarehouseStore();
  const cell = getCell(props.cellId);

  const productsInCell = placement?.[props.cellId]
    .map(productId => getProduct(productId))
    .filter(product => product !== undefined);

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

      {productsInCell && productsInCell.length > 0 && (
        <text
          x={cell.position.x + NAME_PADDING}
          y={cell.position.y + NAME_PADDING + 8}
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
    warehouse: {inputPosition, outputPosition},
  } = useWarehouseStore();

  const position = useMemo(
    () => (props.type === 'input' ? inputPosition : outputPosition),
    [inputPosition, outputPosition, props.type]
  );

  const RADIUS = 5;
  return (
    <>
      <circle
        cx={position.x}
        cy={position.y}
        r={RADIUS}
        className={clsx({
          'fill-red-700': props.type === 'input',
          'fill-yellow-700': props.type === 'output',
        })}
      />
      <text
        x={position.x}
        y={position.y}
        className="fill-stone-900 text-xs"
        style={{dominantBaseline: 'hanging'}}
      >
        {props.type}
      </text>
    </>
  );
}
