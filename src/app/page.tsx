import Link from 'next/link';

export default function Page() {
  return (
    <main>
      <h1>Warehouse helper</h1>
      <h2>Usage</h2>
      <p>
        First, add information about products, cells, and the warehouse itself
        in the parameters. After that, all warehouse elements will be displayed
        on the warehouse map. If you need to optimize product placement in cells
        or build an optimal route to the required cells, go to the corresponding
        sections.
      </p>
      <ol>
        <li>
          <Link href="/parameters">Warehouse Parameters</Link>
        </li>
        <li>
          <Link href="/map">Warehouse Map</Link>
        </li>
        <li>
          <Link href="/placement">Optimize products placement</Link>
        </li>
        <li>
          <Link href="/trail">Optimize route</Link>
        </li>
      </ol>
    </main>
  );
}
