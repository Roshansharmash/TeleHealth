
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import { AuthProvider } from "./context/AuthContext";
import { initializeApp } from "./utils/initializeApp";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Consultation from "./pages/Consultation";
import NotFound from "./pages/NotFound";
import Appointments from "./pages/Appointments";
import FindDoctor from "./pages/FindDoctor";
import MedicalRecords from "./pages/MedicalRecords";
import Profile from "./pages/Profile";
import AppointmentDetails from "./pages/AppointmentDetails";
import Prescriptions from "./pages/Prescriptions";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  useEffect(() => {
    // Initialize the app on first load
    initializeApp();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/consultation/:id" element={<Consultation />} />
              <Route path="/consultations/start" element={<Consultation />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/appointments/new" element={<Appointments />} />
              <Route path="/appointment/:id" element={<AppointmentDetails />} />
              <Route path="/find-doctor" element={<FindDoctor />} />
              <Route path="/medical-records" element={<MedicalRecords />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/prescriptions" element={<Prescriptions />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
