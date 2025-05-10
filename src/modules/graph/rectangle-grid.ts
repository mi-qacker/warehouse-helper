import {getUUID} from '@/storages/common';
import rbush from '@turf/geojson-rbush';
import {rectangleGrid} from '@turf/turf';
import {BBox, Feature, FeatureCollection, Polygon} from 'geojson';

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
