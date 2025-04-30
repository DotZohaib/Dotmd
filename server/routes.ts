import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from 'multer';
import xlsx from 'xlsx';
import { medicineSearchSchema, uploadMedicinesSchema } from "@shared/schema";
import { z } from "zod";

// Define types for multer
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      file?: MulterFile;
    }
  }
}

// Set up multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Only accept Excel files
    if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-excel'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Endpoint to get all medicines
  app.get('/api/medicines', async (req, res) => {
    try {
      const medicines = await storage.getAllMedicines();
      res.json(medicines);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      res.status(500).json({ 
        message: 'Failed to fetch medicines',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Endpoint to search medicines
  app.get('/api/medicines/search', async (req, res) => {
    try {
      const query = req.query.query as string;
      
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }
      
      // Validate query with zod
      const validatedQuery = medicineSearchSchema.parse({ query }).query;
      
      const results = await storage.searchMedicines(validatedQuery);
      res.json(results);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid search query',
          error: error.errors
        });
      }
      
      console.error('Error searching medicines:', error);
      res.status(500).json({ 
        message: 'Failed to search medicines',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Endpoint to get suggestions
  app.get('/api/medicines/suggestions', async (req, res) => {
    try {
      const query = req.query.query as string;
      
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }
      
      const results = await storage.getMedicineSuggestions(query);
      res.json(results);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      res.status(500).json({ 
        message: 'Failed to get suggestions',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Endpoint to upload medicine data from Excel
  app.post('/api/medicines/upload', upload.single('file'), async (req, res) => {
    // Define this outside try block to make it accessible in catch block
    let excelData: any[] = [];
    
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      // Read Excel file
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      excelData = xlsx.utils.sheet_to_json(worksheet);
      console.log('Excel data parsed:', JSON.stringify(excelData.slice(0, 2), null, 2)); // Log first two rows
      
      // Validate data format
      const validatedData = uploadMedicinesSchema.parse(excelData);
      
      // Clear existing medicines and add new ones
      await storage.clearMedicines();
      for (const medicine of validatedData) {
        await storage.createMedicine(medicine);
      }
      
      res.json({ 
        message: 'Medicines uploaded successfully',
        count: validatedData.length
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Excel validation error:', JSON.stringify(error.format(), null, 2));
        console.error('Data being validated:', JSON.stringify(excelData, null, 2));
        return res.status(400).json({ 
          message: 'Invalid data format in Excel file',
          error: error.errors
        });
      }
      
      console.error('Error uploading medicines:', error);
      res.status(500).json({ 
        message: 'Failed to upload medicines',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
