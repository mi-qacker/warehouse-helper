import {getUUID} from '@/storages/common';
import rbush from '@turf/geojson-rbush';
import {center, lineString, rectangleGrid} from '@turf/turf';
import {
  BBox,
  Feature,
  FeatureCollection,
  LineString,
  Point,
  Polygon,
} from 'geojson';
import ngraph_graph, {Graph} from 'ngraph.graph';
import knn from 'rbush-knn';

const NEIGHBORS_COUNT = 8;

export function createRectangleGrid(
  bounds: BBox,
  size: {width: number; height: number}
): FeatureCollection<Polygon> {
  const gridFeatures: FeatureCollection<Polygon> = rectangleGrid(
    bounds,
    size.width,
    size.height,
    {
      units: 'degrees',
    }
  );
  gridFeatures.features.forEach(feature => {
    feature.id = getUUID('grid');
  });
  return gridFeatures;
}

export function filterGridByCollisions(
  gridCells: Feature<Polygon>[],
  objects: Feature<Polygon>[]
): FeatureCollection<Polygon> {
  const rbushTree = rbush();

  gridCells.forEach(f => rbushTree.insert(f));

  objects.forEach(f => {
    const collisions = rbushTree.search(f);
    collisions.features.forEach(f => rbushTree.remove(f));
  });

  return rbushTree.all();
}

export function createGraph(
  gridFeatures: FeatureCollection<Polygon>,
  warehousePoints: Feature<Point>[],
  cellPoints: Feature<Point>[],
  options?: Partial<{maxDistance: number}>
): Graph<Feature<Point>, Feature<LineString>> {
  const rbushTree = rbush();
  rbushTree.load(gridFeatures);

  const graph = ngraph_graph<Feature<Point>, Feature<LineString>>();

  warehousePoints.forEach((point, index) => {
    const {
      coordinates: [x, y],
    } = point.geometry;
    const pointId = `warehouse_${index}`;
    graph.addNode(pointId, point);
    const neighbors: Feature<Polygon>[] = knn(
      rbushTree,
      x,
      y,
      NEIGHBORS_COUNT,
      undefined,
      options?.maxDistance
    );

    neighbors.forEach(polygon => {
      const polygonCenterPoint = center(polygon);
      const polygonId = getUUID('grid');
      graph.addNode(polygonId, polygonCenterPoint);
      graph.addLink(
        pointId,
        polygonId,
        lineString([
          point.geometry.coordinates,
          polygonCenterPoint.geometry.coordinates,
        ])
      );
    });
  });

  cellPoints.forEach((point, index) => {
    const {
      coordinates: [x, y],
    } = point.geometry;
    const pointId = `cell_${index}`;
    graph.addNode(pointId, point);
    const neighbors: Feature<Polygon>[] = knn(
      rbushTree,
      x,
      y,
      NEIGHBORS_COUNT,
      undefined,
      options?.maxDistance
    );

    neighbors.forEach(polygon => {
      const polygonCenterPoint = center(polygon);
      const polygonId = getUUID('grid');
      graph.addNode(polygonId, polygonCenterPoint);
      graph.addLink(
        pointId,
        polygonId,
        lineString([
          point.geometry.coordinates,
          polygonCenterPoint.geometry.coordinates,
        ])
      );
    });
  });

  gridFeatures.features.forEach(gridPolygon => {
    const centerPoint = center(gridPolygon);
    centerPoint.id = gridPolygon.id!;
    const {
      coordinates: [x, y],
    } = centerPoint.geometry;
    graph.addNode(centerPoint.id, centerPoint);

    const neighbors: Feature<Polygon>[] = knn(
      rbushTree,
      x,
      y,
      NEIGHBORS_COUNT,
      undefined,
      options?.maxDistance
    );
    neighbors.forEach(polygon => {
      const polygonCenterPoint = center(polygon);
      polygonCenterPoint.id = polygon.id!;
      graph.addNode(polygonCenterPoint.id, polygonCenterPoint);
      graph.addLink(
        centerPoint.id!,
        polygonCenterPoint.id,
        lineString([
          centerPoint.geometry.coordinates,
          polygonCenterPoint.geometry.coordinates,
        ])
      );
    });
  });

  return graph;
}
