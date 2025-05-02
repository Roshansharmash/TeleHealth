import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, Clock, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

// Dummy data for upcoming appointments
const TODAY = new Date();
const TOMORROW = new Date(TODAY);
TOMORROW.setDate(TODAY.getDate() + 1);

const UPCOMING_APPOINTMENTS = [
  {
    id: 'appt-1',
    patientName: 'Emma Wilson',
    patientId: 'patient-1',
    date: new Date(TODAY.setHours(14, 30)),
    status: 'confirmed',
    type: 'Follow-up',
  },
  {
    id: 'appt-2',
    patientName: 'James Taylor',
    patientId: 'patient-2',
    date: new Date(TODAY.setHours(16, 0)),
    status: 'confirmed',
    type: 'New Patient',
  },
  {
    id: 'appt-3',
    patientName: 'Sophia Martinez',
    patientId: 'patient-3',
    date: new Date(TOMORROW.setHours(10, 0)),
    status: 'confirmed',
    type: 'Follow-up',
  },
  {
    id: 'appt-4',
    patientName: 'Oliver Johnson',
    patientId: 'patient-4',
    date: new Date(TOMORROW.setHours(11, 30)),
    status: 'confirmed',
    type: 'Consultation',
  },
];

const UpcomingAppointmentsList = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {UPCOMING_APPOINTMENTS.map(appointment => {
            const isToday = new Date().toDateString() === appointment.date.toDateString();
            
            return (
              <div 
                key={appointment.id} 
                className="border border-gray-200 rounded-lg p-4 hover:border-telehealth-primary transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{appointment.patientName}</h3>
                  <Badge 
                    variant={appointment.type === 'New Patient' ? 'secondary' : 'default'}
                    className={appointment.type === 'New Patient' ? 'bg-blue-600' : 'bg-telehealth-primary'}
                  >
                    {appointment.type}
                  </Badge>
                </div>
                
                <div className="space-y-1 mb-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{isToday ? 'Today' : format(appointment.date, 'EEEE, MMM d')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{format(appointment.date, 'h:mm a')}</span>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  {isToday && (
                    <Button asChild size="sm" className="bg-telehealth-primary hover:bg-telehealth-secondary">
                      <Link to={`/consultation/${appointment.id}`}>
                        <Video className="h-4 w-4 mr-1" /> Start Consultation
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          asChild
        >
          <Link to="/appointments">View All Appointments</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingAppointmentsList;