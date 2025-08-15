import { z } from "zod";

export const progressSchema = z.object({
  id: z.string(),
  category: z.enum(["alphabets", "numbers", "shapes", "animals"]),
  completedItems: z.array(z.string()),
  stars: z.number().min(0).max(5),
  lastPlayed: z.date(),
});

export const gameSessionSchema = z.object({
  id: z.string(),
  category: z.string(),
  score: z.number(),
  timeSpent: z.number(),
  completedAt: z.date(),
});

export type Progress = z.infer<typeof progressSchema>;
export type GameSession = z.infer<typeof gameSessionSchema>;

export const insertProgressSchema = progressSchema.omit({ id: true });
export const insertGameSessionSchema = gameSessionSchema.omit({ id: true });

export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;
