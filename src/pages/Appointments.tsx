
import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AppointmentForm from '@/components/appointments/AppointmentForm';
import AppointmentsList from '@/components/appointments/AppointmentsList';
import CustomCalendar from '@/components/appointments/CustomCalendar';
import { isSameDay } from 'date-fns';
import { dummyAppointments } from '@/utils/dummyAppointments';

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Filter appointments by selected date
  const filteredAppointments = dummyAppointments.filter(appointment => {
    if (!selectedDate) return true;
    const appointmentDate = new Date(appointment.appointment_date);
    return isSameDay(appointmentDate, selectedDate);
  });

  const handleCancelAppointment = (appointmentId: string) => {
    alert("Appointment cancelled (dummy functionality)");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      <main className="flex-1 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-100">Appointments</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-100">Your Appointments</h2>
                  <button 
                    onClick={() => setShowAppointmentModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Book New Appointment
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex border-b border-gray-700 mb-4">
                    <button 
                      className={`px-4 py-2 font-medium ${activeTab === 'upcoming' ? 
                        'text-indigo-400 border-b-2 border-indigo-400' : 
                        'text-gray-400 hover:text-gray-300'}`}
                      onClick={() => setActiveTab('upcoming')}
                    >
                      Upcoming
                    </button>
                    <button 
                      className={`px-4 py-2 font-medium ${activeTab === 'past' ? 
                        'text-indigo-400 border-b-2 border-indigo-400' : 
                        'text-gray-400 hover:text-gray-300'}`}
                      onClick={() => setActiveTab('past')}
                    >
                      Past
                    </button>
                    <button 
                      className={`px-4 py-2 font-medium ${activeTab === 'cancelled' ? 
                        'text-indigo-400 border-b-2 border-indigo-400' : 
                        'text-gray-400 hover:text-gray-300'}`}
                      onClick={() => setActiveTab('cancelled')}
                    >
                      Cancelled
                    </button>
                  </div>

                  {activeTab === 'upcoming' && (
                    <AppointmentsList
                      appointments={filteredAppointments.filter(a => ['scheduled', 'in_progress'].includes(a.status || ''))}
                      onCancel={handleCancelAppointment}
                      emptyMessage="No upcoming appointments for the selected date."
                    />
                  )}

                  {activeTab === 'past' && (
                    <AppointmentsList
                      appointments={filteredAppointments.filter(a => a.status === 'completed')}
                      isPast
                      emptyMessage="No past appointments for the selected date."
                    />
                  )}

                  {activeTab === 'cancelled' && (
                    <AppointmentsList
                      appointments={filteredAppointments.filter(a => a.status === 'cancelled')}
                      isPast
                      emptyMessage="No cancelled appointments for the selected date."
                    />
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <h2 className="font-semibold text-gray-100">Select Date</h2>
                </div>
                <div className="p-4">
                  <CustomCalendar 
                    selectedDate={selectedDate} 
                    setSelectedDate={setSelectedDate} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showAppointmentModal && (
        <AppointmentForm
          onClose={() => setShowAppointmentModal(false)}
          onSuccess={() => setShowAppointmentModal(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Appointments;

