import type {PropsWithChildren} from 'react';
import type {BBox} from 'geojson';
export default function MapComponent(
  props: PropsWithChildren<{
    bounds: BBox;
    width?: string | number;
    height?: string | number;
    padding?: number;
  }>
) {
  const [x0, y0, x1, y1] = props.bounds;
  const svgPadding = props.padding ?? 0;
  const minX = -1 * svgPadding;
  const minY = -1 * svgPadding;
  const width = x1 - x0 + svgPadding * 2;
  const height = y1 - y0 + svgPadding * 2;
  const viewBox = `${minX} ${minY} ${width} ${height}`;

  return (
    <svg
      className="rounded-sm border shadow-md"
      version="1.1"
      baseProfile="full"
      width={props.width}
      height={props.height}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
    >
      {props.children}
    </svg>
  );
}
