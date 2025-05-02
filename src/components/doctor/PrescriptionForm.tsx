import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, TrashIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PrescriptionFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  existingPrescription?: any; // For editing existing prescriptions
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

const PrescriptionForm = ({ onCancel, onSuccess, existingPrescription }: PrescriptionFormProps) => {
  const { toast } = useToast();
  const [patientId, setPatientId] = useState(existingPrescription?.patientId || '');
  const [patientName, setPatientName] = useState(existingPrescription?.patientName || '');
  const [medications, setMedications] = useState<Medication[]>(
    existingPrescription?.medications || [
      { id: '1', name: '', dosage: '', frequency: '', duration: '', instructions: '' }
    ]
  );
  const [additionalInstructions, setAdditionalInstructions] = useState(
    existingPrescription?.additionalInstructions || ''
  );
  
  const addMedication = () => {
    setMedications([
      ...medications,
      { 
        id: Date.now().toString(),
        name: '', 
        dosage: '', 
        frequency: '', 
        duration: '', 
        instructions: ''
      }
    ]);
  };
  
  const removeMedication = (id: string) => {
    if (medications.length > 1) {
      setMedications(medications.filter(med => med.id !== id));
    } else {
      toast({
        title: "Cannot remove",
        description: "At least one medication is required",
        variant: "destructive"
      });
    }
  };
  
  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setMedications(
      medications.map(med => 
        med.id === id ? { ...med, [field]: value } : med
      )
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!patientId.trim() || !patientName.trim()) {
      toast({
        title: "Missing patient information",
        description: "Please specify a patient",
        variant: "destructive"
      });
      return;
    }
    
    const hasMissingMedicationInfo = medications.some(med => 
      !med.name.trim() || !med.dosage.trim() || !med.frequency.trim()
    );
    
    if (hasMissingMedicationInfo) {
      toast({
        title: "Missing medication information",
        description: "Please provide name, dosage, and frequency for all medications",
        variant: "destructive"
      });
      return;
    }
    
    // Prepare prescription data
    const prescription = {
      id: existingPrescription?.id || Date.now().toString(),
      patientId,
      patientName,
      doctorId: 'doctor-1', // Would come from auth context in a real app
      doctorName: 'Dr. Smith', // Would come from auth context in a real app
      medications: medications.reduce((acc, med) => {
        acc[med.name] = {
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          instructions: med.instructions
        };
        return acc;
      }, {} as Record<string, any>),
      instructions: additionalInstructions,
      created_at: existingPrescription?.created_at || new Date().toISOString()
    };
    
    // In a real app, this would call an API to save the prescription
    // For now, simulate saving to localStorage
    const savedPrescriptions = JSON.parse(localStorage.getItem('doctorPrescriptions') || '[]');
    
    if (existingPrescription) {
      // Update existing
      const updatedPrescriptions = savedPrescriptions.map((p: any) => 
        p.id === prescription.id ? prescription : p
      );
      localStorage.setItem('doctorPrescriptions', JSON.stringify(updatedPrescriptions));
    } else {
      // Add new
      savedPrescriptions.push(prescription);
      localStorage.setItem('doctorPrescriptions', JSON.stringify(savedPrescriptions));
    }
    
    toast({
      title: "Success",
      description: existingPrescription ? "Prescription updated" : "Prescription created",
    });
    
    onSuccess();
  };
  
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">
          {existingPrescription ? 'Edit Prescription' : 'New Prescription'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientId" className="text-gray-300">Patient ID</Label>
              <Input 
                id="patientId"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter patient ID"
              />
            </div>
            <div>
              <Label htmlFor="patientName" className="text-gray-300">Patient Name</Label>
              <Input 
                id="patientName"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter patient name"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-gray-300 text-lg">Medications</Label>
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                onClick={addMedication}
                className="text-telehealth-primary border-telehealth-primary hover:bg-gray-700"
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add Medication
              </Button>
            </div>
            
            {medications.map((medication, index) => (
              <div 
                key={medication.id} 
                className="p-4 border border-gray-700 rounded-lg mb-4 bg-gray-800"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-white">Medication {index + 1}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMedication(medication.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-gray-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <Label htmlFor={`med-name-${medication.id}`} className="text-gray-300">Name</Label>
                    <Input
                      id={`med-name-${medication.id}`}
                      value={medication.name}
                      onChange={(e) => updateMedication(medication.id, 'name', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Medication name"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`med-dosage-${medication.id}`} className="text-gray-300">Dosage</Label>
                    <Input
                      id={`med-dosage-${medication.id}`}
                      value={medication.dosage}
                      onChange={(e) => updateMedication(medication.id, 'dosage', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="e.g., 50mg"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <Label htmlFor={`med-frequency-${medication.id}`} className="text-gray-300">Frequency</Label>
                    <Input
                      id={`med-frequency-${medication.id}`}
                      value={medication.frequency}
                      onChange={(e) => updateMedication(medication.id, 'frequency', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="e.g., Twice daily"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`med-duration-${medication.id}`} className="text-gray-300">Duration</Label>
                    <Input
                      id={`med-duration-${medication.id}`}
                      value={medication.duration}
                      onChange={(e) => updateMedication(medication.id, 'duration', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="e.g., 7 days"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor={`med-instructions-${medication.id}`} className="text-gray-300">Special Instructions</Label>
                  <Textarea
                    id={`med-instructions-${medication.id}`}
                    value={medication.instructions}
                    onChange={(e) => updateMedication(medication.id, 'instructions', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="e.g., Take with food"
                    rows={2}
                  />
                </div>
              </div>
            ))}
            
            <div className="mt-4">
              <Label htmlFor="additionalInstructions" className="text-gray-300">Additional Instructions</Label>
              <Textarea
                id="additionalInstructions"
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Any additional instructions or notes for the patient"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-telehealth-primary hover:bg-telehealth-secondary text-white"
          >
            {existingPrescription ? 'Update Prescription' : 'Create Prescription'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PrescriptionForm;