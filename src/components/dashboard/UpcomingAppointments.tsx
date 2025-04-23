
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import { dummyAppointments } from '@/utils/dummyAppointments';

// Define types for our data
interface DoctorProfile {
  first_name?: string;
  last_name?: string;
}

interface PatientProfile {
  first_name?: string;
  last_name?: string;
}

interface AppointmentData {
  id: string;
  doctor_id?: string;
  patient_id?: string;
  appointment_date: string;
  status: string;
  type: string;
  doctor?: {
    id?: string;
    profiles?: DoctorProfile[];
  };
  patient?: {
    id?: string;
    profiles?: PatientProfile[];
  };
}

const UpcomingAppointments = () => {
  const { user } = useAuth();
  
  // Filter only upcoming appointments (scheduled or in_progress)
  const upcomingAppointments = dummyAppointments.filter(
    app => ['scheduled', 'in_progress'].includes(app.status)
  ).slice(0, 3); // Get only 3 appointments
  
  const isLoading = false; // No loading state needed with dummy data
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-3 animate-pulse border-gray-700">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-24"></div>
                <div className="h-3 bg-gray-700 rounded w-20"></div>
                <div className="h-3 bg-gray-700 rounded w-32 mt-1"></div>
              </div>
              <div className="h-5 bg-gray-700 rounded-full w-16"></div>
            </div>
            <div className="flex space-x-2 mt-3">
              <div className="h-8 bg-gray-700 rounded flex-1"></div>
              <div className="h-8 bg-gray-700 rounded flex-1"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {upcomingAppointments.length > 0 ? (
        upcomingAppointments.map((appointment, index) => {
          const isDoctor = user?.role === 'doctor';
          
          // Check if doctor or patient data exists and handle accordingly
          const appointmentName = isDoctor 
            ? `${appointment.patient?.profiles?.[0]?.first_name || 'Unknown'} ${appointment.patient?.profiles?.[0]?.last_name || 'Patient'}`
            : `Dr. ${appointment.doctor?.profiles?.[0]?.first_name || ''} ${appointment.doctor?.profiles?.[0]?.last_name || ''}`;
            
          const specialty = isDoctor ? 'Patient' : 'Doctor';
            
          return (
            <div 
              key={appointment.id} 
              className="border border-gray-700 rounded-lg p-3 hover:border-indigo-500 transition-all duration-200 bg-gray-800 shadow-sm hover:shadow-md"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-sm text-gray-100">
                    {appointmentName}
                  </h4>
                  <p className="text-xs text-gray-400">{specialty}</p>
                  <div className="mt-2 flex items-center text-xs text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span className="mr-2">{format(new Date(appointment.appointment_date), 'MMM d')}</span>
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{format(new Date(appointment.appointment_date), 'h:mm a')}</span>
                  </div>
                </div>
                <span 
                  className={`text-xs px-2 py-1 rounded-full ${
                    appointment.status === 'scheduled' 
                      ? 'bg-green-900 text-green-100' 
                      : 'bg-blue-900 text-blue-100'
                  }`}
                >
                  {appointment.status === 'scheduled' ? 'Scheduled' : 'In Progress'}
                </span>
              </div>
              
              <div className="flex space-x-2 mt-3">
                {appointment.type === 'video' && (
                  <Link 
                    to={`/consultation/${appointment.id}`}
                    className="flex-1 bg-transparent border border-indigo-500 text-indigo-400 hover:bg-indigo-900/30 px-3 py-1 rounded text-sm font-medium text-center transition-colors"
                  >
                    Join Video
                  </Link>
                )}
                <Link 
                  to={`/appointment/${appointment.id}`}
                  className="flex-1 bg-transparent border border-gray-600 text-gray-400 hover:bg-gray-700 px-3 py-1 rounded text-sm font-medium text-center transition-colors"
                >
                  Details
                </Link>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-sm text-center text-gray-400 py-4">
          No upcoming appointments
        </p>
      )}
    </div>
  );
};

export default UpcomingAppointments;
