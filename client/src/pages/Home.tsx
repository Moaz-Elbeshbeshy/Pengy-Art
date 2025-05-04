import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import { FilterState, Product, PaginationInfo } from "@/lib/types";

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    price: { min: 0, max: 1000 },
    size: [],
    color: [],
    brand: [],
    sort: "default",
    page: 1,
    limit: 9
  });

  // Build the query params based on current filters
  const getQueryParams = () => {
    const params = new URLSearchParams();
    
    // Price filter
    if (filters.price.min > 0) {
      params.append("numericFilters", `price>=${filters.price.min}`);
    }
    if (filters.price.max < 1000) {
      params.append("numericFilters", `price<=${filters.price.max}`);
    }
    
    // Size filter
    if (filters.size.length > 0) {
      params.append("size", filters.size.join(","));
    }
    
    // Color filter
    if (filters.color.length > 0) {
      params.append("color", filters.color.join(","));
    }
    
    // Brand/Company filter
    if (filters.brand.length > 0) {
      params.append("company", filters.brand.join(","));
    }
    
    // Search by name
    if (filters.name) {
      params.append("name", filters.name);
    }
    
    // Sort
    if (filters.sort !== "default") {
      params.append("sort", filters.sort);
    }
    
    // Pagination
    params.append("page", filters.page.toString());
    params.append("limit", filters.limit.toString());
    
    return params.toString();
  };

  const queryString = getQueryParams();
  
  const { data, isLoading, error } = useQuery<{
    products: Product[];
    totalPages: number;
    count: number;
    currentPage: number;
  }>({
    queryKey: [`/api/v1/products?${queryString}`],
  });

  const products: Product[] = data?.products || [];
  const paginationInfo: PaginationInfo = {
    currentPage: filters.page,
    totalPages: data?.totalPages || 1,
    totalProducts: data?.count || 0
  };

  // Update filter state handlers
  const handlePriceChange = (priceRange: { min: number; max: number }) => {
    setFilters(prev => ({ ...prev, price: priceRange, page: 1 }));
  };

  const handleSizeFilter = (size: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      size: checked
        ? [...prev.size, size]
        : prev.size.filter(s => s !== size),
      page: 1
    }));
  };

  const handleColorFilter = (color: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      color: checked
        ? [...prev.color, color]
        : prev.color.filter(c => c !== color),
      page: 1
    }));
  };

  const handleBrandFilter = (brand: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      brand: checked
        ? [...prev.brand, brand]
        : prev.brand.filter(b => b !== brand),
      page: 1
    }));
  };

  const handleSearchChange = (name: string) => {
    setFilters(prev => ({ ...prev, name, page: 1 }));
  };

  const handleSortChange = (sort: string) => {
    setFilters(prev => ({ ...prev, sort }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onSearch={handleSearchChange} />
      
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <div className="text-sm">
          <a href="/" className="text-gray-500 hover:text-gray-700">Home</a> 
          <span className="text-gray-400 mx-1">/</span> 
          <span className="text-gray-700 font-medium">Artwork</span>
        </div>
        <h1 className="text-2xl font-bold mt-2 mb-6">PENGY ARTWORK COLLECTION</h1>
        
        {/* Art Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <a href="/?category=cartoon" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <h2 className="font-medium text-lg mb-2 text-blue-700">Cartoon Characters</h2>
            <p className="text-sm text-gray-600">Drawn on the Walls of Rooms</p>
          </a>
          <a href="/?category=portraits" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <h2 className="font-medium text-lg mb-2 text-blue-700">Face Portraits</h2>
            <p className="text-sm text-gray-600">Pencil and Ink Sketches</p>
          </a>
          <a href="/?category=digital" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <h2 className="font-medium text-lg mb-2 text-blue-700">Digital Art</h2>
            <p className="text-sm text-gray-600">Modern Digital Creations</p>
          </a>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-6 pb-12 flex-grow">
        <FilterSidebar 
          currentFilters={filters}
          onPriceChange={handlePriceChange}
          onSizeChange={handleSizeFilter}
          onColorChange={handleColorFilter}
          onBrandChange={handleBrandFilter}
        />
        
        <div className="flex-1">
          {/* Sorting Controls */}
          <div className="flex justify-end items-center mb-6">
            <div className="flex items-center text-sm">
              <span className="mr-2">Sort By:</span>
              <select 
                className="border-gray-300 rounded-md py-1 px-2 focus:ring-primary focus:border-primary"
                onChange={(e) => handleSortChange(e.target.value)}
                value={filters.sort}
              >
                <option value="default">Default</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
                <option value="-name">Name: Z-A</option>
              </select>
            </div>
          </div>
          
          <ProductGrid 
            products={products} 
            isLoading={isLoading} 
            error={error as Error} 
          />
          
          {!isLoading && !error && (
            <Pagination 
              currentPage={paginationInfo.currentPage}
              totalPages={paginationInfo.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
