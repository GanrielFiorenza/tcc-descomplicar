import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import VehicleRegistration from "./pages/VehicleRegistration";
import MaintenanceHistory from "./pages/MaintenanceHistory";
import ExpenseControl from "./pages/ExpenseControl";
import CustomReports from "./pages/CustomReports";
import Settings from "./pages/Settings";
import Sidebar from "./components/Sidebar";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <div className="flex">
            {isLoggedIn && <Sidebar onLogout={handleLogout} />}
            <main className={`flex-1 transition-all duration-300 ${isLoggedIn ? (isSidebarOpen ? 'ml-64' : 'ml-16') : ''}`}>
              <Routes>
                <Route path="/" element={<Index onLogin={handleLogin} />} />
                <Route
                  path="/dashboard"
                  element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
                />
                <Route
                  path="/vehicles"
                  element={isLoggedIn ? <VehicleRegistration /> : <Navigate to="/" />}
                />
                <Route
                  path="/maintenance"
                  element={isLoggedIn ? <MaintenanceHistory /> : <Navigate to="/" />}
                />
                <Route
                  path="/expenses"
                  element={isLoggedIn ? <ExpenseControl /> : <Navigate to="/" />}
                />
                <Route
                  path="/reports"
                  element={isLoggedIn ? <CustomReports /> : <Navigate to="/" />}
                />
                <Route
                  path="/settings"
                  element={isLoggedIn ? <Settings /> : <Navigate to="/" />}
                />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;