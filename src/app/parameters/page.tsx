import Link from 'next/link';
import {PARAMS_LINKS} from './common';

export default function ParametersPage() {
  return (
    <main className="w-full py-6">
      <h1 className="mb-4 text-3xl font-bold text-gray-800">
        Warehouse Parameters
      </h1>
      <p className="mb-6 text-gray-600">
        This page allows you to configure warehouse parameters.
      </p>
      <ul className="space-y-2">
        {PARAMS_LINKS.map(({href, label}) => (
          <li key={href}>
            <Link href={href} className="text-blue-600 hover:underline">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
