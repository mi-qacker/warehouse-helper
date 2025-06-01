import {CONFIG} from '@/config';
import Link from 'next/link';
import {Popover, PopoverButton, PopoverPanel} from '@headlessui/react';
import {ChevronDownIcon} from '@heroicons/react/20/solid';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link className="text-2xl font-bold text-white" href="/">
          Warehouse Helper
        </Link>

        <div className="flex space-x-4">
          <Popover className="group relative">
            <PopoverButton
              as="div"
              className="flex cursor-pointer flex-row items-center gap-1 text-white hover:text-blue-200"
            >
              <span>Parameters</span>
              <ChevronDownIcon className="size-5 group-data-open:rotate-180" />
            </PopoverButton>
            <PopoverPanel
              anchor="bottom"
              className="flex w-32 flex-col gap-2 rounded-md bg-blue-500 px-4 py-2 shadow-md"
            >
              <NavbarLink label="Warehouse" href="/parameters/warehouse" />
              <NavbarLink label="Products" href="/parameters/products" />
              <NavbarLink label="Cells" href="/parameters/cells" />
              <NavbarLink label="Graph" href="/graph" />
            </PopoverPanel>
          </Popover>
          <NavbarLink label="Map" href="/map" />
          <NavbarLink label="Solution" href="/solution" />
        </div>

        <div className="flex space-x-4">
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
