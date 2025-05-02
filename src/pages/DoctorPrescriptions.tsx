import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PrescriptionForm from '../components/doctor/PrescriptionForm';
import PrescriptionsList from '../components/doctor/PrescriptionList';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const DoctorPrescriptions = () => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const [showNewPrescriptionForm, setShowNewPrescriptionForm] = useState(false);
  
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
            <Button 
              onClick={() => setShowNewPrescriptionForm(true)}
              className="bg-telehealth-primary hover:bg-telehealth-secondary text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> New Prescription
            </Button>
          </div>
          
          {showNewPrescriptionForm ? (
            <PrescriptionForm 
              onCancel={() => setShowNewPrescriptionForm(false)} 
              onSuccess={() => setShowNewPrescriptionForm(false)}
            />
          ) : (
            <PrescriptionsList />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorPrescriptions;