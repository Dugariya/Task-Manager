import { z } from "zod";

export const TaskCategory = z.enum(["WORK", "PERSONAL", "URGENT"]);
export type TaskCategory = z.infer<typeof TaskCategory>;

export const Task = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  category: TaskCategory,
  createdAt: z.number()
});

export type Task = z.infer<typeof Task>;

export const CreateTaskSchema = Task.omit({ id: true, createdAt: true });
export type CreateTask = z.infer<typeof CreateTaskSchema>;

export const UpdateTaskSchema = Task.partial().pick({
  title: true,
  description: true,
  completed: true,
  category: true
});
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
