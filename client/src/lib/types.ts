export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  featured?: boolean;
  company: string;
  size: string[];
  color: string[];
  description?: string;
}

export interface ProductFilters {
  featured?: boolean;
  company?: string[];
  name?: string;
  numericFilters?: string;
  sort?: string;
  fields?: string;
  limit?: number;
  page?: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface FilterState {
  price: PriceRange;
  size: string[];
  color: string[];
  brand: string[];
  name?: string;
  sort: string;
  page: number;
  limit: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}
