import {
  createGraph,
  createRectangleGrid,
  filterGridByCollisions,
} from '@/modules/graph';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import LineFeature from '@/ui/map/LineFeature';
import Map from '@/ui/map/Map';
import PointFeature from '@/ui/map/PointFeature';
import PolygonFeature from '@/ui/map/PolygonFeature';
import Text from '@/ui/map/Text';
import {bboxPolygon, point} from '@turf/turf';
import {JSX, useMemo} from 'react';

const SVG_PADDING = 10;

export default function WarehouseMapSchema() {
  const {warehouse, cells} = useWarehouseStore();

  return (
    <Map
      width="100%"
      height="480"
      bounds={warehouse.bounds}
      padding={SVG_PADDING}
    >
      <PolygonFeature
        feature={bboxPolygon(warehouse.bounds)}
        className="fill-stone-100 stroke-stone-500 stroke-2"
      />

      <WarehouseGraphGrid />

      {cells.map(({id}) => (
        <CellSvgRect key={id} cellId={id} />
      ))}
    </Map>
  );
}

export function CellSvgRect(props: {cellId: string}) {
  const {getCell} = useWarehouseStore();
  const cell = getCell(props.cellId);

  if (!cell) {
    return null;
  }
  const [x0, y0] = cell.bounds;

  return (
    <>
      <PolygonFeature
        className="fill-blue-100 stroke-blue-500 stroke-2"
        feature={bboxPolygon(cell.bounds)}
      />

      <PointFeature
        radius={3}
        feature={cell.loadingPoint}
        className="fill-blue-600"
      />

      <Text
        feature={point([x0, y0])}
        className="fill-stone-900 text-[8px] font-bold"
        dominantBaseline="hanging"
      >
        {cell.name}
      </Text>
    </>
  );
}

function WarehouseGraphGrid() {
  const {graph, warehouse, cells} = useWarehouseStore();

  const grid = useMemo(
    () =>
      !graph
        ? null
        : createRectangleGrid(warehouse.bounds, {
            width: graph.size,
            height: graph.size,
          }),
    [graph, warehouse.bounds]
  );

  const filteredGrid = useMemo(
    () =>
      !grid
        ? null
        : filterGridByCollisions(
            grid.features,
            cells.map(cell => bboxPolygon(cell.bounds))
          ),
    [cells, grid]
  );

  const ngraph = useMemo(
    () =>
      !filteredGrid
        ? null
        : createGraph(
            filteredGrid,
            [warehouse.inputPoint, warehouse.outputPoint],
            cells.map(c => c.loadingPoint),
            {maxDistance: graph?.size}
          ),
    [
      cells,
      filteredGrid,
      graph?.size,
      warehouse.inputPoint,
      warehouse.outputPoint,
    ]
  );

  const link = useMemo(() => {
    const res: JSX.Element[] = [];
    ngraph?.forEachLink(n => {
      res.push(
        <LineFeature
          key={n.id}
          className="fill-none stroke-red-500 stroke-1"
          feature={n.data}
        />
      );
    });
    return res;
  }, [ngraph]);

  return (
    <>
      {filteredGrid?.features.map((feature, i) => (
        <PolygonFeature
          key={i}
          feature={feature}
          className="fill-none stroke-blue-400 stroke-1"
        />
      ))}
      {link}
    </>
  );
}
