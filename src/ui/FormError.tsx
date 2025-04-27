import {PropsWithChildren} from 'react';

export default function FormError(props: PropsWithChildren) {
  return <span className="text-sm text-red-500">{props.children}</span>;
}
