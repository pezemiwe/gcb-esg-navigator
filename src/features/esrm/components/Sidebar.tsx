import React from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  CheckCircle,
  Clock,
  LogOut,
  Grid,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface SidebarProps {
  onNavigate?: (view: string) => void;
  currentView?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  onNavigate,
  currentView = "dashboard",
}) => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      active: currentView === "dashboard",
      view: "dashboard",
    },
    {
      icon: Users,
      label: "Create Customer",
      active: currentView === "create-customer",
      view: "create-customer",
    },
    {
      icon: Clock,
      label: "Pending Tasks",
      active: currentView === "pending-tasks",
      view: "pending-tasks",
    },
    {
      icon: CheckCircle,
      label: "Completed Projects",
      active: currentView === "completed-projects",
      view: "completed-projects",
    },
    {
      icon: Users,
      label: "Methodology",
      active: currentView === "methodology",
      view: "methodology",
    },
    {
      icon: Settings,
      label: "Admin",
      active: currentView === "admin",
      view: "admin",
    },
  ];

  return (
    <aside className="w-72 flex-col bg-white dark:bg-slate-900 border-r border-neutral-200 dark:border-slate-800 fixed h-full z-20 transition-colors duration-300 hidden md:flex">
      <div className="h-20 flex items-center px-6 border-b border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <img
            src="/assets/images/gcb_dark.png"
            alt="GCB Bank"
            className="h-10 w-auto"
          />
          <div className="flex flex-col border-l-2 border-[#FDB913] pl-3">
            <span className="text-base font-bold text-neutral-900 dark:text-white leading-tight">
              ESG Navigator
            </span>
            <span className="text-xs font-semibold text-[#FDB913] uppercase tracking-wider">
              ESRM Module
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-4">
        <div className="mb-8">
          <h3 className="px-4 text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">
            Main Menu
          </h3>
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() =>
                    onNavigate && item.view && onNavigate(item.view)
                  }
                  className={`flex items-center w-full gap-3 px-4 py-3.5 rounded-lg transition-all duration-200 group cursor-pointer ${
                    item.active
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-slate-800 font-bold shadow-md transform scale-[1.02]"
                      : "text-neutral-600 dark:text-slate-400 hover:bg-neutral-100 dark:hover:bg-slate-800 hover:text-neutral-900 dark:hover:text-white font-medium"
                  }`}
                >
                  <item.icon
                    size={20}
                    className={
                      item.active
                        ? "text-[#FDB913]"
                        : "text-neutral-400 dark:text-slate-500 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors"
                    }
                  />
                  <span className="tracking-wide text-sm">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="px-4 text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">
            Preferences
          </h3>
          <nav className="space-y-1">
            <button
              onClick={() => navigate("/modules")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-500 dark:text-slate-400 hover:bg-neutral-50 dark:hover:bg-slate-800 hover:text-neutral-900 dark:hover:text-white transition-colors group cursor-pointer"
            >
              <Grid
                size={20}
                className="text-neutral-400 dark:text-slate-500 group-hover:text-neutral-900 dark:group-hover:text-white"
              />
              Switch Module
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors group cursor-pointer"
            >
              <LogOut
                size={20}
                className="text-neutral-400 group-hover:text-red-500"
              />
              Sign Out
            </button>
          </nav>
        </div>
      </div>

      <div className="p-6 border-t border-neutral-100 dark:border-slate-800 bg-neutral-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-[#FDB913] p-0.5 shadow-sm overflow-hidden shrink-0">
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${user?.name || "User"}`
              }
              alt="User"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
              {user?.name || "User Name"}
            </p>
            <p className="text-xs text-neutral-500 dark:text-slate-400 truncate">
              {user?.role || "Risk Manager"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
