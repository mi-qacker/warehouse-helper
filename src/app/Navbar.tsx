import {CONFIG} from '@/config';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link className="text-2xl font-bold text-white" href="/">
          Warehouse Helper
        </Link>

        <div className="flex space-x-4">
          <NavbarLink label="Home" href="/" />
          <NavbarLink label="Docs" href={CONFIG.DOCS_URL} blank />
          <NavbarLink label="About" href="/about" />
        </div>
      </div>
    </nav>
  );
}

function NavbarLink(props: {label: string; href: string; blank?: boolean}) {
  return (
    <Link
      className="text-white hover:text-blue-200"
      href={props.href}
      target={props.blank ? '_blank' : undefined}
    >
      {props.label}
    </Link>
  );
}
