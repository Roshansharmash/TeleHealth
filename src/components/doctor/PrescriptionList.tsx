import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

const PrescriptionsList = () => {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, load from localStorage
    const loadPrescriptions = () => {
      setIsLoading(true);
      setTimeout(() => {
        const savedPrescriptions = JSON.parse(localStorage.getItem('doctorPrescriptions') || '[]');
        setPrescriptions(savedPrescriptions);
        setIsLoading(false);
      }, 500);
    };
    
    loadPrescriptions();
  }, []);
  
  const filteredPrescriptions = prescriptions.filter(prescription => 
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Object.keys(prescription.medications).some(med => 
      med.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-telehealth-primary"></div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search prescriptions..."
              className="pl-10 bg-gray-700 border-gray-600 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {filteredPrescriptions.length > 0 ? (
            <div className="space-y-4">
              {filteredPrescriptions.map((prescription) => (
                <div 
                  key={prescription.id} 
                  className="border border-gray-700 rounded-lg p-4 hover:border-telehealth-primary transition-colors bg-gray-800"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-1">
                        <FileText className="h-4 w-4 mr-2 text-telehealth-primary" />
                        <h3 className="font-medium text-white">{prescription.patientName}</h3>
                      </div>
                      <p className="text-sm text-gray-400">
                        Created: {format(new Date(prescription.created_at), 'PPP')}
                      </p>
                      <div className="mt-2">
                        <p className="text-sm text-gray-300 mb-1">Medications:</p>
                        <div className="space-y-1">
                          {Object.keys(prescription.medications).map((med) => (
                            <div key={med} className="text-xs text-gray-400">
                              • {med} ({prescription.medications[med].dosage})
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-telehealth-primary text-telehealth-primary hover:bg-gray-700"
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">No prescriptions found</p>
              {searchTerm && (
                <p className="text-gray-500 mt-2">
                  Try adjusting your search term
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrescriptionsList;