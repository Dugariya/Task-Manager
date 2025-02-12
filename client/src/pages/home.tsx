import { useState, useMemo } from "react";
import { Task, TaskCategory } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { getTasks } from "@/lib/local-storage";
import TaskList from "@/components/task-list";
import TaskForm from "@/components/task-form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import ThemeToggle from "@/components/theme-toggle";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(() => getTasks());
  const [filter, setFilter] = useState<TaskCategory | "ALL">("ALL");
  const { toast } = useToast();
  
  const filteredTasks = useMemo(() => {
    return filter === "ALL" 
      ? tasks 
      : tasks.filter(task => task.category === filter);
  }, [tasks, filter]);

  const updateTasks = () => {
    setTasks(getTasks());
  };

  const handleError = (error: Error) => {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Task Manager</h1>
          <ThemeToggle />
        </div>

        <Card>
          <CardContent className="pt-6">
            <TaskForm onSuccess={updateTasks} onError={handleError} />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as TaskCategory | "ALL")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Tasks</SelectItem>
              <SelectItem value="WORK">Work</SelectItem>
              <SelectItem value="PERSONAL">Personal</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TaskList 
          tasks={filteredTasks} 
          onSuccess={updateTasks}
          onError={handleError}
        />
      </div>
    </div>
  );
}
