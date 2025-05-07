import {Feature, Polygon} from 'geojson';

export default function PolygonFeature(props: {
  feature: Feature<Polygon>;
  className?: string;
}) {
  const {geometry} = props.feature;

  const points: string = geometry.coordinates[0]
    .map(([x, y]) => `${x}, ${y}`)
    .join(' ');

  return <polygon points={points} className={props.className} />;
}
