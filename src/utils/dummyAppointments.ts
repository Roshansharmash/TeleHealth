// src/utils/dummyAppointments.ts

export type Appointment = {
  id: string;
  title: string;
  doctor_name: string;
  doctor_specialty: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  location: string;
  patient_name?: string;
  image_url?: string;
}

export const dummyAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Annual Check-up',
    doctor_name: 'Dr. Sarah Johnson',
    doctor_specialty: 'General Practitioner',
    appointment_date: new Date().toISOString(), // Today
    start_time: '09:00 AM',
    end_time: '09:30 AM',
    status: 'scheduled',
    location: 'Main Medical Center, Room 204',
    image_url: '/images/doctors/sarah-johnson.jpg',
  },
  {
    id: '2',
    title: 'Dental Cleaning',
    doctor_name: 'Dr. Michael Chen',
    doctor_specialty: 'Dentist',
    appointment_date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), // 2 days from now
    start_time: '11:15 AM',
    end_time: '12:00 PM',
    status: 'scheduled',
    notes: 'Remember to bring recent X-rays',
    location: 'Smile Dental Clinic, 3rd Floor',
    image_url: '/images/doctors/michael-chen.jpg',
  },
  {
    id: '3',
    title: 'Ophthalmology Consultation',
    doctor_name: 'Dr. Amelia Rodriguez',
    doctor_specialty: 'Ophthalmologist',
    appointment_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), // 7 days from now
    start_time: '2:30 PM',
    end_time: '3:15 PM',
    status: 'scheduled',
    location: 'Vision Care Center, Suite 12B',
    image_url: '/images/doctors/amelia-rodriguez.jpg',
  },
  {
    id: '4',
    title: 'Physical Therapy Session',
    doctor_name: 'Dr. James Wilson',
    doctor_specialty: 'Physical Therapist',
    appointment_date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), // 5 days ago
    start_time: '10:00 AM',
    end_time: '11:00 AM',
    status: 'completed',
    notes: 'Follow-up for knee rehabilitation',
    location: 'RehabPlus Center, Ground Floor',
    image_url: '/images/doctors/james-wilson.jpg',
  },
  {
    id: '5',
    title: 'Dermatology Follow-up',
    doctor_name: 'Dr. Emily Zhang',
    doctor_specialty: 'Dermatologist',
    appointment_date: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString(), // 14 days ago
    start_time: '4:45 PM',
    end_time: '5:15 PM',
    status: 'completed',
    location: 'Skin Health Specialists, Room 315',
    image_url: '/images/doctors/emily-zhang.jpg',
  },
  {
    id: '6',
    title: 'Nutritional Consultation',
    doctor_name: 'Dr. Robert Patel',
    doctor_specialty: 'Nutritionist',
    appointment_date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), // 2 days ago
    start_time: '1:00 PM',
    end_time: '2:00 PM',
    status: 'cancelled',
    notes: 'Diet plan review and adjustments',
    location: 'Wellness Nutrition Center, Suite 8',
    image_url: '/images/doctors/robert-patel.jpg',
  },
  {
    id: '7',
    title: 'Cardiology Check-up',
    doctor_name: 'Dr. Lisa Blackwell',
    doctor_specialty: 'Cardiologist',
    appointment_date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(), // 14 days from now
    start_time: '11:30 AM',
    end_time: '12:15 PM',
    status: 'scheduled',
    notes: 'Bring previous EKG results',
    location: 'Heart & Vascular Institute, 5th Floor',
    image_url: '/images/doctors/lisa-blackwell.jpg',
  },
  {
    id: '8',
    title: 'ENT Consultation',
    doctor_name: 'Dr. Thomas Harris',
    doctor_specialty: 'Otolaryngologist',
    appointment_date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), // Yesterday
    start_time: '3:00 PM',
    end_time: '3:30 PM',
    status: 'cancelled',
    location: 'ENT Specialists Building, Room 207',
    image_url: '/images/doctors/thomas-harris.jpg',
  },
  {
    id: '9',
    title: 'Pediatric Vaccination',
    doctor_name: 'Dr. Maria Sanchez',
    doctor_specialty: 'Pediatrician',
    appointment_date: new Date().toISOString(), // Today
    start_time: '2:00 PM',
    end_time: '2:30 PM',
    status: 'in_progress',
    notes: 'Regular childhood vaccination schedule',
    location: 'Sunshine Children\'s Clinic, Wing B',
    image_url: '/images/doctors/maria-sanchez.jpg',
  },
  {
    id: '10',
    title: 'Orthopedic Consultation',
    doctor_name: 'Dr. David Kim',
    doctor_specialty: 'Orthopedic Surgeon',
    appointment_date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), // 5 days from now
    start_time: '9:45 AM',
    end_time: '10:30 AM',
    status: 'scheduled',
    notes: 'Discussion of MRI results',
    location: 'Orthopedic Medical Group, Suite 420',
    image_url: '/images/doctors/david-kim.jpg',
  }
];