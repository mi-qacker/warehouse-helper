import type * as CSS from 'csstype';
import {Feature, Point} from 'geojson';
import type {CSSProperties, PropsWithChildren} from 'react';

export default function Text(
  props: PropsWithChildren<{
    feature: Feature<Point>;
    className?: string;
    dominantBaseline?: CSS.Property.DominantBaseline;
  }>
) {
  const {geometry} = props.feature;
  const [x, y] = geometry.coordinates;
  const style: CSSProperties = {dominantBaseline: props.dominantBaseline};

  return (
    <text x={x} y={y} className={props.className} style={style}>
      {props.children}
    </text>
  );
}
