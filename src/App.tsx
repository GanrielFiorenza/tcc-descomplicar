import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import LandingPage from "./pages/LandingPage";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

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
              className={`
                flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 
                transition-all duration-300 ease-in-out
                ${isLoggedIn ? 'md:ml-16 md:w-[calc(100%-4rem)]' : ''}
                ${isLoggedIn && isSidebarOpen ? 'md:ml-64 md:w-[calc(100%-16rem)]' : ''}
              `}
            >
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Index onLogin={handleLogin} />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route
                  path="/dashboard"
                  element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
                />
                <Route
                  path="/vehicles"
                  element={isLoggedIn ? <VehicleRegistration /> : <Navigate to="/login" />}
                />
                <Route
                  path="/maintenance"
                  element={isLoggedIn ? <MaintenanceHistory /> : <Navigate to="/login" />}
                />
                <Route
                  path="/expenses"
                  element={isLoggedIn ? <ExpenseControl /> : <Navigate to="/login" />}
                />
                <Route
                  path="/reports"
                  element={isLoggedIn ? <CustomReports /> : <Navigate to="/login" />}
                />
                <Route
                  path="/settings"
                  element={isLoggedIn ? <Settings /> : <Navigate to="/login" />}
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