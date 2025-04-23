
import React from 'react';
import { FileText } from 'lucide-react';
import AppointmentCard from './AppointmentCard';
import { AppointmentData } from './AppointmentCard';

interface AppointmentsListProps {
  appointments: AppointmentData[];
  onCancel?: (id: string) => void;
  isPast?: boolean;
  emptyMessage?: string;
}

const AppointmentsList = ({ appointments, onCancel, isPast = false, emptyMessage = "No appointments found" }: AppointmentsListProps) => {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <FileText className="mx-auto h-8 w-8 mb-2" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onCancel={onCancel}
          isPast={isPast}
        />
      ))}
    </div>
  );
};

export default AppointmentsList;

