import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import CreateAccount from "./pages/CreateAccount";
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

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <div className="flex h-screen overflow-hidden">
            {isLoggedIn && (
              <Sidebar
                onLogout={handleLogout}
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
              />
            )}
            <main
              className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 transition-all duration-300 ease-in-out ${
                isLoggedIn ? (isSidebarOpen ? 'ml-64' : 'ml-16') : ''
              }`}
            >
              <Routes>
                <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Index onLogin={handleLogin} />} />
                <Route path="/create-account" element={<CreateAccount />} />
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