import {createRectangleGrid, filterGridByCollisions} from '@/modules/graph';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import Map from '@/ui/map/Map';
import PolygonFeature from '@/ui/map/PolygonFeature';
import Text from '@/ui/map/Text';
import {bboxPolygon, point} from '@turf/turf';

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

  if (!graph) return null;

  const grid = createRectangleGrid(warehouse.bounds, {
    width: graph.size,
    height: graph.size,
  });

  const filteredGrid = filterGridByCollisions(
    grid.features,
    cells.map(cell => bboxPolygon(cell.bounds))
  );

  return (
    <>
      {filteredGrid.features.map((feature, i) => (
        <PolygonFeature
          key={i}
          feature={feature}
          className="fill-none stroke-blue-400 stroke-1"
        />
      ))}
    </>
  );
}
