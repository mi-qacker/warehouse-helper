import rbush from '@turf/geojson-rbush';
import {center, lineString} from '@turf/turf';
import {Feature, FeatureCollection, LineString, Point, Polygon} from 'geojson';
import ngraph_graph, {Graph} from 'ngraph.graph';
import knn from 'rbush-knn';

const NEIGHBORS_COUNT = 8;

export function createGraph(
  gridFeatures: FeatureCollection<Polygon>,
  warehousePoints: Feature<Point>[],
  cellPoints: Feature<Point>[],
  options?: Partial<{maxDistance: number}>
): Graph<Feature<Point>, Feature<LineString>> {
  const rbushTree = rbush();
  rbushTree.load(gridFeatures);

  const findKNN = (point: Point) => {
    const [x, y] = point.coordinates;
    return knn(
      rbushTree,
      x,
      y,
      NEIGHBORS_COUNT,
      undefined,
      options?.maxDistance
    );
  };

  const graph = ngraph_graph<Feature<Point>, Feature<LineString>>();

  warehousePoints.forEach((warehousePoint, index) => {
    const warehousePointId = `warehouse_${index}`;
    graph.addNode(warehousePointId, warehousePoint);
    const neighbors: Feature<Polygon>[] = findKNN(warehousePoint.geometry);

    neighbors.forEach(gridPolygon => {
      const gridPolygonCenter = center(gridPolygon);
      gridPolygonCenter.id = gridPolygon.id!;
      const linkLineString = lineString([
        warehousePoint.geometry.coordinates,
        gridPolygonCenter.geometry.coordinates,
      ]);
      graph.addNode(gridPolygonCenter.id, gridPolygonCenter);
      graph.addLink(warehousePointId, gridPolygonCenter.id, linkLineString);
      //   graph.addLink(gridPolygonCenter.id, warehousePointId, linkLineString);
    });
  });

  cellPoints.forEach((cellPoint, index) => {
    const cellPointId = cellPoint.id!;
    graph.addNode(cellPointId, cellPoint);
    const neighbors: Feature<Polygon>[] = findKNN(cellPoint.geometry);

    neighbors.forEach(gridPolygon => {
      const gridPolygonCenter = center(gridPolygon);
      gridPolygonCenter.id = gridPolygon.id!;
      graph.addNode(gridPolygonCenter.id, gridPolygonCenter);
      const linkLineString = lineString([
        cellPoint.geometry.coordinates,
        gridPolygonCenter.geometry.coordinates,
      ]);
      graph.addLink(cellPointId, gridPolygonCenter.id, linkLineString);
      //   graph.addLink(gridPolygonCenter.id, cellPointId, linkLineString);
    });
  });

  gridFeatures.features.forEach(gridPolygon => {
    const centerPoint = center(gridPolygon);
    centerPoint.id = gridPolygon.id!;
    graph.addNode(centerPoint.id, centerPoint);

    const neighbors: Feature<Polygon>[] = findKNN(centerPoint.geometry);
    neighbors.forEach(neighborGridPolygon => {
      const polygonCenterPoint = center(neighborGridPolygon);
      polygonCenterPoint.id = neighborGridPolygon.id!;
      graph.addNode(polygonCenterPoint.id, polygonCenterPoint);
      const linkLineString = lineString([
        centerPoint.geometry.coordinates,
        polygonCenterPoint.geometry.coordinates,
      ]);
      graph.addLink(centerPoint.id!, polygonCenterPoint.id, linkLineString);
    });
  });

  return graph;
}
