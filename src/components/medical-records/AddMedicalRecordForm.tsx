import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar as CalendarIcon, X, Check, Clipboard, Upload, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface AddMedicalRecordFormProps {
  onClose: () => void;
  onSuccess: (newRecord: any) => void;
}

type RecordType = 'Lab Test' | 'Vaccination' | 'Prescription' | 'Surgery' | 'Allergy' | 'Other';

interface FormData {
  record_type: RecordType;
  record_date: Date;
  details: any;
  notes: string;
  provider: string;
}

const PROVIDERS = [
  'City Health Clinic',
  'MedLab Solutions',
  'Central Medical Center',
  'HealthFirst Labs',
  'Community Vaccination Center',
  'Regional Hospital',
  'Primary Care Associates',
  'Wellness Pharmacy',
];

const AddMedicalRecordForm = ({ onClose, onSuccess }: AddMedicalRecordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  const form = useForm<FormData>({
    defaultValues: {
      record_type: 'Lab Test',
      record_date: new Date(),
      details: {},
      notes: '',
      provider: PROVIDERS[0],
    },
  });
  
  const watchRecordType = form.watch('record_type');
  
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      // Format the details based on record type
      let formattedDetails;
      switch (data.record_type) {
        case 'Lab Test':
          formattedDetails = {
            test_name: form.getValues('details.test_name'),
            result: form.getValues('details.result'),
            reference_range: form.getValues('details.reference_range'),
          };
          break;
        case 'Vaccination':
          formattedDetails = {
            vaccine_name: form.getValues('details.vaccine_name'),
            dose: form.getValues('details.dose'),
            administered_by: form.getValues('details.administered_by'),
          };
          break;
        case 'Prescription':
          formattedDetails = {
            medication: form.getValues('details.medication'),
            dosage: form.getValues('details.dosage'),
            frequency: form.getValues('details.frequency'),
            prescribed_by: form.getValues('details.prescribed_by'),
          };
          break;
        default:
          formattedDetails = {};
      }
      
      // Create new record with generated ID
      const newRecord = {
        id: Math.random().toString(36).substring(2, 10),
        patient_id: 'current-user',
        record_type: data.record_type,
        record_date: data.record_date.toISOString(),
        details: formattedDetails,
        provider: data.provider,
        notes: data.notes,
      };
      
      // Simulate delay for API call
      setTimeout(() => {
        setIsLoading(false);
        onSuccess(newRecord);
      }, 800);
      
    } catch (error) {
      console.error('Error adding medical record:', error);
      setIsLoading(false);
    }
  };
  
  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'Lab Test':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-flask-conical"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" /><path d="M8.5 2h7" /><path d="M7 16h10" /></svg>
        );
      case 'Vaccination':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-syringe"><path d="m18 2 4 4" /><path d="m17 7 3-3" /><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" /><path d="m9 11 4 4" /><path d="m5 19-3 3" /><path d="m14 4 6 6" /></svg>
        );
      case 'Prescription':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-pill"><path d="m10.5 20.5-7-7a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7Z" /><path d="m9 7.8 7.3 7.3" /></svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
        );
    }
  };
  
  const getIconBgColor = (type: string) => {
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
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in text-black overflow-hidden scrollbar-hidden scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-700 text-black">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add Medical Record</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-black/10 rounded-full text-black">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
              <div className="p-4 border-b bg-gray-50">
                <div className="flex space-x-3">
                  {['Lab Test', 'Vaccination', 'Prescription', 'Other'].map((type) => (
                    <div 
                      key={type}
                      className={`cursor-pointer p-3 rounded-lg flex flex-col items-center ${
                        watchRecordType === type 
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : 'bg-white border border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => form.setValue('record_type', type as RecordType)}
                    >
                      <div className={`p-2 rounded-lg ${getIconBgColor(type)}`}>
                        {getRecordIcon(type)}
                      </div>
                      <span className={`text-sm mt-2 font-medium ${
                        watchRecordType === type ? 'text-blue-600' : 'text-gray-700'
                      }`}>
                        {type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="overflow-y-auto flex-grow p-6">
                <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6 w-full grid grid-cols-2">
                    <TabsTrigger value="details" className="text-center">Record Details</TabsTrigger>
                    <TabsTrigger value="additional" className="text-center">Additional Info</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="record_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Record Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Date when this medical record was created
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Dynamic fields based on record type */}
                    {watchRecordType === 'Lab Test' && (
                      <div className="space-y-5 animate-fade-in">
                        <FormField
                          control={form.control}
                          name="details.test_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Test Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., Complete Blood Count" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="details.result"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Result</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., 140 mg/dL" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="details.reference_range"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reference Range</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., 70-100 mg/dL" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    
                    {watchRecordType === 'Vaccination' && (
                      <div className="space-y-5 animate-fade-in">
                        <FormField
                          control={form.control}
                          name="details.vaccine_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vaccine Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., Influenza Vaccine" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="details.dose"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dose</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select dose" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1st dose">1st dose</SelectItem>
                                  <SelectItem value="2nd dose">2nd dose</SelectItem>
                                  <SelectItem value="3rd dose">3rd dose</SelectItem>
                                  <SelectItem value="Booster">Booster</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="details.administered_by"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Administered By</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., Dr. Sarah Johnson" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    
                    {watchRecordType === 'Prescription' && (
                      <div className="space-y-5 animate-fade-in">
                        <FormField
                          control={form.control}
                          name="details.medication"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Medication</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., Amoxicillin" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="details.dosage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dosage</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., 500mg" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="details.frequency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Frequency</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Once daily">Once daily</SelectItem>
                                  <SelectItem value="Twice daily">Twice daily</SelectItem>
                                  <SelectItem value="Three times daily">Three times daily</SelectItem>
                                  <SelectItem value="Four times daily">Four times daily</SelectItem>
                                  <SelectItem value="As needed">As needed (PRN)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="details.prescribed_by"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prescribed By</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., Dr. Michael Lee" className="bg-white" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    
                    {watchRecordType === 'Other' && (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4 flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                        <div className="text-sm text-yellow-700">
                          <p className="font-medium">Please specify details in the notes section</p>
                          <p>Add any relevant information about this medical record in the additional info tab.</p>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setActiveTab('additional')}
                    >
                      Next: Additional Info
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="additional" className="space-y-6">
                    <FormField
                      control={form.control}
                      name="provider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Healthcare Provider</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select provider" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PROVIDERS.map(provider => (
                                <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The healthcare provider or facility associated with this record
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Additional notes or information about this record"
                              className="min-h-[120px] bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Include any additional information that may be relevant
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex items-center justify-center border border-dashed border-gray-300 rounded-lg bg-gray-50 p-6">
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700">Attach files</p>
                        <p className="text-xs text-gray-500 mt-1">Upload images, PDFs or documents</p>
                        <Button variant="outline" size="sm" className="mt-3">
                          <Clipboard className="h-4 w-4 mr-2" /> Select Files
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-x-2 flex">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-1/2"
                        onClick={() => setActiveTab('details')}
                      >
                        Back to Details
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-1/2 bg-blue-600 hover:bg-blue-700 text-black"
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                            Saving...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Check className="mr-2 h-4 w-4" /> Save Record
                          </span>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddMedicalRecordForm;