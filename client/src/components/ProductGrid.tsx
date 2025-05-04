import { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
}

// Artwork image URLs
const artworkImages = [
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5', // Colorful abstract art
  'https://images.unsplash.com/photo-1547891654-e66ed7ebb968', // Portrait art
  'https://images.unsplash.com/photo-1549490349-8643362247b5', // Modern digital art
  'https://images.unsplash.com/photo-1574182245530-967d9b3831af', // Street art
  'https://images.unsplash.com/photo-1571115764595-644a1f56a55c', // Watercolor painting
  'https://images.unsplash.com/photo-1558697702-9f517a5a0b05', // Pop art
  'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8', // Oil painting
  'https://images.unsplash.com/photo-1637340532483-9ac801331e35', // Cartoon style
  'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb', // Landscape painting
  'https://images.unsplash.com/photo-1596726038553-9b63eef0df73', // Digital portrait
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
            <div className="relative h-60 bg-gray-100 overflow-hidden">
              <img 
                src={product.image || artworkImages[index % artworkImages.length]} 
                alt={product.name} 
                className="w-full h-full object-cover object-center transition-transform hover:scale-105"
              />
              {product.featured && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-blue-500">Featured</Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900 text-lg">{product.name}</h3>
                  <p className="text-gray-500 text-sm">{product.brand}</p>
                </div>
                <p className="font-bold text-blue-600">${product.price.toFixed(2)}</p>
              </div>
              
              <div className="mt-3">
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.size && product.size.map((category, idx) => (
                    <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {category}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.color && product.color.map((material, idx) => (
                    <Badge key={idx} variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </a>
        </Card>
      ))}
    </div>
  );
}
