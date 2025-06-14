import {ZoneCondition} from '@/storages/types';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import LineFeature from '@/ui/map/LineFeature';
import Map from '@/ui/map/Map';
import PointFeature from '@/ui/map/PointFeature';
import PolygonFeature from '@/ui/map/PolygonFeature';
import Text from '@/ui/map/Text';
import {bboxPolygon, point} from '@turf/turf';
import clsx from 'clsx';

const SVG_PADDING = 10;
const POINT_RADIUS = 5;
const PRODUCTS_MARGIN = 8;

export default function WarehouseMapSchema() {
  const {warehouse, cells, routeLineFeature} = useWarehouseStore();

  return (
    <Map
      width="100%"
      height="480"
      padding={SVG_PADDING}
      bounds={warehouse.bounds}
    >
      {/* Warehouse Polygon */}
      <PolygonFeature
        feature={bboxPolygon(warehouse.bounds)}
        className="fill-stone-100 stroke-stone-500 stroke-2"
      />

      {/* Show route */}
      {routeLineFeature?.features.map(feature => (
        <LineFeature
          key={feature.id}
          feature={feature}
          className="fill-none stroke-cyan-500 stroke-2"
          strokeDasharray="4"
        />
      ))}

      {cells.map(({id}) => (
        <CellSvgRect key={id} cellId={id} />
      ))}

      <>
        {/* Input Point */}
        <PointFeature
          feature={warehouse.inputPoint}
          radius={POINT_RADIUS}
          className="fill-red-700"
        />
        <Text
          feature={warehouse.inputPoint}
          className="fill-stone-900 text-xs"
          dominantBaseline="hanging"
        >
          input
        </Text>
      </>

      <>
        {/* Output Point */}
        <PointFeature
          feature={warehouse.outputPoint}
          radius={POINT_RADIUS}
          className="fill-yellow-700"
        />
        <Text
          feature={warehouse.outputPoint}
          className="fill-stone-900 text-xs"
          dominantBaseline="hanging"
        >
          output
        </Text>
      </>
    </Map>
  );
}

const conditionColor: Record<ZoneCondition, string> = {
  normal: 'fill-blue-100',
  cold: 'fill-slate-100',
  dry: 'fill-red-100',
};

export function CellSvgRect(props: {cellId: string}) {
  const {placement, getProduct, getCell} = useWarehouseStore();
  const cell = getCell(props.cellId);

  const productsInCell = (placement?.[props.cellId] ?? [])
    .map(productId => getProduct(productId))
    .filter(product => product !== undefined);

  if (!cell) {
    return null;
  }

  const [x0, y0] = cell.bounds;

  return (
    <>
      <PolygonFeature
        feature={bboxPolygon(cell.bounds)}
        className={clsx(
          'stroke-blue-500 stroke-2',
          conditionColor[cell.zoneCondition]
        )}
      />
      <Text
        feature={point([x0, y0])}
        className="fill-stone-900 text-[8px] font-bold"
        dominantBaseline="hanging"
      >
        {cell.name}
      </Text>

      {productsInCell &&
        productsInCell.length > 0 &&
        productsInCell.map((p, i) => (
          <Text
            key={p.id}
            feature={point([x0, y0 + PRODUCTS_MARGIN * (i + 1)])}
            className="fill-stone-600 text-[8px]"
            dominantBaseline="hanging"
          >
            {p.name}
          </Text>
        ))}
    </>
  );
}
