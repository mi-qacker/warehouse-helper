import Link from 'next/link';

export default function Page() {
  return (
    <div>
      <h1 className="text-xl">Home</h1>
      <Link href="/about">About</Link>
    </div>
  );
}
