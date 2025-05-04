import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

// Mock product data for art store
const mockProducts = [
  {
    id: 1,
    name: "Vibrant Dreamscape",
    price: 215.00,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
    brand: "Sarah Johnson",
    company: "abstract",
    featured: true,
    size: ["Cartoon Characters", "Digital Art"],
    color: ["acrylic", "oil"]
  },
  {
    id: 2,
    name: "Serene Portrait",
    price: 184.00,
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968",
    brand: "Michael Chen",
    company: "portrait",
    featured: false,
    size: ["Face Portraits"],
    color: ["oil", "watercolor"]
  },
  {
    id: 3,
    name: "Digital Landscape",
    price: 127.00,
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5",
    brand: "Elena Rodriguez",
    company: "digital",
    featured: true,
    size: ["Digital Art"],
    color: ["digital", "color"]
  },
  {
    id: 4,
    name: "Urban Expression",
    price: 174.00,
    image: "https://images.unsplash.com/photo-1574182245530-967d9b3831af",
    brand: "Jamal Wilson",
    company: "street",
    featured: false,
    size: ["Cartoon Characters"],
    color: ["acrylic", "airbrush"]
  },
  {
    id: 5,
    name: "Nature's Whisper",
    price: 165.00,
    image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c",
    brand: "Olivia Kim",
    company: "nature",
    featured: true,
    size: ["Digital Art"],
    color: ["watercolor", "ink"]
  },
  {
    id: 6,
    name: "Pop Culture Icons",
    price: 189.00,
    image: "https://images.unsplash.com/photo-1558697702-9f517a5a0b05",
    brand: "Alex Thompson",
    company: "pop",
    featured: true,
    size: ["Cartoon Characters"],
    color: ["acrylic", "color"]
  },
  {
    id: 7,
    name: "Classic Still Life",
    price: 291.00,
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8",
    brand: "Isabella Martinez",
    company: "still-life",
    featured: false,
    size: ["Face Portraits"],
    color: ["oil"]
  },
  {
    id: 8,
    name: "Room Wall Characters",
    price: 207.00,
    image: "https://images.unsplash.com/photo-1637340532483-9ac801331e35",
    brand: "Daniel Lee",
    company: "cartoon",
    featured: false,
    size: ["Cartoon Characters"],
    color: ["latex", "acrylic"]
  },
  {
    id: 9,
    name: "Mountain Serenity",
    price: 164.00,
    image: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb",
    brand: "Sophie Miller",
    company: "landscape",
    featured: true,
    size: ["Digital Art"],
    color: ["oil", "acrylic"]
  },
  {
    id: 10,
    name: "Digital Portrait Study",
    price: 125.00,
    image: "https://images.unsplash.com/photo-1596726038553-9b63eef0df73",
    brand: "Ryan Parker",
    company: "portrait",
    featured: false,
    size: ["Face Portraits", "Digital Art"],
    color: ["digital", "color"]
  },
  {
    id: 11,
    name: "Abstract Emotions",
    price: 185.00,
    image: "https://images.unsplash.com/photo-1565799557186-1272a69ebc4a",
    brand: "Emma Davis",
    company: "abstract",
    featured: true,
    size: ["Digital Art"],
    color: ["watercolor", "ink"]
  },
  {
    id: 12,
    name: "Character Composition",
    price: 195.00,
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9",
    brand: "Noah Garcia",
    company: "cartoon",
    featured: false,
    size: ["Cartoon Characters"],
    color: ["acrylic", "color"]
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
          const result = { ...product }; // Start with a copy of the product
          const keys = Object.keys(product);
          
          // Keep only the requested fields
          for (const key of keys) {
            if (!fieldsList.includes(key)) {
              // @ts-ignore - we're dynamically removing properties
              delete result[key];
            }
          }
          
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
