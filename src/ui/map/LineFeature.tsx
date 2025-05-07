import {Feature, LineString} from 'geojson';

export default function LineFeature(props: {
  feature: Feature<LineString>;
  className?: string;
  strokeDasharray?: string | number;
}) {
  const {geometry} = props.feature;

  const points: string = geometry.coordinates
    .map(([x, y]) => `${x}, ${y}`)
    .join(' ');

  return (
    <polyline
      points={points}
      className={props.className}
      strokeDasharray={props.strokeDasharray}
    />
  );
}
