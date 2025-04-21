import {BeakerIcon} from '@heroicons/react/24/solid';

export default function TrailPage() {
  return (
    <main className="mx-auto w-full max-w-7xl">
      <h1 className="my-2 text-3xl font-bold">Trail page</h1>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-3xl text-gray-600">Work in progress</span>
          <BeakerIcon className="size-12 text-emerald-600" />
        </div>
      </div>
    </main>
  );
}
