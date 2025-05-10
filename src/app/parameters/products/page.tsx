'use client';

import ProductParams from '@/features/params/products/ProductParams';

export default function ProductsPage() {
  return (
    <main>
      <h1 className="my-4 text-2xl font-bold">Product params</h1>
      <ProductParams />
    </main>
  );
}
