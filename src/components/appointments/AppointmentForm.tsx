
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { dummyDoctors } from '@/utils/dummyDoctors';
import { useAuth } from '@/context/AuthContext';

interface AppointmentFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AppointmentForm = ({ onClose, onSuccess }: AppointmentFormProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctor_id: '',
    appointment_date: format(new Date(), 'yyyy-MM-dd'),
    time: '10:00',
    type: 'video',
    symptoms: '',
  });
  
  const [showPopover, setShowPopover] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Appointment booked successfully! (Dummy functionality)');
      onSuccess();
    }, 1000);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-all">
      <div className="bg-gray-800 rounded-xl shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Book Appointment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white rounded-full p-1 hover:bg-gray-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="doctor_id" className="block text-sm font-medium text-gray-300 mb-2">Select Doctor</label>
              <select 
                id="doctor_id"
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="" disabled>Select a doctor</option>
                {dummyDoctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.profiles.first_name} {doctor.profiles.last_name} - {doctor.specialty}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="appointment_date" className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  id="appointment_date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleInputChange}
                  required
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">Appointment Type</label>
              <select 
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="video">Video Consultation</option>
                <option value="chat">Chat Consultation</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="symptoms" className="block text-sm font-medium text-gray-300 mb-2">Symptoms or Concerns</label>
              <textarea 
                id="symptoms"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
                placeholder="Please describe your symptoms or reason for visit"
                rows={4}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Booking...
                  </span>
                ) : 'Book Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
