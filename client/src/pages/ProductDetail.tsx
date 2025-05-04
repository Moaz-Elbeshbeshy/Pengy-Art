import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { Product } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/v1/products/${id}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="h-[500px] w-full md:w-1/2 rounded-md" />
          <div className="w-full md:w-1/2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/3" />
            <div className="space-y-1 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="pt-4">
              <Skeleton className="h-8 w-full md:w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-600">Error Loading Artwork</h2>
        <p className="mt-2 text-gray-600">
          {error instanceof Error ? error.message : "Couldn't find this artwork. It may have been removed or doesn't exist."}
        </p>
        <a href="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          Return to Gallery
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Artwork Image */}
        <div className="w-full md:w-1/2">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-auto rounded-md shadow-md object-cover"
          />
        </div>
        
        {/* Artwork Information */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-xl text-gray-700 mt-1">{product.brand}</p>
          <p className="text-lg text-gray-600 mt-1">
            {product.company && product.company.includes('abstract') ? 'Italy' : 'United States'}
          </p>
          
          <div className="mt-6">
            <div className="flex items-center mb-4">
              <span className="text-gray-700 w-32">Medium:</span>
              <div className="flex gap-1 flex-wrap">
                {product.color.map((medium, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-600">
                    {medium.charAt(0).toUpperCase() + medium.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <span className="text-gray-700 w-32">Category:</span>
              <div className="flex gap-1 flex-wrap">
                {product.size.map((category, index) => (
                  <Badge key={index} variant="outline">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            
            {product.featured && (
              <div className="flex items-center mb-4">
                <span className="text-gray-700 w-32">Status:</span>
                <Badge className="bg-blue-500">Featured</Badge>
              </div>
            )}
            
            <div className="flex items-center mb-4">
              <span className="text-gray-700 w-32">Year Created:</span>
              <span>2024</span>
            </div>
            
            <div className="flex items-center mb-4">
              <span className="text-gray-700 w-32">Size:</span>
              <span>19.7 W x 19.7 H x 0.8 D in</span>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold border-b border-gray-200 pb-2 mb-4">ABOUT THE ARTWORK</h2>
            <p className="text-gray-700">
              {product.description || 
                "This stunning artwork showcases the artist's unique style and perspective. The piece combines technical excellence with emotional depth, creating a visual experience that resonates with viewers. Perfect for art enthusiasts and collectors looking to add a distinctive piece to their collection."}
            </p>
          </div>
          
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
                Contact Gallery
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}