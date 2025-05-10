import {
  createGraph,
  createRectangleGrid,
  filterGridByCollisions,
  findPath,
} from '@/modules/graph';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import LineFeature from '@/ui/map/LineFeature';
import Map from '@/ui/map/Map';
import PointFeature from '@/ui/map/PointFeature';
import PolygonFeature from '@/ui/map/PolygonFeature';
import Text from '@/ui/map/Text';
import {bboxPolygon, lineString, point} from '@turf/turf';
import {Feature, LineString, Point} from 'geojson';

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

  const nrgaph = createGraph(
    filteredGrid,
    [warehouse.inputPoint, warehouse.outputPoint],
    cells.map(c => c.loadingPoint),
    {maxDistance: Math.sqrt(Math.pow(graph.size, 2) * 2)}
  );

  const path = () => {
    const path = findPath(nrgaph, 'warehouse_0', 'warehouse_0'); // TODO: only for debug. remove me
    const feature = lineString(path.map(p => p.geometry.coordinates));
    return (
      <LineFeature
        feature={feature}
        className="fill-none stroke-red-800 stroke-2"
        strokeDasharray={6}
      />
    );
  };

  const links = () => {
    const links: {id: string; feature: Feature<LineString>}[] = [];
    nrgaph.forEachLink(link => {
      links.push({id: link.id, feature: link.data});
    });
    return links.map(l => (
      <LineFeature
        key={l.id}
        feature={l.feature}
        className="fill-none stroke-red-400 stroke-1"
      />
    ));
  };

  const nodes = () => {
    const nodes: {id: string | number; feature: Feature<Point>}[] = [];
    nrgaph.forEachNode(node => {
      nodes.push({id: node.id, feature: node.data});
    });
    return nodes.map(node => (
      <PointFeature
        key={node.id}
        feature={node.feature}
        radius={3}
        className="fill-none stroke-blue-400 stroke-1"
      />
    ));
  };

  return (
    <>
      {/* {filteredGrid.features.map((feature, i) => (
        <PolygonFeature
          key={i}
          feature={feature}
          className="fill-none stroke-blue-400 stroke-1"
        />
      ))} */}
      {links()}
      {nodes()}
      {path()}
    </>
  );
}
