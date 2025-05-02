import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

// Dummy data for appointments
const DUMMY_APPOINTMENTS = [
  { id: 1, patientName: 'John Smith', date: new Date(2025, 3, 28, 10, 0), status: 'confirmed' },
  { id: 2, patientName: 'Mary Johnson', date: new Date(2025, 3, 28, 11, 30), status: 'confirmed' },
  { id: 3, patientName: 'Robert Brown', date: new Date(2025, 3, 28, 14, 0), status: 'confirmed' },
  { id: 4, patientName: 'Patricia Davis', date: new Date(2025, 3, 29, 9, 0), status: 'confirmed' },
  { id: 5, patientName: 'Michael Wilson', date: new Date(2025, 3, 29, 16, 30), status: 'confirmed' },
  { id: 6, patientName: 'Linda Martinez', date: new Date(2025, 3, 30, 13, 0), status: 'pending' },
];

const DoctorCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedAppointments, setSelectedAppointments] = useState<any[]>([]);
  
  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    return DUMMY_APPOINTMENTS.filter(appointment => 
      appointment.date.getDate() === date.getDate() &&
      appointment.date.getMonth() === date.getMonth() &&
      appointment.date.getFullYear() === date.getFullYear()
    );
  };
  
  // Group appointments by their status
  const appointmentsByStatus = DUMMY_APPOINTMENTS.reduce((acc: Record<string, any[]>, appointment) => {
    acc[appointment.status] = acc[appointment.status] || [];
    acc[appointment.status].push(appointment);
    return acc;
  }, {});
  
  // Helper function to get dates with appointments
  const isDayWithAppointment = (day: Date) => {
    return DUMMY_APPOINTMENTS.some(appointment => 
      appointment.date.getDate() === day.getDate() &&
      appointment.date.getMonth() === day.getMonth() &&
      appointment.date.getFullYear() === day.getFullYear()
    );
  };
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setSelectedAppointments(getAppointmentsForDate(selectedDate));
    }
  };
  
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white">Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="lg:col-span-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-md border border-gray-700 bg-gray-800"
              modifiers={{
                hasAppointment: (date) => isDayWithAppointment(date),
              }}
              modifiersClassNames={{
                hasAppointment: "bg-telehealth-primary/20 font-bold text-telehealth-primary",
              }}
            />
            <div className="mt-4 flex gap-2 text-sm">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-telehealth-primary/20 mr-1"></div>
                <span className="text-gray-400">Has appointments</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-telehealth-primary mr-1"></div>
                <span className="text-gray-400">Selected day</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 h-full">
              <h3 className="font-medium text-white mb-4">
                {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
              </h3>
              
              {selectedAppointments.length > 0 ? (
                <div className="space-y-3">
                  {selectedAppointments.map(appointment => (
                    <div 
                      key={appointment.id}
                      className="border border-gray-700 rounded-lg p-3 hover:border-telehealth-primary transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white">{appointment.patientName}</h4>
                        <Badge 
                          variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                          className={appointment.status === 'confirmed' ? 'bg-green-600' : 'bg-yellow-600'}
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {format(appointment.date, 'h:mm a')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No appointments for this date</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
            <h3 className="font-medium text-white mb-3">Confirmed Appointments</h3>
            <p className="text-2xl font-bold text-telehealth-primary">
              {appointmentsByStatus.confirmed?.length || 0}
            </p>
          </div>
          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
            <h3 className="font-medium text-white mb-3">Pending Appointments</h3>
            <p className="text-2xl font-bold text-yellow-500">
              {appointmentsByStatus.pending?.length || 0}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorCalendar;
