import React, { useState } from "react";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";

interface PendingTask {
  id: string;
  projectId: string;
  projectName: string;
  clientName: string;
  stepName: string;
  stepNumber: number;
  assignedTo: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "overdue";
  createdDate: string;
}

interface PendingTasksProps {
  onNavigateToStep: (projectId: string, stepNumber: number) => void;
}

const PendingTasks: React.FC<PendingTasksProps> = ({ onNavigateToStep }) => {
  const searchTerm = "";
  const filterStatus = "all";
  const filterPriority = "all";

  const [tasks] = useState<PendingTask[]>([
    {
      id: "task_1",
      projectId: "proj_1",
      projectName: "Solar Energy Project",
      clientName: "Green Energy Ltd",
      stepName: "Risk Categorization",
      stepNumber: 2,
      assignedTo: "Sarah Johnson",
      dueDate: "2025-01-20",
      priority: "high",
      status: "pending",
      createdDate: "2025-01-15",
    },
    {
      id: "task_2",
      projectId: "proj_2",
      projectName: "Manufacturing Facility",
      clientName: "Industrial Corp",
      stepName: "Environmental & Social Due Diligence",
      stepNumber: 3,
      assignedTo: "Michael Chen",
      dueDate: "2025-01-18",
      priority: "high",
      status: "overdue",
      createdDate: "2025-01-10",
    },
    {
      id: "task_3",
      projectId: "proj_3",
      projectName: "ICT Infrastructure",
      clientName: "Tech Solutions Inc",
      stepName: "Environmental & Social Action Plan",
      stepNumber: 4,
      assignedTo: "David Wilson",
      dueDate: "2025-01-25",
      priority: "medium",
      status: "in-progress",
      createdDate: "2025-01-12",
    },
    {
      id: "task_4",
      projectId: "proj_4",
      projectName: "Agriculture Development",
      clientName: "Farm Holdings Ltd",
      stepName: "Appraisal & Conditions",
      stepNumber: 5,
      assignedTo: "Lisa Brown",
      dueDate: "2025-01-22",
      priority: "medium",
      status: "pending",
      createdDate: "2025-01-14",
    },
    {
      id: "task_5",
      projectId: "proj_5",
      projectName: "Logistics Center",
      clientName: "Supply Chain Co",
      stepName: "Environmental & Social Screening",
      stepNumber: 1,
      assignedTo: "John Doe",
      dueDate: "2025-01-19",
      priority: "low",
      status: "in-progress",
      createdDate: "2025-01-16",
    },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-900";
      case "medium":
        return "bg-[#FDB913]/20 text-amber-800 border border-[#FDB913]/40 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-900";
      case "low":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-900";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "in-progress":
        return <CheckCircle className="w-4 h-4" />;
      case "overdue":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.stepName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const taskCounts = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    overdue: tasks.filter((t) => t.status === "overdue").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 dark:border-slate-800 px-6 py-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Pending Tasks
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Track work in progress and manage task assignments
            </p>
          </div>

          {/* Summary Cards */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:border-[#FDB913] transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Total Tasks
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {taskCounts.total}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-slate-400" />
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:border-[#FDB913] transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {taskCounts.pending}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-amber-500" />
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:border-[#FDB913] transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      In Progress
                    </p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {taskCounts.inProgress}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:border-[#FDB913] transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Overdue
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {taskCounts.overdue}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Task List
            </h3>
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() =>
                    onNavigateToStep(task.projectId, task.stepNumber)
                  }
                  className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-[#FDB913] transition-colors bg-white dark:bg-slate-800 shadow-sm flex justify-between items-center cursor-pointer group"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {task.projectName}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {task.clientName}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {task.stepName}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-bold ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                    <span
                      className={`flex items-center text-xs gap-1 ${task.status === "overdue" ? "text-red-600" : "text-slate-500"}`}
                    >
                      {getStatusIcon(task.status)}
                      {task.status
                        .replace("-", " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                    <span className="text-xs text-slate-400">
                      Due: {task.dueDate}
                    </span>
                  </div>
                </div>
              ))}
              {filteredTasks.length === 0 && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No tasks found matching your criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingTasks;
