import Link from 'next/link';

const LIST_LINKS: {href: string; label: string}[] = [
  {href: '/parameters', label: 'Warehouse Parameters'},
  {href: '/map', label: 'Warehouse Map'},
  {href: '/placement', label: 'Optimize products placement'},
  {href: '/trail', label: 'Optimize route'},
];

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl py-6">
      <h1 className="mb-4 text-3xl font-bold text-blue-800">
        Warehouse Helper
      </h1>
      <h2 className="mb-3 text-2xl font-semibold text-gray-700">Usage</h2>
      <p className="mb-6 leading-relaxed text-gray-600">
        First, add information about products, cells, and the warehouse itself
        in the parameters. After that, all warehouse elements will be displayed
        on the warehouse map. If you need to optimize product placement in cells
        or build an optimal route to the required cells, go to the corresponding
        sections.
      </p>
      <ol className="list-decimal space-y-3">
        {LIST_LINKS.map(({label, href}) => (
          <li key={href}>
            <Link
              href={href}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {label}
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
