import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, FileText } from 'lucide-react';
import PatientRecordsList from '../components/doctor/PatientRecordsList';
import PatientRecordDetails from '../components/doctor/PatientRecordDetails';

const DoctorPatientRecords = () => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-telehealth-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || userRole !== 'doctor') {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      <main className="flex-1 mt-14 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Patient Records</h1>
          
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search patients by name..."
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </Card>
          
          {selectedPatientId ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <PatientRecordsList 
                  patientId={selectedPatientId} 
                  onSelectRecord={setSelectedRecord} 
                  onBack={() => {
                    setSelectedPatientId(null);
                    setSelectedRecord(null);
                  }} 
                />
              </div>
              <div className="lg:col-span-2">
                {selectedRecord ? (
                  <PatientRecordDetails record={selectedRecord} />
                ) : (
                  <Card className="bg-gray-800 border-gray-700 h-56 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <FileText className="mx-auto h-10 w-10 mb-2" />
                      <p>Select a record to view details</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Patient list - placeholder for now */}
              {Array.from({ length: 9 }).map((_, index) => (
                <Card 
                  key={index} 
                  className="bg-gray-800 border-gray-700 p-4 cursor-pointer hover:border-telehealth-primary"
                  onClick={() => setSelectedPatientId(`patient-${index + 1}`)}
                >
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold">
                      {String.fromCharCode(65 + (index % 26))}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-white">Patient {index + 1}</h3>
                      <p className="text-sm text-gray-400">ID: PAT-{1000 + index}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorPatientRecords;