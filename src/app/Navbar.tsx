import {CONFIG} from '@/config';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="flex gap-1">
      <h1>Warehouse Helper</h1>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href={CONFIG.DOCS_URL} target="_blank">
        Docs
      </Link>
    </nav>
  );
}
