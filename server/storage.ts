import { db } from "./db";
import {
  feedback,
  type InsertFeedback,
  type Feedback
} from "@shared/schema";

export interface IStorage {
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
}

export class DatabaseStorage implements IStorage {
  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    if (!db) {
      throw new Error("Database is not available");
    }
    const [newItem] = await db.insert(feedback).values(insertFeedback).returning();
    return newItem;
  }
}

export const storage = new DatabaseStorage();
