import {PropsWithChildren} from 'react';

export default function ParametersLayout({children}: PropsWithChildren) {
  return <div className="mx-auto w-full max-w-4xl">{children}</div>;
}
