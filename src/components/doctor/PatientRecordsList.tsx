import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft, Calendar } from 'lucide-react';
import { format } from 'date-fns';

// Dummy data for patient records
const DUMMY_RECORDS = [
  {
    id: 'rec-1',
    recordType: 'Lab Test',
    date: new Date(2023, 3, 15),
    details: {
      test_name: 'Complete Blood Count',
      result: 'Normal ranges',
      notes: 'No abnormalities detected'
    }
  },
  {
    id: 'rec-2',
    recordType: 'Vaccination',
    date: new Date(2023, 2, 10),
    details: {
      vaccine_name: 'Influenza (Flu)',
      dose: '0.5ml',
      administrator: 'Nurse Johnson',
      notes: 'Patient tolerated well, no adverse reactions'
    }
  },
  {
    id: 'rec-3',
    recordType: 'Prescription',
    date: new Date(2023, 1, 28),
    details: {
      medication: 'Amoxicillin 500mg',
      dosage: '1 tablet three times daily',
      duration: '10 days',
      notes: 'For bacterial infection'
    }
  },
  {
    id: 'rec-4',
    recordType: 'Clinical Note',
    date: new Date(2023, 1, 15),
    details: {
      complaint: 'Persistent cough, fever',
      diagnosis: 'Upper respiratory infection',
      treatment_plan: 'Prescribed antibiotics, rest, increased fluid intake',
      follow_up: '2 weeks'
    }
  },
  {
    id: 'rec-5',
    recordType: 'Vital Signs',
    date: new Date(2023, 0, 20),
    details: {
      blood_pressure: '120/80 mmHg',
      heart_rate: '72 bpm',
      temperature: '98.6°F',
      respiratory_rate: '16 breaths/min',
      oxygen_saturation: '99%'
    }
  }
];

interface PatientRecordsListProps {
  patientId: string;
  onSelectRecord: (record: any) => void;
  onBack: () => void;
}

const PatientRecordsList = ({ patientId, onSelectRecord, onBack }: PatientRecordsListProps) => {
  // In a real app, you would fetch records based on patientId
  
  return (
    <Card className="bg-gray-800 border-gray-700 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="mr-2 text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h3 className="text-white font-medium">Patient Records</h3>
            <p className="text-sm text-gray-400">ID: {patientId}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {DUMMY_RECORDS.length > 0 ? (
          <div className="space-y-3">
            {DUMMY_RECORDS.map(record => (
              <div 
                key={record.id}
                className="border border-gray-700 rounded-md p-3 cursor-pointer hover:border-telehealth-primary"
                onClick={() => onSelectRecord(record)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-telehealth-primary" />
                    <span className="text-white font-medium">{record.recordType}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(record.date, 'MMM d, yyyy')}
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {record.recordType === 'Lab Test' && (
                    <span>{record.details.test_name}</span>
                  )}
                  {record.recordType === 'Vaccination' && (
                    <span>{record.details.vaccine_name}</span>
                  )}
                  {record.recordType === 'Prescription' && (
                    <span>{record.details.medication}</span>
                  )}
                  {record.recordType === 'Clinical Note' && (
                    <span>{record.details.diagnosis}</span>
                  )}
                  {record.recordType === 'Vital Signs' && (
                    <span>BP: {record.details.blood_pressure}, HR: {record.details.heart_rate}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">No records found for this patient</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientRecordsList;
