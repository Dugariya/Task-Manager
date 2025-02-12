import { Task } from "@shared/schema";
import { updateTask, deleteTask } from "@/lib/local-storage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import TaskForm from "./task-form";

interface TaskListProps {
  tasks: Task[];
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export default function TaskList({ tasks, onSuccess, onError }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleComplete = async (task: Task) => {
    try {
      await updateTask(task.id, { completed: !task.completed });
      onSuccess();
    } catch (error) {
      onError(error as Error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      onSuccess();
    } catch (error) {
      onError(error as Error);
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="group">
          <CardContent className="p-4 flex items-center gap-4">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => handleComplete(task)}
            />
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-muted-foreground truncate">
                  {task.description}
                </p>
              )}
            </div>
            <Badge variant={task.category === "URGENT" ? "destructive" : "secondary"}>
              {task.category}
            </Badge>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingTask(task)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              task={editingTask}
              onSuccess={() => {
                onSuccess();
                setEditingTask(null);
              }}
              onError={onError}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
