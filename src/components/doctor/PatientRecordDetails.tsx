import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { format } from 'date-fns';

interface PatientRecordDetailsProps {
  record: any;
}

const PatientRecordDetails = ({ record }: PatientRecordDetailsProps) => {
  if (!record) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center text-gray-400">
          Select a record to view details
        </CardContent>
      </Card>
    );
  }
  
  // Render specific content based on record type
  const renderRecordContent = () => {
    switch (record.recordType) {
      case 'Lab Test':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400">Test Name</h4>
              <p className="text-white">{record.details.test_name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Result</h4>
              <p className="text-white">{record.details.result}</p>
            </div>
            {record.details.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-400">Notes</h4>
                <p className="text-white">{record.details.notes}</p>
              </div>
            )}
          </div>
        );
        
      case 'Vaccination':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400">Vaccine</h4>
              <p className="text-white">{record.details.vaccine_name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Dose</h4>
              <p className="text-white">{record.details.dose}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Administrator</h4>
              <p className="text-white">{record.details.administrator}</p>
            </div>
            {record.details.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-400">Notes</h4>
                <p className="text-white">{record.details.notes}</p>
              </div>
            )}
          </div>
        );
        
      case 'Prescription':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400">Medication</h4>
              <p className="text-white">{record.details.medication}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Dosage</h4>
              <p className="text-white">{record.details.dosage}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Duration</h4>
              <p className="text-white">{record.details.duration}</p>
            </div>
            {record.details.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-400">Notes</h4>
                <p className="text-white">{record.details.notes}</p>
              </div>
            )}
          </div>
        );
        
      case 'Clinical Note':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400">Complaint</h4>
              <p className="text-white">{record.details.complaint}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Diagnosis</h4>
              <p className="text-white">{record.details.diagnosis}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Treatment Plan</h4>
              <p className="text-white">{record.details.treatment_plan}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Follow-up</h4>
              <p className="text-white">{record.details.follow_up}</p>
            </div>
          </div>
        );
        
      case 'Vital Signs':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400">Blood Pressure</h4>
              <p className="text-white">{record.details.blood_pressure}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Heart Rate</h4>
              <p className="text-white">{record.details.heart_rate}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Temperature</h4>
              <p className="text-white">{record.details.temperature}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Respiratory Rate</h4>
              <p className="text-white">{record.details.respiratory_rate}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Oxygen Saturation</h4>
              <p className="text-white">{record.details.oxygen_saturation}</p>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-gray-400">No details available for this record type</div>
        );
    }
  };
  
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3 flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-white">{record.recordType}</CardTitle>
          <p className="text-sm text-gray-400 mt-1">
            Recorded on {format(record.date, 'PPP')}
          </p>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
        </div>
      </CardHeader>
      <CardContent className="border-t border-gray-700 pt-4 mt-2">
        {renderRecordContent()}
      </CardContent>
    </Card>
  );
};

export default PatientRecordDetails;