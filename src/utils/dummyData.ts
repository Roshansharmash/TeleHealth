
import { supabase } from '@/integrations/supabase/client';

// Function to add dummy data to the database
export async function addDummyData() {
  try {
    console.log('Starting dummy data generation...');
    
    // Check if we already have data
    const { count } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true });

    if (count && count > 5) {
      console.log('Dummy data already exists');
      return;
    }

    // Generate valid UUID strings
    const doctorIds = [
      '11111111-1111-1111-1111-111111111111',
      '22222222-2222-2222-2222-222222222222',
      '33333333-3333-3333-3333-333333333333'
    ];
    
    const patientIds = [
      '44444444-4444-4444-4444-444444444444',
      '55555555-5555-5555-5555-555555555555',
      '66666666-6666-6666-6666-666666666666'
    ];

    // Sample doctor profiles with valid UUIDs
    const doctors = [
      {
        id: doctorIds[0],
        specialty: 'Cardiology',
        qualification: 'MD, FACC',
        experience_years: 12,
        consultation_fee: 150,
        rating: 4.8,
        availability_schedule: {
          monday: ['9:00', '10:00', '11:00', '14:00', '15:00'],
          tuesday: ['9:00', '10:00', '11:00', '14:00', '15:00'],
          wednesday: ['9:00', '10:00', '11:00', '14:00', '15:00'],
          thursday: ['9:00', '10:00', '11:00', '14:00', '15:00'],
          friday: ['9:00', '10:00', '11:00', '14:00', '15:00']
        }
      },
      {
        id: doctorIds[1],
        specialty: 'Dermatology',
        qualification: 'MD, FAAD',
        experience_years: 8,
        consultation_fee: 130,
        rating: 4.7,
        availability_schedule: {
          monday: ['9:00', '10:00', '11:00', '14:00', '15:00'],
          tuesday: ['9:00', '10:00', '11:00', '14:00', '15:00'],
          wednesday: ['9:00', '10:00', '11:00', '14:00', '15:00'],
          thursday: ['9:00', '10:00', '11:00', '14:00', '15:00'],
          friday: ['9:00', '10:00', '11:00', '14:00', '15:00']
        }
      },
      {
        id: doctorIds[2],
        specialty: 'Neurology',
        qualification: 'MD, PhD',
        experience_years: 15,
        consultation_fee: 180,
        rating: 4.9,
        availability_schedule: {
          monday: ['9:00', '10:00', '11:00', '14:00', '15:00'],
          tuesday: ['9:00', '10:00', '11:00', '14:00', '15:00'],
          wednesday: ['9:00', '10:00', '11:00', '14:00', '15:00'],
          thursday: ['9:00', '10:00', '11:00', '14:00', '15:00'],
          friday: ['9:00', '10:00', '11:00', '14:00', '15:00']
        }
      }
    ];

    // Sample patient profiles with valid UUIDs
    const patients = [
      {
        id: patientIds[0],
        first_name: 'John',
        last_name: 'Doe',
        date_of_birth: '1985-05-15',
        address: '123 Main St, Anytown, USA',
        phone: '555-123-4567'
      },
      {
        id: patientIds[1],
        first_name: 'Jane',
        last_name: 'Smith',
        date_of_birth: '1992-08-23',
        address: '456 Oak Ave, Somewhere, USA',
        phone: '555-987-6543'
      },
      {
        id: patientIds[2],
        first_name: 'Michael',
        last_name: 'Johnson',
        date_of_birth: '1978-11-30',
        address: '789 Pine Rd, Elsewhere, USA',
        phone: '555-456-7890'
      }
    ];

    console.log('Adding doctor and patient profiles...');

    // Insert doctor profiles
    for (const doctor of doctors) {
      // Check if profile exists
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', doctor.id)
        .maybeSingle();

      if (!profileData) {
        // Add profile entry
        await supabase.from('profiles').insert({
          id: doctor.id,
          first_name: `Dr. ${doctor.specialty.substring(0, 3)}`,
          last_name: `${doctor.specialty}`,
          profile_image_url: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 50)}.jpg`
        });
      }

      // Check if doctor profile exists
      const { data: doctorData } = await supabase
        .from('doctor_profiles')
        .select('*')
        .eq('id', doctor.id)
        .maybeSingle();

      if (!doctorData) {
        // Add doctor profile
        await supabase.from('doctor_profiles').insert({
          id: doctor.id,
          specialty: doctor.specialty,
          qualification: doctor.qualification,
          experience_years: doctor.experience_years,
          consultation_fee: doctor.consultation_fee,
          rating: doctor.rating,
          availability_schedule: doctor.availability_schedule
        });
      }
    }

    // Insert patient profiles
    for (const patient of patients) {
      // Check if profile exists
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', patient.id)
        .maybeSingle();

      if (!profileData) {
        // Add profile entry
        await supabase.from('profiles').insert({
          id: patient.id,
          first_name: patient.first_name,
          last_name: patient.last_name,
          date_of_birth: patient.date_of_birth,
          address: patient.address,
          phone: patient.phone,
          profile_image_url: `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 50)}.jpg`
        });
      }
    }

    console.log('Generating appointments...');
    
    // Generate appointments between doctors and patients
    const today = new Date();
    const appointmentTypes = ['video', 'chat'];
    const appointmentStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
    const commonSymptoms = [
      'Persistent headache and dizziness',
      'Fever and sore throat',
      'Lower back pain',
      'Skin rash and itching',
      'Chest pain and shortness of breath',
      'Abdominal pain and nausea',
      'Joint pain in knees',
      'Persistent cough and congestion',
      'Fatigue and weakness',
      'Allergic reactions'
    ];

    // Generate 15 appointments
    for (let i = 0; i < 15; i++) {
      const doctorId = doctors[Math.floor(Math.random() * doctors.length)].id;
      const patientId = patients[Math.floor(Math.random() * patients.length)].id;
      
      // Random date in past or future
      const daysOffset = Math.floor(Math.random() * 30) - 10; // -10 to +20 days
      const appointmentDate = new Date();
      appointmentDate.setDate(today.getDate() + daysOffset);
      
      // Random hour between 9 and 17
      appointmentDate.setHours(9 + Math.floor(Math.random() * 8), 0, 0);
      
      const type = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
      const symptom = commonSymptoms[Math.floor(Math.random() * commonSymptoms.length)];
      
      // Status depends on date
      let status;
      if (appointmentDate < today) {
        status = Math.random() < 0.8 ? 'completed' : 'cancelled'; 
      } else if (appointmentDate.getDate() === today.getDate()) {
        status = Math.random() < 0.5 ? 'scheduled' : 'in_progress';
      } else {
        status = 'scheduled';
      }

      await supabase.from('appointments').insert({
        doctor_id: doctorId,
        patient_id: patientId,
        appointment_date: appointmentDate.toISOString(),
        type,
        status,
        notes: 'Follow-up appointment',
        symptoms: symptom
      });
    }

    console.log('Generating prescriptions...');

    // Generate some prescriptions with more realistic medical data
    const medicines = [
      { name: 'Amoxicillin', dosage: '500mg', frequency: 'three times a day', duration: '7 days' },
      { name: 'Lisinopril', dosage: '10mg', frequency: 'once daily', duration: '30 days' },
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'once daily at bedtime', duration: '90 days' },
      { name: 'Metformin', dosage: '1000mg', frequency: 'twice daily with meals', duration: '30 days' },
      { name: 'Levothyroxine', dosage: '50mcg', frequency: 'once daily before breakfast', duration: '90 days' },
      { name: 'Sertraline', dosage: '100mg', frequency: 'once daily', duration: '30 days' },
      { name: 'Ibuprofen', dosage: '400mg', frequency: 'every 6 hours as needed', duration: '5 days' },
      { name: 'Amlodipine', dosage: '5mg', frequency: 'once daily', duration: '30 days' },
      { name: 'Omeprazole', dosage: '20mg', frequency: 'once daily before breakfast', duration: '14 days' },
      { name: 'Hydrochlorothiazide', dosage: '25mg', frequency: 'once daily', duration: '30 days' }
    ];

    const { data: completedAppointments } = await supabase
      .from('appointments')
      .select('id, doctor_id, patient_id')
      .eq('status', 'completed')
      .limit(5);

    if (completedAppointments && completedAppointments.length > 0) {
      for (const appointment of completedAppointments) {
        const numMedicines = Math.floor(Math.random() * 3) + 1;
        const medicationList = [];
        
        for (let i = 0; i < numMedicines; i++) {
          const med = medicines[Math.floor(Math.random() * medicines.length)];
          medicationList.push({
            ...med,
            instructions: 'Take with food and complete the full course.'
          });
        }

        await supabase.from('prescriptions').insert({
          appointment_id: appointment.id,
          doctor_id: appointment.doctor_id,
          patient_id: appointment.patient_id,
          medications: medicationList,
          instructions: 'Follow up in 2 weeks if symptoms persist.'
        });
      }
    }

    console.log('Dummy data added successfully');
    return true;

  } catch (error) {
    console.error('Error adding dummy data:', error);
    return false;
  }
}
