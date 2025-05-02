import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import DoctorCalendar from '../components/doctor/DoctorCalendar';
import UpcomingAppointmentsList from '../components/doctor/UpcomingAppointmentsList';

const DoctorSchedule = () => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-telehealth-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || userRole !== 'doctor') {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 mt-14 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Schedule</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <DoctorCalendar />
            </div>
            <div>
              <UpcomingAppointmentsList />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorSchedule;