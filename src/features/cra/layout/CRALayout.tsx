import DashboardNavbar from "@/components/layout/DashboardNavbar/DashboardNavbar";

interface CRALayoutProps {
  children: React.ReactNode;
}

export default function CRALayout({ children }: CRALayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNavbar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
