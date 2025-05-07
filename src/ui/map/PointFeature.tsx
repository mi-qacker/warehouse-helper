import {Feature, Point} from 'geojson';

export default function PointFeature(props: {
  feature: Feature<Point>;
  radius: number;
  className?: string;
}) {
  const [x, y] = props.feature.geometry.coordinates;
  return <circle cx={x} cy={y} r={props.radius} className={props.className} />;
}
