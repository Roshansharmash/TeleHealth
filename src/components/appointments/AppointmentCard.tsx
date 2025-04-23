
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface DoctorProfile {
  first_name?: string;
  last_name?: string;
}

export interface AppointmentData {
  id: string;
  appointment_date: string;
  status?: string;
  type?: string;
  doctor_id?: string;
  patient_id?: string;
  doctor?: {
    id: string;
    profiles?: DoctorProfile[];
  };
}

interface AppointmentCardProps {
  appointment: AppointmentData;
  onCancel?: (id: string) => void;
  isPast?: boolean;
}

const AppointmentCard = ({ appointment, onCancel, isPast = false }: AppointmentCardProps) => {
  const appointmentDate = new Date(appointment.appointment_date);
  const doctorName = appointment.doctor?.profiles?.[0]?.first_name + ' ' + appointment.doctor?.profiles?.[0]?.last_name || 'Unknown Doctor';

  const getStatusStyles = (status?: string) => {
    switch(status) {
      case 'scheduled':
        return 'bg-green-900 text-green-100';
      case 'cancelled':
        return 'bg-red-900 text-red-100';
      case 'in_progress':
        return 'bg-blue-900 text-blue-100';
      case 'completed':
        return 'bg-gray-700 text-gray-100';
      default:
        return 'bg-gray-700 text-gray-100';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch(status) {
      case 'scheduled':
        return 'Scheduled';
      case 'cancelled':
        return 'Cancelled';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="border border-gray-700 rounded-lg p-4 hover:border-indigo-500 transition-all duration-200 bg-gray-800 shadow-sm hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-gray-100">Dr. {doctorName}</h4>
          <div className="flex items-center text-sm text-gray-400 mt-1">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{format(appointmentDate, 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center text-sm text-gray-400 mt-1">
            <Clock className="h-4 w-4 mr-1" />
            <span>{format(appointmentDate, 'h:mm a')}</span>
          </div>
          <div className="mt-2">
            <span 
              className={`text-xs px-2 py-1 rounded-full ${getStatusStyles(appointment.status)}`}
            >
              {getStatusLabel(appointment.status)}
            </span>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          {appointment.status === 'scheduled' && !isPast && (
            <>
              {appointment.type === 'video' && (
                <Link 
                  to="#" 
                  className="bg-transparent border border-indigo-500 text-indigo-400 hover:bg-indigo-900/30 px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Join Video
                </Link>
              )}
              <button 
                className="bg-transparent border border-gray-600 text-gray-400 hover:bg-gray-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                onClick={() => onCancel && onCancel(appointment.id)}
              >
                Cancel
              </button>
            </>
          )}
          <Link 
            to="#" 
            className="bg-transparent border border-gray-600 text-gray-400 hover:bg-gray-700 px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;

