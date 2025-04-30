import { pgTable, text, serial, integer, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema remains unchanged from the template
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Medicine schema for our application
export const medicines = pgTable("medicines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  manufacturer: text("manufacturer").notNull(),
  dosage: text("dosage").notNull(),
  price: doublePrecision("price").notNull(),
  tax: doublePrecision("tax").notNull(),
  availability: text("availability").notNull(),
  Packing: text("packing"),  // Added to match Excel uploads
  Disc: doublePrecision("discount"),  // Added to match Excel uploads
  Rate: doublePrecision("rate"),  // Added to match Excel uploads
});

export const insertMedicineSchema = createInsertSchema(medicines).omit({
  id: true,
});

// Bill schema to store bill information
export const bills = pgTable("bills", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  totalAmount: doublePrecision("total_amount").notNull(),
  dateCreated: text("date_created").notNull(),
  itemCount: integer("item_count").notNull(),
});

export const insertBillSchema = createInsertSchema(bills).omit({
  id: true,
});

// Bill item schema to store individual items in a bill
export const billItems = pgTable("bill_items", {
  id: serial("id").primaryKey(),
  billId: integer("bill_id").notNull(),
  medicineName: text("medicine_name").notNull(),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
  tax: doublePrecision("tax").notNull(),
  total: doublePrecision("total").notNull(),
});

export const insertBillItemSchema = createInsertSchema(billItems).omit({
  id: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Medicine = typeof medicines.$inferSelect;
export type InsertMedicine = z.infer<typeof insertMedicineSchema>;

export type Bill = typeof bills.$inferSelect;
export type InsertBill = z.infer<typeof insertBillSchema>;

export type BillItem = typeof billItems.$inferSelect;
export type InsertBillItem = z.infer<typeof insertBillItemSchema>;

// Custom schemas for our application
export const medicineSearchSchema = z.object({
  query: z.string().min(1),
});

export const uploadMedicinesSchema = z.array(
  z.object({
    // Accept fields based on the user's Excel format
    "Description of Goods": z.union([z.string(), z.number()]).transform(val => String(val)),
    "Rate": z.union([z.string(), z.number()])
      .transform(val => typeof val === 'string' ? parseFloat(val) : val)
      .refine(val => !isNaN(val) && val >= 0, "Rate must be a positive number"),
    "Disc": z.union([z.string(), z.number(), z.undefined()]).optional()
      .transform(val => val === undefined ? 0 : (typeof val === 'string' ? parseFloat(val) : val))
      .refine(val => !isNaN(val as number), "Discount must be a number"),
    "Tax": z.union([z.string(), z.number(), z.undefined()]).optional()
      .transform(val => val === undefined ? 0 : (typeof val === 'string' ? parseFloat(val) : val))
      .refine(val => !isNaN(val as number), "Tax must be a number"),
    "Packing": z.union([z.string(), z.number(), z.undefined()]).optional()
      .transform(val => val === undefined ? 'N/A' : String(val)),
  }).passthrough() // Allow extra fields in the Excel
);
