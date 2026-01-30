import DashboardNavbar from "@/components/layout/DashboardNavbar/DashboardNavbar";
import { Box } from "@mui/material";

interface CRALayoutProps {
  children: React.ReactNode;
}

export default function CRALayout({ children }: CRALayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        pt: "70px", // Fixed navbar height
      }}
    >
      <DashboardNavbar />
      <Box
        component="main"
        sx={{
          flex: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
