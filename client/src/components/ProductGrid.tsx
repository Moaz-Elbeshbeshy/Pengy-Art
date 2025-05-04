import { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
}

// Product shoe image URLs
const shoeImages = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5',
  'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
  'https://images.unsplash.com/photo-1584735175315-9d5df23be5c8',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a',
  'https://images.unsplash.com/photo-1552346154-21d32810aba3',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5',
];

export default function ProductGrid({ products, isLoading, error }: ProductGridProps) {
  // If there's an error, display error message
  if (error) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-red-600">Error loading products</h3>
        <p className="text-gray-600 mt-2">{error.message}</p>
      </div>
    );
  }

  // If loading, show skeleton UI
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-5 w-3/4 mb-2 mt-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // If no products found, show empty state
  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-900">No products found</h3>
        <p className="text-gray-600 mt-2">Try adjusting your filters to find what you're looking for.</p>
      </div>
    );
  }

  // Render the product grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <Card key={product.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <a href={`/product/${product.id}`} className="block">
            <div className="h-48 bg-gray-100 overflow-hidden">
              <img 
                src={product.image || shoeImages[index % shoeImages.length]} 
                alt={product.name} 
                className="w-full h-full object-cover object-center transition-transform hover:scale-105"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-900">{product.name}</h3>
              <p className="text-gray-700 mt-1">${product.price.toFixed(2)}</p>
            </CardContent>
          </a>
        </Card>
      ))}
    </div>
  );
}
