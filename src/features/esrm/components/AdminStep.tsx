/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Users,
  Settings,
  Shield,
  Activity,
  Database,
  Download,
  Plus,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Lock,
  Unlock,
  Search,
  Filter,
  User,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "Active" | "Inactive" | "Suspended";
  lastLogin: string;
  createdDate: string;
}

interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
}

interface SystemSetting {
  id: string;
  category: string;
  name: string;
  value: string;
  description: string;
  type: "text" | "number" | "boolean" | "select";
  options?: string[];
}

const AdminStep: React.FC = () => {
  const [activeTab, setActiveTab] = useState("user-management");
  const [searchTerm, setSearchTerm] = useState("");
  const [_editingUserId] = useState<number | null>(null);
  const [_showAddUser, setShowAddUser] = useState(false);

  const [users] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@boi.ng",
      role: "Risk Manager",
      department: "Risk Management",
      status: "Active",
      lastLogin: "2025-01-15 09:30",
      createdDate: "2024-06-15",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@boi.ng",
      role: "ESG Officer",
      department: "Environmental & Social",
      status: "Active",
      lastLogin: "2025-01-15 08:45",
      createdDate: "2024-08-20",
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael.chen@boi.ng",
      role: "Senior Analyst",
      department: "Credit Analysis",
      status: "Inactive",
      lastLogin: "2025-01-10 16:20",
      createdDate: "2024-03-10",
    },
  ]);

  const [auditLogs] = useState<AuditLog[]>([
    {
      id: 1,
      timestamp: "2025-01-15 10:30:15",
      user: "John Doe",
      action: "Project Created",
      module: "ESS",
      details: "Created new project for Client ABC",
      ipAddress: "192.168.1.100",
    },
    {
      id: 2,
      timestamp: "2025-01-15 09:45:22",
      user: "Sarah Johnson",
      action: "Risk Category Updated",
      module: "Categorization",
      details: "Updated risk category from B to A",
      ipAddress: "192.168.1.101",
    },
    {
      id: 3,
      timestamp: "2025-01-15 08:15:33",
      user: "Michael Chen",
      action: "Report Downloaded",
      module: "ESDD",
      details: "Downloaded ESDD report for Project XYZ",
      ipAddress: "192.168.1.102",
    },
  ]);

  const [systemSettings, setSystemSettings] = useState<SystemSetting[]>([
    {
      id: "session_timeout",
      category: "Security",
      name: "Session Timeout (minutes)",
      value: "30",
      description: "Automatic logout after inactivity",
      type: "number",
    },
    {
      id: "password_policy",
      category: "Security",
      name: "Password Complexity",
      value: "Strong",
      description: "Required password strength",
      type: "select",
      options: ["Basic", "Medium", "Strong"],
    },
    {
      id: "audit_retention",
      category: "Compliance",
      name: "Audit Log Retention (days)",
      value: "365",
      description: "How long to keep audit logs",
      type: "number",
    },
    {
      id: "email_notifications",
      category: "Notifications",
      name: "Email Notifications",
      value: "true",
      description: "Send email notifications for key events",
      type: "boolean",
    },
  ]);

  const tabs = [
    {
      id: "user-management",
      label: "User Management",
      icon: Users,
      color: "text-slate-900 dark:text-[#FDB913]",
    },
    {
      id: "system-settings",
      label: "System Settings",
      icon: Settings,
      color: "text-slate-900 dark:text-[#FDB913]",
    },
    {
      id: "audit-logs",
      label: "Audit Logs",
      icon: Activity,
      color: "text-slate-900 dark:text-[#FDB913]",
    },
    {
      id: "system-health",
      label: "System Health",
      icon: Shield,
      color: "text-slate-900 dark:text-[#FDB913]",
    },
  ];

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
      case "Inactive":
        return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600";
      case "Suspended":
        return "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes("Created") || action.includes("Added"))
      return "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400";
    if (action.includes("Updated") || action.includes("Modified"))
      return "bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
    if (action.includes("Deleted") || action.includes("Removed"))
      return "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    if (action.includes("Downloaded") || action.includes("Exported"))
      return "bg-indigo-50 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400";
    return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300";
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      {/* Header with Add User Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            User Management
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors flex items-center gap-2 font-bold shadow-lg shadow-slate-900/20 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#FDB913]" />
          Add User
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>
        <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 font-medium cursor-pointer">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Role & Department
                </th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {user.role}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {user.department}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getUserStatusColor(user.status)}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300 font-mono">
                    {user.lastLogin}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">
                    {user.createdDate}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors cursor-pointer">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors cursor-pointer">
                        {user.status === "Active" ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Unlock className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          System Settings
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Configure system-wide settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(
          systemSettings.reduce(
            (acc, setting) => {
              if (!acc[setting.category]) acc[setting.category] = [];
              acc[setting.category].push(setting);
              return acc;
            },
            {} as Record<string, SystemSetting[]>,
          ),
        ).map(([category, settings]) => (
          <div
            key={category}
            className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
          >
            <div className="bg-slate-900 px-6 py-4 border-b border-[#FDB913]">
              <h4 className="font-bold text-lg text-white">{category}</h4>
            </div>
            <div className="p-6 space-y-4">
              {settings.map((setting) => (
                <div key={setting.id} className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    {setting.name}
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    {setting.description}
                  </p>
                  {setting.type === "boolean" ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={setting.value === "true"}
                        onChange={(e) => {
                          const newSettings = systemSettings.map((s) =>
                            s.id === setting.id
                              ? { ...s, value: e.target.checked.toString() }
                              : s,
                          );
                          setSystemSettings(newSettings);
                        }}
                        className="w-4 h-4 text-[#FDB913] border-slate-300 dark:border-slate-600 rounded focus:ring-[#FDB913] bg-slate-100 dark:bg-slate-900"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                        Enabled
                      </span>
                    </div>
                  ) : setting.type === "select" ? (
                    <select
                      value={setting.value}
                      onChange={(e) => {
                        const newSettings = systemSettings.map((s) =>
                          s.id === setting.id
                            ? { ...s, value: e.target.value }
                            : s,
                        );
                        setSystemSettings(newSettings);
                      }}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      {setting.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={setting.type}
                      value={setting.value}
                      onChange={(e) => {
                        const newSettings = systemSettings.map((s) =>
                          s.id === setting.id
                            ? { ...s, value: e.target.value }
                            : s,
                        );
                        setSystemSettings(newSettings);
                      }}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#FDB913] focus:border-transparent bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <button className="px-6 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors flex items-center gap-2 font-bold shadow-lg shadow-slate-900/20 cursor-pointer">
          <Save className="w-4 h-4 text-[#FDB913]" />
          Save Settings
        </button>
      </div>
    </div>
  );

  const renderAuditLogs = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Audit Logs
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track all system activities and user actions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 font-medium cursor-pointer">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors flex items-center gap-2 font-medium shadow-md cursor-pointer">
            <Download className="w-4 h-4 text-[#FDB913]" />
            Export Logs
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {auditLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300 font-mono">
                    {log.timestamp}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-900 dark:text-white">
                    {log.user}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${getActionColor(log.action)}`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">
                    {log.module}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">
                    {log.details}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400 font-mono">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSystemHealth = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          System Health
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monitor system performance and health metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full font-bold">
              Heaithy
            </span>
          </div>
          <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Database
          </h4>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            99.9%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Uptime</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full font-bold">
              Normal
            </span>
          </div>
          <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
            CPU Usage
          </h4>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            45%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Average</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <Database className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full font-bold">
              Moderate
            </span>
          </div>
          <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Memory Usage
          </h4>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            68%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Used</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-full font-bold">
              Active
            </span>
          </div>
          <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Active Users
          </h4>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            24
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Online now
          </p>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="bg-slate-900 px-6 py-4 border-b border-[#FDB913]">
          <h4 className="font-bold text-lg text-white">System Status</h4>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    Web Server
                  </span>
                </div>
                <span className="text-xs text-emerald-600 font-bold">
                  ONLINE
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    Database
                  </span>
                </div>
                <span className="text-xs text-emerald-600 font-bold">
                  ONLINE
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    Email Service
                  </span>
                </div>
                <span className="text-xs text-emerald-600 font-bold">
                  ONLINE
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    File Storage
                  </span>
                </div>
                <span className="text-xs text-emerald-600 font-bold">
                  ONLINE
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    Backup Service
                  </span>
                </div>
                <span className="text-xs text-emerald-600 font-bold">
                  ONLINE
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    Monitoring Service
                  </span>
                </div>
                <span className="text-xs text-amber-600 font-bold">
                  WARNING
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent System Events */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="bg-slate-900 px-6 py-4 border-b border-[#FDB913]">
          <h4 className="font-bold text-lg text-white">Recent System Events</h4>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-lg">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <div className="flex-1">
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                  System backup completed successfully
                </p>
                <p className="text-xs text-emerald-600">2025-01-15 02:00:00</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800 rounded-lg">
              <Activity className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-300">
                  Database maintenance scheduled
                </p>
                <p className="text-xs text-slate-500">2025-01-16 01:00:00</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                  High memory usage detected
                </p>
                <p className="text-xs text-amber-600">2025-01-15 09:30:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Admin Panel
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage users, system settings, and monitor application health
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-bold text-sm transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? `border-[#FDB913] ${tab.color.replace("dark:text-[#FDB913]", "text-slate-900 dark:text-[#FDB913]")}`
                      : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${activeTab === tab.id ? "text-[#FDB913]" : ""}`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "user-management" && renderUserManagement()}
          {activeTab === "system-settings" && renderSystemSettings()}
          {activeTab === "audit-logs" && renderAuditLogs()}
          {activeTab === "system-health" && renderSystemHealth()}
        </div>
      </div>
    </div>
  );
};

export default AdminStep;
