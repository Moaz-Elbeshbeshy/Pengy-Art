import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FilterState, PriceRange } from '@/lib/types';

interface FilterSidebarProps {
  currentFilters: FilterState;
  onPriceChange: (priceRange: PriceRange) => void;
  onSizeChange: (size: string, checked: boolean) => void;
  onColorChange: (color: string, checked: boolean) => void;
  onBrandChange: (brand: string, checked: boolean) => void;
}

const sizes = ['S', 'M', 'L', 'XL'];
const colors = ['Purple', 'Blue', 'Black', 'White', 'Red', 'Pink', 'Green', 'Brown'];
const brands = ['Converse', 'Nike', 'Adidas', 'Puma', 'Reebok'];

export default function FilterSidebar({
  currentFilters,
  onPriceChange,
  onSizeChange,
  onColorChange,
  onBrandChange
}: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState<PriceRange>(currentFilters.price);
  
  // Debounce the price slider changes
  useEffect(() => {
    const timer = setTimeout(() => {
      onPriceChange(priceRange);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [priceRange, onPriceChange]);
  
  return (
    <aside className="w-full md:w-64 lg:w-72 shrink-0">
      <div className="sticky top-20">
        <h2 className="text-sm font-semibold uppercase mb-4">SHOP BY</h2>
        
        {/* Price Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase mb-3">PRICE</h3>
          <div className="px-1">
            <Slider
              defaultValue={[priceRange.min]}
              max={1000}
              step={10}
              onValueChange={(value) => setPriceRange({ ...priceRange, min: value[0] })}
              className="mb-3"
            />
            <Slider
              defaultValue={[priceRange.max]}
              max={1000}
              step={10}
              onValueChange={(value) => setPriceRange({ ...priceRange, max: value[0] })}
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>${priceRange.min.toFixed(2)}</span>
              <span>${priceRange.max.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Size Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase mb-3">SIZE</h3>
          <div className="space-y-2">
            {sizes.map((size) => (
              <div key={size} className="flex items-center">
                <Checkbox 
                  id={`size-${size}`} 
                  checked={currentFilters.size.includes(size)}
                  onCheckedChange={(checked) => onSizeChange(size, checked === true)}
                  className="h-4 w-4 text-primary rounded border-gray-300"
                />
                <Label htmlFor={`size-${size}`} className="ml-2 text-sm text-gray-600">
                  {size}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Color Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase mb-3">COLOR</h3>
          <div className="space-y-2">
            {colors.map((color) => (
              <div key={color} className="flex items-center">
                <Checkbox 
                  id={`color-${color}`} 
                  checked={currentFilters.color.includes(color.toLowerCase())}
                  onCheckedChange={(checked) => onColorChange(color.toLowerCase(), checked === true)}
                  className="h-4 w-4 text-primary rounded border-gray-300"
                />
                <Label htmlFor={`color-${color}`} className="ml-2 text-sm text-gray-600">
                  {color}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Brand Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase mb-3">BRAND</h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center">
                <Checkbox 
                  id={`brand-${brand}`} 
                  checked={currentFilters.brand.includes(brand.toLowerCase())}
                  onCheckedChange={(checked) => onBrandChange(brand.toLowerCase(), checked === true)}
                  className="h-4 w-4 text-primary rounded border-gray-300"
                />
                <Label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-gray-600">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
