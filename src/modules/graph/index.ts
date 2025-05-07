import {rectangleGrid} from '@turf/turf';
import rbush from '@turf/geojson-rbush';
import {BBox, Feature, FeatureCollection, Polygon} from 'geojson';

export function createRectangleGrid(
  bounds: BBox,
  size: {width: number; height: number}
): FeatureCollection<Polygon> {
  return rectangleGrid(bounds, size.width, size.height, {
    units: 'degrees',
  });
}

export function filterGridByCollisions(
  gridCells: Feature<Polygon>[],
  objects: Feature<Polygon>[]
): FeatureCollection<Polygon> {
  const collection = rbush();

  gridCells.forEach(f => collection.insert(f));

  objects.forEach(f => {
    const collisions = collection.search(f);
    collisions.features.forEach(f => collection.remove(f));
  });

  return collection.all();
}
