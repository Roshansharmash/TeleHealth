
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar, Clock, User, FileText, MessageCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define interfaces for our data
interface ProfileData {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  phone?: string;
  address?: string;
  profile_image_url?: string;
}

interface DoctorSpecialtyData {
  specialty?: string;
  qualification?: string;
  experience_years?: number;
  consultation_fee?: number;
}

interface AppointmentData {
  id: string;
  appointment_date: string;
  doctor_id?: string;
  patient_id?: string;
  status?: string;
  type?: string;
  symptoms?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  doctor?: {
    id?: string;
    profiles?: ProfileData[];
    doctor_profiles?: DoctorSpecialtyData[];
  };
  patient?: {
    id?: string;
    profiles?: ProfileData[];
  };
}

const AppointmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointment', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching appointment details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load appointment details',
          variant: 'destructive',
        });
        return null;
      }
      
      // Create enhanced appointment object with doctor and patient
      const enhancedAppointment: AppointmentData = {
        ...data,
        doctor: {
          id: data.doctor_id
        },
        patient: {
          id: data.patient_id
        }
      };
      
      if (data.doctor_id) {
        const { data: doctorProfileData, error: doctorProfileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.doctor_id)
          .single();
          
        if (!doctorProfileError && doctorProfileData) {
          enhancedAppointment.doctor = {
            id: data.doctor_id,
            profiles: [doctorProfileData]
          };

          const { data: doctorSpecialtyData, error: doctorSpecialtyError } = await supabase
            .from('doctor_profiles')
            .select('*')
            .eq('id', data.doctor_id)
            .single();
            
          if (!doctorSpecialtyError && doctorSpecialtyData) {
            enhancedAppointment.doctor.doctor_profiles = [doctorSpecialtyData];
          }
        }
      }
      
      if (data.patient_id) {
        const { data: patientProfileData, error: patientProfileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.patient_id)
          .single();
          
        if (!patientProfileError && patientProfileData) {
          enhancedAppointment.patient = {
            id: data.patient_id,
            profiles: [patientProfileData]
          };
        }
      }
      
      return enhancedAppointment;
    },
    enabled: !!id && !!user,
  });
  
  const { data: prescriptions, isLoading: isPrescriptionLoading } = useQuery({
    queryKey: ['prescriptions', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('appointment_id', id);
        
      if (error) {
        console.error('Error fetching prescriptions:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!id && !!user,
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-telehealth-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!appointment) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          <div className="telehealth-container py-12 text-center">
            <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Not Found</h2>
            <p className="text-gray-600 mb-6">The appointment you're looking for doesn't exist or you may not have access to view it.</p>
            <Button asChild>
              <Link to="/appointments">Back to Appointments</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const appointmentDate = new Date(appointment.appointment_date);
  const doctorName = `${appointment.doctor?.profiles?.[0]?.first_name || ''} ${appointment.doctor?.profiles?.[0]?.last_name || ''}`;
  const patientName = `${appointment.patient?.profiles?.[0]?.first_name || ''} ${appointment.patient?.profiles?.[0]?.last_name || ''}`;
  const isDoctor = user?.id === appointment.doctor_id;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="telehealth-container pt-6 pb-12">
          <div className="mb-6">
            <Link to="/appointments" className="inline-flex items-center text-telehealth-primary hover:text-telehealth-secondary">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Appointments
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="mb-6 animate-fade-in">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">Appointment Details</CardTitle>
                    <span 
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(appointment.status || 'scheduled')}`}
                    >
                      {appointment.status === 'scheduled' ? 'Scheduled' : 
                      appointment.status === 'cancelled' ? 'Cancelled' :
                      appointment.status === 'in_progress' ? 'In Progress' : 'Completed'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-sm text-gray-500">Date</h3>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-2 text-telehealth-primary" />
                          <span>{format(appointmentDate, 'EEEE, MMMM d, yyyy')}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-sm text-gray-500">Time</h3>
                        <div className="flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-2 text-telehealth-primary" />
                          <span>{format(appointmentDate, 'h:mm a')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-sm text-gray-500">
                          {isDoctor ? 'Patient' : 'Doctor'}
                        </h3>
                        <div className="flex items-center mt-1">
                          <User className="h-4 w-4 mr-2 text-telehealth-primary" />
                          <span>
                            {isDoctor ? patientName : `Dr. ${doctorName}`}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-sm text-gray-500">Type</h3>
                        <div className="flex items-center mt-1">
                          <MessageCircle className="h-4 w-4 mr-2 text-telehealth-primary" />
                          <span>
                            {appointment.type === 'video' ? 'Video Consultation' : 'Chat Consultation'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium text-sm text-gray-500 mb-2">Symptoms / Concerns</h3>
                      <div className="bg-gray-50 p-3 rounded-md">
                        {appointment.symptoms || 'No symptoms provided.'}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm text-gray-500 mb-2">Notes</h3>
                      <div className="bg-gray-50 p-3 rounded-md">
                        {appointment.notes || 'No notes available.'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-wrap gap-3">
                    {appointment.status === 'scheduled' && (
                      <>
                        {appointment.type === 'video' && (
                          <Button asChild className="bg-telehealth-primary hover:bg-telehealth-secondary text-white">
                            <Link to={`/consultation/${appointment.id}`}>
                              Join Video Consultation
                            </Link>
                          </Button>
                        )}
                        
                        <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
                          Cancel Appointment
                        </Button>
                      </>
                    )}
                    
                    {isDoctor && appointment.status !== 'cancelled' && (
                      <Button variant="outline" className="border-telehealth-primary text-telehealth-primary hover:bg-telehealth-light">
                        Update Appointment
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="animate-fade-in">
                <CardHeader className="pb-3">
                  <CardTitle>Medical Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="prescriptions">
                    <TabsList className="mb-4">
                      <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                      <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="prescriptions">
                      {isPrescriptionLoading ? (
                        <div className="flex justify-center py-6">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-telehealth-primary"></div>
                        </div>
                      ) : prescriptions && prescriptions.length > 0 ? (
                        <div className="space-y-4">
                          {prescriptions.map((prescription: any) => (
                            <div key={prescription.id} className="border rounded-lg p-4">
                              {prescription.medications && (
                                <div className="space-y-2">
                                  {Object.entries(prescription.medications).map(([med, details]: [string, any]) => (
                                    <div key={med} className="border-b pb-2 last:border-0">
                                      <h4 className="font-medium">{med}</h4>
                                      <p className="text-sm text-gray-600">Dosage: {details.dosage}</p>
                                      <p className="text-sm text-gray-600">Instructions: {details.instructions}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="mt-3 text-sm text-gray-600">
                                <p>{prescription.instructions || 'No additional instructions.'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="mx-auto h-8 w-8 mb-2" />
                          <p>No prescriptions available for this appointment.</p>
                          
                          {isDoctor && appointment.status === 'completed' && (
                            <Button className="mt-4 bg-telehealth-primary hover:bg-telehealth-secondary text-white">
                              Add Prescription
                            </Button>
                          )}
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="notes">
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="mx-auto h-8 w-8 mb-2" />
                        <p>No clinical notes available for this appointment.</p>
                        
                        {isDoctor && (
                          <Button className="mt-4 bg-telehealth-primary hover:bg-telehealth-secondary text-white">
                            Add Clinical Notes
                          </Button>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div>
              {isDoctor ? (
                <PatientInfoCard patient={appointment.patient} />
              ) : (
                <DoctorInfoCard doctor={appointment.doctor} />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const DoctorInfoCard = ({ doctor }: { doctor: AppointmentData['doctor'] }) => {
  if (!doctor) return null;
  
  const doctorProfile = doctor.profiles?.[0] || {};
  const doctorDetails = doctor.doctor_profiles?.[0] || {};
  
  return (
    <Card className="animate-slide-in-right">
      <CardHeader className="text-center pb-2">
        <CardTitle>Doctor Information</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={doctorProfile.profile_image_url || ''} />
          <AvatarFallback>{`${doctorProfile.first_name?.charAt(0) || ''}${doctorProfile.last_name?.charAt(0) || ''}`}</AvatarFallback>
        </Avatar>
        
        <h3 className="font-medium text-lg mb-1">Dr. {doctorProfile.first_name} {doctorProfile.last_name}</h3>
        <p className="text-telehealth-secondary">{doctorDetails.specialty}</p>
        
        <div className="w-full mt-4 space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Qualification</h4>
            <p>{doctorDetails.qualification}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Experience</h4>
            <p>{doctorDetails.experience_years} years</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Consultation Fee</h4>
            <p>${doctorDetails.consultation_fee}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PatientInfoCard = ({ patient }: { patient: AppointmentData['patient'] }) => {
  if (!patient) return null;
  
  const patientProfile = patient.profiles?.[0] || {};
  
  return (
    <Card className="animate-slide-in-right">
      <CardHeader className="text-center pb-2">
        <CardTitle>Patient Information</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={patientProfile.profile_image_url || ''} />
          <AvatarFallback>{`${patientProfile.first_name?.charAt(0) || ''}${patientProfile.last_name?.charAt(0) || ''}`}</AvatarFallback>
        </Avatar>
        
        <h3 className="font-medium text-lg mb-1">{patientProfile.first_name} {patientProfile.last_name}</h3>
        
        <div className="w-full mt-4 space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Date of Birth</h4>
            <p>{patientProfile.date_of_birth ? format(new Date(patientProfile.date_of_birth), 'MMMM d, yyyy') : 'Not provided'}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Phone</h4>
            <p>{patientProfile.phone || 'Not provided'}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Address</h4>
            <p>{patientProfile.address || 'Not provided'}</p>
          </div>
        </div>
        
        <div className="w-full mt-6">
          <Button asChild variant="outline" className="w-full">
            <Link to="/medical-records">View Medical History</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentDetails;
