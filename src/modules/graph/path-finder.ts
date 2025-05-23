import {Feature, LineString, Point} from 'geojson';
import {Graph} from 'ngraph.graph';
import ngraph_path from 'ngraph.path';
import {getDistance} from '@/modules/common';

export function findPath(
  ngraph: Graph<Feature<Point>, Feature<LineString>>,
  fromNode: string,
  toNode: string
): Feature<Point>[] {
  const pathFinder = ngraph_path.aStar(ngraph, {
    distance(from, to) {
      const distance = getDistance(from.data.geometry, to.data.geometry);
      return distance;
    },
  });

  const foundedPath = pathFinder.find(fromNode, toNode);
  return foundedPath.map(node => node.data);
}
