import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MessagesList from '../components/doctor/MessagesList';
import MessageDetail from '../components/doctor/MessageDetail';
import { Card } from '@/components/ui/card';

const DoctorMessages = () => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const [selectedMessageId, setSelectedMessageId] = React.useState<string | null>(null);
  
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
          
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
              <div className="border-r border-gray-200">
                <MessagesList 
                  selectedMessageId={selectedMessageId} 
                  onSelectMessage={setSelectedMessageId} 
                />
              </div>
              <div className="col-span-2">
                {selectedMessageId ? (
                  <MessageDetail messageId={selectedMessageId} />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    <p>Select a message to view</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorMessages;