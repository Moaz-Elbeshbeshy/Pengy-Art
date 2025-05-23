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

// Art materials
const materials = ['Oil', 'Watercolor', 'Acrylic', 'Airbrush', 'Color', 'Ink', 'Latex'];

// Art categories
const categories = ['Cartoon Characters', 'Face Portraits', 'Digital Art'];

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
        <h2 className="text-sm font-semibold uppercase mb-4 dark:text-gray-200">FILTER BY</h2>
        
        {/* Price Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase mb-3 dark:text-gray-300">PRICE</h3>
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
            <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span>${priceRange.min.toFixed(2)}</span>
              <span>${priceRange.max.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Categories Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase mb-3 dark:text-gray-300">CATEGORIES</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <Checkbox 
                  id={`category-${category}`} 
                  checked={currentFilters.size.includes(category)}
                  onCheckedChange={(checked) => onSizeChange(category, checked === true)}
                  className="h-4 w-4 text-blue-500 rounded border-gray-300 dark:border-gray-600"
                />
                <Label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Materials Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase mb-3 dark:text-gray-300">MEDIUMS & MATERIALS</h3>
          <div className="space-y-2">
            {materials.map((material) => (
              <div key={material} className="flex items-center">
                <Checkbox 
                  id={`material-${material}`} 
                  checked={currentFilters.color.includes(material.toLowerCase())}
                  onCheckedChange={(checked) => onColorChange(material.toLowerCase(), checked === true)}
                  className="h-4 w-4 text-blue-500 rounded border-gray-300 dark:border-gray-600"
                />
                <Label htmlFor={`material-${material}`} className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {material}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
