import Link from 'next/link';
import {PropsWithChildren} from 'react';
import {PARAMS_LINKS} from './common';

export default function ParametersLayout({children}: PropsWithChildren) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex flex-row gap-4 py-2">
        <span>Select params:</span>
        {PARAMS_LINKS.map(({href, label}) => (
          <Link
            key={href}
            href={href}
            className="text-blue-600 hover:underline"
          >
            {label}
          </Link>
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
}
