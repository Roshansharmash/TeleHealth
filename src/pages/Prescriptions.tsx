
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { FileText, Search } from 'lucide-react';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Json } from '@/integrations/supabase/types';

// Define interfaces for the data
interface DoctorProfile {
  first_name?: string;
  last_name?: string;
}

interface PrescriptionData {
  id: string;
  patient_id?: string;
  doctor_id?: string;
  appointment_id?: string;
  medications?: Record<string, any>;
  instructions?: string;
  created_at: string;
  appointment?: {
    appointment_date: string;
  };
  doctor?: {
    profile: DoctorProfile;
  };
}

const Prescriptions = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: prescriptions, isLoading } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: async () => {
      if (!user) return [];
      
      // Get basic prescription data
      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          *,
          appointment:appointment_id(appointment_date)
        `)
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching prescriptions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load prescriptions',
          variant: 'destructive',
        });
        return [];
      }
      
      // Fetch doctor information for each prescription
      const enhancedPrescriptions: PrescriptionData[] = [];
      
      if (data && data.length > 0) {
        for (const prescription of data) {
          // Transform medications from Json to Record<string, any>
          // This ensures type compatibility with PrescriptionData
          const typedMedications = prescription.medications as Record<string, any> | null;
          
          const enhancedPrescription: PrescriptionData = {
            ...prescription,
            medications: typedMedications || undefined,
            doctor: { profile: {} }
          };
          
          if (prescription.doctor_id) {
            const { data: doctorData, error: doctorError } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', prescription.doctor_id)
              .single();
              
            if (!doctorError && doctorData) {
              enhancedPrescription.doctor = {
                profile: doctorData
              };
            }
          }
          
          enhancedPrescriptions.push(enhancedPrescription);
        }
      }
      
      return enhancedPrescriptions;
    },
    enabled: !!user,
  });
  
  const filteredPrescriptions = prescriptions?.filter(prescription => {
    if (!searchTerm) return true;
    
    const hasMedication = prescription.medications && 
      Object.keys(prescription.medications).some(med => 
        med.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const hasDoctor = prescription.doctor?.profile?.first_name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      prescription.doctor?.profile?.last_name?.toLowerCase()?.includes(searchTerm.toLowerCase());
    
    return hasMedication || hasDoctor;
  });
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="telehealth-container pt-6 pb-12">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Prescriptions</h1>
          
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search by medication or doctor..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
          </Card>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-telehealth-primary"></div>
            </div>
          ) : filteredPrescriptions && filteredPrescriptions.length > 0 ? (
            <div className="space-y-6">
              {filteredPrescriptions.map(prescription => (
                <PrescriptionCard key={prescription.id} prescription={prescription} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No prescriptions found</h3>
              <p className="text-gray-500 mb-6">No prescriptions match your search or you don't have any prescriptions yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const PrescriptionCard = ({ prescription }: { prescription: PrescriptionData }) => {
  const doctorName = `${prescription.doctor?.profile?.first_name || ''} ${prescription.doctor?.profile?.last_name || ''}`;
  const createdDate = new Date(prescription.created_at);
  const appointmentDate = prescription.appointment?.appointment_date ? new Date(prescription.appointment.appointment_date) : null;
  
  return (
    <Card className="animate-fade-in hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Prescription</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Prescribed on {format(createdDate, 'MMMM d, yyyy')}
              {appointmentDate && ` • Appointment: ${format(appointmentDate, 'MMMM d, yyyy')}`}
            </p>
          </div>
          <Button variant="outline">Download PDF</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Prescribed by</h3>
          <p className="font-medium">Dr. {doctorName}</p>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Medications</h3>
          
          {prescription.medications && (
            <div className="space-y-4">
              {Object.entries(prescription.medications).map(([med, details]: [string, any]) => (
                <div key={med} className="p-3 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-telehealth-primary">{med}</h4>
                    {details.dosage && (
                      <span className="px-2 py-1 bg-telehealth-light text-telehealth-secondary rounded-full text-xs">
                        {details.dosage}
                      </span>
                    )}
                  </div>
                  
                  {details.instructions && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Instructions:</span> {details.instructions}
                    </div>
                  )}
                  
                  {details.frequency && (
                    <div className="mt-1 text-sm text-gray-600">
                      <span className="font-medium">Frequency:</span> {details.frequency}
                    </div>
                  )}
                  
                  {details.duration && (
                    <div className="mt-1 text-sm text-gray-600">
                      <span className="font-medium">Duration:</span> {details.duration}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {prescription.instructions && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Additional Instructions</h3>
              <p className="text-gray-800">{prescription.instructions}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Prescriptions;
