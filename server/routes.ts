import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

// Mock product data for demo
const mockProducts = [
  {
    id: 1,
    name: "Nike revolution 5",
    price: 215.00,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    brand: "Nike",
    company: "nike",
    featured: true,
    size: ["S", "M", "L"],
    color: ["blue", "white"]
  },
  {
    id: 2,
    name: "Nike court vision low",
    price: 104.00,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    brand: "Nike",
    company: "nike",
    featured: false,
    size: ["M", "L", "XL"],
    color: ["white", "blue"]
  },
  {
    id: 3,
    name: "Nike odyssey react flyknit 2",
    price: 127.00,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
    brand: "Nike",
    company: "nike",
    featured: true,
    size: ["S", "M"],
    color: ["purple"]
  },
  {
    id: 4,
    name: "Nike drop-type premium",
    price: 174.00,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    brand: "Nike",
    company: "nike",
    featured: false,
    size: ["L", "XL"],
    color: ["green"]
  },
  {
    id: 5,
    name: "Nike air presto by you",
    price: 165.00,
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
    brand: "Nike",
    company: "nike",
    featured: true,
    size: ["S", "M", "L"],
    color: ["green", "blue"]
  },
  {
    id: 6,
    name: "Seasonal color chuck 70",
    price: 89.00,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
    brand: "Converse",
    company: "converse",
    featured: true,
    size: ["S", "M"],
    color: ["purple"]
  },
  {
    id: 7,
    name: "Chuck taylor all star move",
    price: 91.00,
    image: "https://images.unsplash.com/photo-1584735175315-9d5df23be5c8",
    brand: "Converse",
    company: "converse",
    featured: false,
    size: ["M", "L"],
    color: ["pink"]
  },
  {
    id: 8,
    name: "Jack purcell leather",
    price: 107.00,
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a",
    brand: "Converse",
    company: "converse",
    featured: false,
    size: ["S", "XL"],
    color: ["white"]
  },
  {
    id: 9,
    name: "Custom chuck taylor all star by you",
    price: 64.00,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3",
    brand: "Converse",
    company: "converse",
    featured: true,
    size: ["S", "M", "L", "XL"],
    color: ["blue", "purple"]
  },
  {
    id: 10,
    name: "Senseboost go shoes",
    price: 125.00,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    brand: "Adidas",
    company: "adidas",
    featured: false,
    size: ["M", "L"],
    color: ["blue", "black"]
  },
  {
    id: 11,
    name: "Lite racer adapt 3.0 shoes",
    price: 85.00,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    brand: "Adidas",
    company: "adidas",
    featured: true,
    size: ["S", "M"],
    color: ["white"]
  },
  {
    id: 12,
    name: "Edge gameday shoes",
    price: 95.00,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
    brand: "Adidas",
    company: "adidas",
    featured: false,
    size: ["L", "XL"],
    color: ["blue", "black"]
  }
];

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();

  // API endpoint to get all products with filtering, sorting, and pagination
  router.get("/products", (req: Request, res: Response) => {
    try {
      // Extract query parameters
      const featured = req.query.featured === "true";
      const company = req.query.company as string;
      const name = req.query.name as string;
      const sort = req.query.sort as string;
      const numericFilters = req.query.numericFilters as string;
      const fields = req.query.fields as string;
      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;
      const size = req.query.size as string;
      const color = req.query.color as string;

      // Apply filters
      let filteredProducts = [...mockProducts];

      // Filter by featured
      if (req.query.featured !== undefined) {
        filteredProducts = filteredProducts.filter(product => product.featured === featured);
      }

      // Filter by company/brand
      if (company) {
        const companies = company.split(',');
        filteredProducts = filteredProducts.filter(product => 
          companies.includes(product.company.toLowerCase())
        );
      }

      // Filter by name
      if (name) {
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(name.toLowerCase())
        );
      }

      // Filter by size
      if (size) {
        const sizes = size.split(',');
        filteredProducts = filteredProducts.filter(product => 
          product.size.some(s => sizes.includes(s))
        );
      }

      // Filter by color
      if (color) {
        const colors = color.split(',');
        filteredProducts = filteredProducts.filter(product => 
          product.color.some(c => colors.includes(c))
        );
      }

      // Apply numeric filters (price, etc.)
      if (numericFilters) {
        const operatorMap = {
          '>': (a: number, b: number) => a > b,
          '>=': (a: number, b: number) => a >= b,
          '=': (a: number, b: number) => a === b,
          '<': (a: number, b: number) => a < b,
          '<=': (a: number, b: number) => a <= b,
        };
        
        const regEx = /\b(>|>=|=|<|<=)\b/g;
        const filters = numericFilters.split(',').map(filter => {
          const [field, operator, value] = filter.replace(
            regEx,
            (match) => `-${match}-`
          ).split('-');
          
          if (field && operator && value) {
            return { field, operator, value: parseFloat(value) };
          }
          return null;
        }).filter(Boolean);

        filteredProducts = filteredProducts.filter(product => {
          return filters.every(filter => {
            if (!filter) return true;
            const { field, operator, value } = filter;
            // @ts-ignore - we know these fields exist
            return operatorMap[operator](product[field], value);
          });
        });
      }

      // Sort products
      if (sort) {
        const sortFields = sort.split(',');
        filteredProducts.sort((a, b) => {
          for (const field of sortFields) {
            const isDesc = field.startsWith('-');
            const sortField = isDesc ? field.substring(1) : field;
            
            // @ts-ignore - we know these fields exist
            if (a[sortField] < b[sortField]) {
              return isDesc ? 1 : -1;
            }
            // @ts-ignore - we know these fields exist
            if (a[sortField] > b[sortField]) {
              return isDesc ? -1 : 1;
            }
          }
          return 0;
        });
      }

      // Select fields (projection)
      let projectedProducts = filteredProducts;
      if (fields) {
        const fieldsList = fields.split(',');
        projectedProducts = filteredProducts.map(product => {
          const result: Record<string, any> = {};
          fieldsList.forEach(field => {
            // @ts-ignore - we know these fields exist
            result[field] = product[field];
          });
          return result;
        });
      }

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedProducts = projectedProducts.slice(startIndex, endIndex);

      // Return response
      res.json({
        count: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit),
        currentPage: page,
        products: paginatedProducts
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Error fetching products' });
    }
  });

  // Register the router with a prefix
  app.use('/api/v1', router);

  const httpServer = createServer(app);
  return httpServer;
}
