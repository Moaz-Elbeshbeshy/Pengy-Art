import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import { FilterState, Product, PaginationInfo } from "@/lib/types";

export default function Home() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  
  // Get category from URL, if any
  const categoryParam = searchParams.get('category');
  const materialParam = searchParams.get('material');
  
  // Map category to the appropriate size values (categories in our data model)
  const getCategorySizes = (category: string | null) => {
    switch(category) {
      case 'cartoon': return ['Cartoon Characters'];
      case 'portraits': return ['Face Portraits'];
      case 'digital': return ['Digital Art'];
      default: return [];
    }
  };
  
  // Initialize state with URL parameters if present
  const [filters, setFilters] = useState<FilterState>({
    price: { min: 0, max: 1000 },
    size: getCategorySizes(categoryParam),
    color: materialParam ? [materialParam] : [],
    brand: [],
    sort: "default",
    page: parseInt(searchParams.get('page') || '1'),
    limit: 9
  });
  
  // Effect to update filters when URL parameters change
  useEffect(() => {
    const newSizes = getCategorySizes(categoryParam);
    const newMaterials = materialParam ? [materialParam] : [];
    
    if (
      (newSizes.length > 0 && !filters.size.includes(newSizes[0])) || 
      (newMaterials.length > 0 && !filters.color.includes(newMaterials[0]))
    ) {
      setFilters(prev => ({
        ...prev,
        size: newSizes.length ? newSizes : prev.size,
        color: newMaterials.length ? newMaterials : prev.color,
        page: 1 // Reset to first page when filters change
      }));
    }
  }, [categoryParam, materialParam]);

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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Header onSearch={handleSearchChange} />
      
      {/* Header padding */}
      <div className="container mx-auto px-4 py-2"></div>
      
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
              <span className="mr-2 dark:text-gray-300">Sort By:</span>
              <select 
                className="border-gray-300 rounded-md py-1 px-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
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
