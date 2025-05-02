import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PatientDashboard from '../components/dashboard/PatientDashboard';
import DoctorDashboard from '../components/dashboard/DoctorDashboard';

const Dashboard = () => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-telehealth-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 mt-14 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
          {userRole === 'patient' ? <PatientDashboard /> : <DoctorDashboard />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
