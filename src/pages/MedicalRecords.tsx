import React, { useState, useEffect } from 'react';
import { FileText, FilePlus, Search, Calendar, Download, Share2, Filter } from 'lucide-react';
import { format } from 'date-fns';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import AddMedicalRecordForm from '@/components/medical-records/AddMedicalRecordForm';

// Dummy data
const INITIAL_RECORDS = [
  {
    id: '1',
    record_type: 'Lab Test',
    record_date: '2025-04-10T00:00:00.000Z',
    details: {
      test_name: 'Complete Blood Count',
      result: 'Normal',
      reference_range: '4.5-11.0 x10^9/L'
    },
    provider: 'MedLab Solutions',
    notes: 'Regular annual checkup'
  },
  {
    id: '2',
    record_type: 'Vaccination',
    record_date: '2025-03-22T00:00:00.000Z',
    details: {
      vaccine_name: 'Influenza Vaccine',
      dose: '1st dose',
      administered_by: 'Dr. Sarah Johnson'
    },
    provider: 'City Health Clinic',
    notes: 'Annual flu shot'
  },
  {
    id: '3',
    record_type: 'Prescription',
    record_date: '2025-04-05T00:00:00.000Z',
    details: {
      medication: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Twice daily',
      prescribed_by: 'Dr. Michael Lee'
    },
    provider: 'Central Medical Center',
    notes: 'For sinus infection'
  },
  {
    id: '4',
    record_type: 'Lab Test',
    record_date: '2025-02-15T00:00:00.000Z',
    details: {
      test_name: 'Lipid Panel',
      result: 'Cholesterol: 185 mg/dL',
      reference_range: '<200 mg/dL'
    },
    provider: 'HealthFirst Labs',
    notes: 'Part of cardiac risk assessment'
  },
  {
    id: '5',
    record_type: 'Vaccination',
    record_date: '2024-11-10T00:00:00.000Z',
    details: {
      vaccine_name: 'COVID-19 Booster',
      dose: 'Booster',
      administered_by: 'Dr. Robert Chen'
    },
    provider: 'Community Vaccination Center',
    notes: 'Annual COVID booster'
  }
];

const MedicalRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [records, setRecords] = useState([]);
  const [activeView, setActiveView] = useState('grid');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading from storage
    setTimeout(() => {
      const savedRecords = localStorage.getItem('medicalRecords');
      if (savedRecords) {
        setRecords(JSON.parse(savedRecords));
      } else {
        setRecords(INITIAL_RECORDS);
        localStorage.setItem('medicalRecords', JSON.stringify(INITIAL_RECORDS));
      }
      setIsLoading(false);
    }, 800);
  }, []);
  
  const handleAddRecord = (newRecord) => {
    const updatedRecords = [newRecord, ...records];
    setRecords(updatedRecords);
    localStorage.setItem('medicalRecords', JSON.stringify(updatedRecords));
  };
  
  const filteredRecords = records?.filter(record => 
    record.record_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.details?.test_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.details?.medication || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.details?.vaccine_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const recordTypeCount = records?.reduce((acc, record) => {
    acc[record.record_type] = (acc[record.record_type] || 0) + 1;
    return acc;
  }, {});

  const recentRecords = [...records].sort((a, b) => 
    new Date(b.record_date) - new Date(a.record_date)
  ).slice(0, 3);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Hero section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg mb-8 p-6 md:p-8 text-black">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Medical Records</h1>
                <p className="text-blue-100 mb-6">Manage and access your health information in one place</p>
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => setShowAddRecordModal(true)}
                    className="bg-white text-blue-700 hover:bg-blue-50"
                  >
                    <FilePlus className="mr-2 h-4 w-4" /> Add New Record
                  </Button>
                  <Button variant="outline" className="bg-transparent border-white hover:bg-white/10">
                    <Download className="mr-2 h-4 w-4" /> Export Records
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="flex space-x-3 mt-4 md:mt-0">
                  {recentRecords.slice(0, 3).map((record, index) => (
                    <div key={index} className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                      {getRecordIcon(record.record_type)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-black">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden shadow-md text-black">
                <CardHeader className="bg-white border-b pb-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <CardTitle className="text-xl font-bold mb-2 sm:mb-0 text-black">Your Records</CardTitle>
                    <div className="flex space-x-2">
                      <Button 
                        variant={activeView === 'grid' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setActiveView('grid')}
                        className="h-8 w-8 p-0 bg-white/10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
                      </Button>
                      <Button 
                        variant={activeView === 'list' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setActiveView('list')}
                        className="h-8 w-8 p-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
                      </Button>
                      <Button variant="outline" size="sm" className="h-8">
                        <Filter className="h-4 w-4 mr-2 " /> Filter
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Search records..."
                        className="pl-10 bg-gray-50 border-gray-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs defaultValue="all" className="px-4 pb-1">
                    <TabsList className="mt-4 bg-gray-100">
                      <TabsTrigger value="all" className="data-[state=active]:bg-white">All Records</TabsTrigger>
                      <TabsTrigger value="lab" className="data-[state=active]:bg-white">Lab Results</TabsTrigger>
                      <TabsTrigger value="vaccination" className="data-[state=active]:bg-white">Vaccinations</TabsTrigger>
                      <TabsTrigger value="prescription" className="data-[state=active]:bg-white">Prescriptions</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="mt-4 mb-2">
                      {renderRecordsList(filteredRecords, isLoading, activeView, setSelectedRecord)}
                    </TabsContent>
                    
                    <TabsContent value="lab" className="mt-4 mb-2">
                      {renderRecordsList(filteredRecords?.filter(r => r.record_type === 'Lab Test'), isLoading, activeView, setSelectedRecord)}
                    </TabsContent>
                    
                    <TabsContent value="vaccination" className="mt-4 mb-2">
                      {renderRecordsList(filteredRecords?.filter(r => r.record_type === 'Vaccination'), isLoading, activeView, setSelectedRecord)}
                    </TabsContent>
                    
                    <TabsContent value="prescription" className="mt-4 mb-2">
                      {renderRecordsList(filteredRecords?.filter(r => r.record_type === 'Prescription'), isLoading, activeView, setSelectedRecord)}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle>Record Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recordTypeCount && Object.entries(recordTypeCount).length > 0 ? (
                      <>
                        {Object.entries(recordTypeCount).map(([type, count]) => (
                          <div key={type} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              {getRecordIcon(type)}
                              <span className="text-gray-700 ml-3 font-medium">{type}</span>
                            </div>
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                              {count}
                            </Badge>
                          </div>
                        ))}
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-500" />
                            <span className="text-gray-700 ml-3 font-medium">Total</span>
                          </div>
                          <Badge className="bg-blue-600 hover:bg-blue-700">
                            {records.length}
                          </Badge>
                        </div>
                      </>
                    ) : (
                      <p className="text-center text-gray-500 py-4">No records available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {selectedRecord && (
                <Card className="shadow-md animate-fade-in">
                  <CardHeader className="border-b pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle>Record Details</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedRecord(null)}
                        className="h-8 w-8 p-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="mb-4 flex items-center">
                      <Badge className={`${getBadgeColor(selectedRecord.record_type)}`}>
                        {selectedRecord.record_type}
                      </Badge>
                      <span className="text-sm text-gray-500 ml-2">
                        {format(new Date(selectedRecord.record_date), 'MMMM d, yyyy')}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {selectedRecord.record_type === 'Lab Test' && (
                        <>
                          <DetailItem label="Test Name" value={selectedRecord.details.test_name} />
                          <DetailItem label="Result" value={selectedRecord.details.result} />
                          <DetailItem label="Reference Range" value={selectedRecord.details.reference_range} />
                          <DetailItem label="Provider" value={selectedRecord.provider} />
                        </>
                      )}
                      
                      {selectedRecord.record_type === 'Vaccination' && (
                        <>
                          <DetailItem label="Vaccine" value={selectedRecord.details.vaccine_name} />
                          <DetailItem label="Dose" value={selectedRecord.details.dose} />
                          <DetailItem label="Administered By" value={selectedRecord.details.administered_by} />
                          <DetailItem label="Provider" value={selectedRecord.provider} />
                        </>
                      )}
                      
                      {selectedRecord.record_type === 'Prescription' && (
                        <>
                          <DetailItem label="Medication" value={selectedRecord.details.medication} />
                          <DetailItem label="Dosage" value={selectedRecord.details.dosage} />
                          <DetailItem label="Frequency" value={selectedRecord.details.frequency} />
                          <DetailItem label="Prescribed By" value={selectedRecord.details.prescribed_by} />
                          <DetailItem label="Provider" value={selectedRecord.provider} />
                        </>
                      )}
                      
                      {selectedRecord.notes && (
                        <div className="pt-2 mt-2 border-t">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Notes</h4>
                          <p className="text-gray-700">{selectedRecord.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 mt-6">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Share2 className="mr-2 h-4 w-4" /> Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1 text-black">Upcoming Appointment</h3>
                  <p className="text-gray-600 mb-4">You have a scheduled checkup on May 5th, 2025</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">View Appointment</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      {showAddRecordModal && (
        <AddMedicalRecordForm 
          onClose={() => setShowAddRecordModal(false)} 
          onSuccess={(newRecord) => {
            handleAddRecord(newRecord);
            setShowAddRecordModal(false);
          }}
        />
      )}
      
      <Footer />
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div>
    <h4 className="text-sm font-medium text-gray-500 mb-1">{label}</h4>
    <p className="text-gray-700">{value}</p>
  </div>
);

const renderRecordsList = (records, isLoading, viewType, setSelectedRecord) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!records || records.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-700 mb-1">No Records Found</h3>
        <p className="text-gray-500 max-w-md mx-auto">You don't have any medical records matching your search criteria.</p>
      </div>
    );
  }
  
  if (viewType === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
        {records.map((record) => (
          <div 
            key={record.id}
            className="border rounded-xl p-5 hover:border-blue-400 transition-all duration-200 bg-white shadow-sm hover:shadow cursor-pointer"
            onClick={() => setSelectedRecord(record)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`mt-1 p-2 rounded-lg ${getIconBgColor(record.record_type)}`}>
                  {getRecordIcon(record.record_type)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {record.record_type === 'Lab Test' ? record.details.test_name : 
                     record.record_type === 'Vaccination' ? record.details.vaccine_name :
                     record.record_type === 'Prescription' ? record.details.medication : record.record_type}
                  </h3>
                  <Badge className={`mt-1 ${getBadgeColor(record.record_type)}`}>
                    {getRecordTypeLabel(record.record_type)}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{format(new Date(record.record_date), 'MMMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t text-sm">
              {record.record_type === 'Lab Test' && (
                <div>
                  <span className="font-medium">Result:</span> {record.details.result}
                </div>
              )}
              {record.record_type === 'Vaccination' && (
                <div>
                  <span className="font-medium">Dose:</span> {record.details.dose}
                </div>
              )}
              {record.record_type === 'Prescription' && (
                <div>
                  <span className="font-medium">Dosage:</span> {record.details.dosage}, {record.details.frequency}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div className="divide-y pb-4">
        {records.map((record) => (
          <div 
            key={record.id}
            className="py-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer px-2"
            onClick={() => setSelectedRecord(record)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`mr-4 p-2 rounded-lg ${getIconBgColor(record.record_type)}`}>
                  {getRecordIcon(record.record_type)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {record.record_type === 'Lab Test' ? record.details.test_name : 
                     record.record_type === 'Vaccination' ? record.details.vaccine_name :
                     record.record_type === 'Prescription' ? record.details.medication : record.record_type}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Badge className={`mr-2 ${getBadgeColor(record.record_type)}`}>
                      {getRecordTypeLabel(record.record_type)}
                    </Badge>
                    <span>{format(new Date(record.record_date), 'MMMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }
};

const getRecordTypeLabel = (type) => {
  switch (type) {
    case 'Lab Test':
      return 'Lab';
    case 'Vaccination':
      return 'Vaccine';
    case 'Prescription':
      return 'Med';
    default:
      return 'Record';
  }
};

const getBadgeColor = (type) => {
  switch (type) {
    case 'Lab Test':
      return 'bg-purple-100 text-purple-700 hover:bg-purple-200';
    case 'Vaccination':
      return 'bg-green-100 text-green-700 hover:bg-green-200';
    case 'Prescription':
      return 'bg-orange-100 text-orange-700 hover:bg-orange-200';
    default:
      return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
  }
};

const getIconBgColor = (type) => {
  switch (type) {
    case 'Lab Test':
      return 'bg-purple-100 text-purple-500';
    case 'Vaccination':
      return 'bg-green-100 text-green-500';
    case 'Prescription':
      return 'bg-orange-100 text-orange-500';
    default:
      return 'bg-blue-100 text-blue-500';
  }
};

const getRecordIcon = (type) => {
  switch (type) {
    case 'Lab Test':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-flask-conical"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" /><path d="M8.5 2h7" /><path d="M7 16h10" /></svg>
      );
    case 'Vaccination':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-syringe"><path d="m18 2 4 4" /><path d="m17 7 3-3" /><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" /><path d="m9 11 4 4" /><path d="m5 19-3 3" /><path d="m14 4 6 6" /></svg>
      );
    case 'Prescription':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-pill"><path d="m10.5 20.5-7-7a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7Z" /><path d="m9 7.8 7.3 7.3" /></svg>
      );
    default:
      return <FileText className="h-5 w-5" />;
  }
};

export default MedicalRecords;