import React, { useState, useEffect } from "react";
import { X, Plus, EyeOff, Eye } from "lucide-react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  createdAt: number;
}

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<
    "high" | "medium" | "low"
  >("medium");
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem("aura-tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("aura-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    if (!a.completed && !b.completed) {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.createdAt - a.createdAt;
  });

  const addTask = () => {
    if (newTask.trim() === "") return;
    const task: Task = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
      priority: newTaskPriority,
      createdAt: Date.now(),
    };
    setTasks((prev) => [...prev, task]);
    setNewTask("");
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "hsl(var(--aura-priority-high))";
      case "medium":
        return "hsl(var(--aura-priority-medium))";
      case "low":
        return "hsl(var(--aura-priority-low))";
      default:
        return "hsl(var(--aura-accent))";
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case "high":
        return "hsl(var(--aura-priority-high) / 0.1)";
      case "medium":
        return "hsl(var(--aura-priority-medium) / 0.1)";
      case "low":
        return "hsl(var(--aura-priority-low) / 0.1)";
      default:
        return "hsl(var(--aura-accent) / 0.1)";
    }
  };

  return (
    <div className="aura-widget h-fit animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-aura-text-primary">
          Focus Tasks
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-aura-text-secondary">
            {tasks.filter((t) => !t.completed).length} active
          </span>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded-lg hover:bg-aura-surface transition-all duration-200 text-aura-text-secondary hover:text-aura-text-primary"
          >
            {isMinimized ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What's the next focus?"
                className="aura-input flex-1 animate-slide-in"
              />
              <button
                onClick={addTask}
                className="aura-button px-3 py-2 flex items-center justify-center hover:animate-bounce-gentle"
                disabled={!newTask.trim()}
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="flex gap-2">
              <span className="text-xs text-aura-text-secondary self-center">
                Priority:
              </span>
              {(["high", "medium", "low"] as const).map((priority) => (
                <button
                  key={priority}
                  onClick={() => setNewTaskPriority(priority)}
                  className={`
                    px-3 py-1 text-xs rounded-full capitalize transition-all duration-200 border
                    ${
                      newTaskPriority === priority
                        ? "border-current shadow-lg"
                        : "border-transparent hover:border-current/30"
                    }
                  `}
                  style={{
                    color: getPriorityColor(priority),
                    backgroundColor:
                      newTaskPriority === priority
                        ? getPriorityBg(priority)
                        : "transparent",
                  }}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedTasks.map((task, index) => (
              <div
                key={task.id}
                className={`
                  flex items-center gap-3 p-3 rounded-lg
                  bg-aura-surface border border-aura-glass-border
                  group hover:border-aura-accent/30
                  transition-all duration-300
                  ${task.completed ? "opacity-60" : "opacity-100"}
                  animate-fade-in
                `}
                style={{
                  animationDelay: `${index * 50}ms`,
                  transform: task.completed ? "scale(0.98)" : "scale(1)",
                }}
              >
                <div
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                />
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center
                    transition-all duration-200 hover:scale-110
                    ${
                      task.completed
                        ? "bg-aura-accent border-aura-accent animate-pulse-glow"
                        : "border-aura-glass-border hover:border-aura-accent"
                    }
                  `}
                >
                  {task.completed && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      className="text-aura-text-primary animate-fade-in"
                    >
                      <path
                        d="M2 6L5 9L10 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`
                        text-sm font-medium transition-all duration-200
                        ${
                          task.completed
                            ? "line-through text-aura-text-secondary"
                            : "text-aura-text-primary"
                        }
                      `}
                    >
                      {task.text}
                    </span>
                    <span
                      className="px-2 py-0.5 text-xs rounded-full capitalize"
                      style={{
                        color: getPriorityColor(task.priority),
                        backgroundColor: getPriorityBg(task.priority),
                      }}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="
                    opacity-0 group-hover:opacity-100
                    text-aura-text-secondary hover:text-red-400
                    transition-all duration-200 hover:scale-110
                    p-1 rounded hover:bg-red-400/10
                  "
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-8 text-aura-text-secondary animate-fade-in">
                <p className="text-sm">No tasks yet. Add one to get started!</p>
              </div>
            )}
          </div>
          {tasks.length > 0 && (
            <div className="flex justify-between text-xs text-aura-text-secondary pt-2 border-t border-aura-glass-border">
              <span>{tasks.filter((t) => !t.completed).length} active</span>
              <span>{tasks.filter((t) => t.completed).length} completed</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoList;
