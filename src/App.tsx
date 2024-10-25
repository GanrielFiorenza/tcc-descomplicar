import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "./config/firebase";
import { signOut } from "firebase/auth";
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

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    // Add event listener for when the window is closed or refreshed
    const handleBeforeUnload = async () => {
      if (auth.currentUser) {
        await signOut(auth);
        localStorage.removeItem('isLoggedIn');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
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
