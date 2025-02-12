import { Task, CreateTask } from "@shared/schema";

const STORAGE_KEY = "tasks";

export function getTasks(): Task[] {
  const tasks = localStorage.getItem(STORAGE_KEY);
  return tasks ? JSON.parse(tasks) : [];
}

export function addTask(task: CreateTask): Task {
  const tasks = getTasks();
  const newTask: Task = {
    ...task,
    id: crypto.randomUUID(),
    createdAt: Date.now()
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...tasks, newTask]));
  return newTask;
}

export function updateTask(id: string, updates: Partial<Task>): Task {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    throw new Error("Task not found");
  }
  
  const updatedTask = { ...tasks[taskIndex], ...updates };
  tasks[taskIndex] = updatedTask;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  return updatedTask;
}

export function deleteTask(id: string): void {
  const tasks = getTasks();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(tasks.filter(t => t.id !== id))
  );
}
