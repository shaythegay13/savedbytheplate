import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus, MapPin, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  location_id: string | null;
  locations?: {
    name: string;
    address: string | null;
  };
}

interface Location {
  id: string;
  name: string;
  address: string | null;
}

const Calendar = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  
  // TEMPORARY: Development bypass - set to false when ready to enforce premium
  const DEV_BYPASS_SUBSCRIPTION = true;

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [locationId, setLocationId] = useState('');

  useEffect(() => {
    checkUser();
    checkSubscription();
  }, []);

  useEffect(() => {
    if (hasSubscription || DEV_BYPASS_SUBSCRIPTION) {
      fetchEvents();
      fetchLocations();
    }
  }, [hasSubscription]);

  const checkSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setCheckingSubscription(false);
        setHasSubscription(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        setHasSubscription(false);
      } else {
        setHasSubscription(data?.subscribed || false);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setHasSubscription(false);
    } finally {
      setCheckingSubscription(false);
    }
  };

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        locations (
          name,
          address
        )
      `)
      .order('event_date', { ascending: true });

    if (error) {
      toast({
        title: 'Error loading events',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setEvents(data || []);
    }
    setIsLoading(false);
  };

  const fetchLocations = async () => {
    const { data, error } = await supabase
      .from('locations')
      .select('id, name, address')
      .in('type', ['community_garden', 'urbanfarm'])
      .eq('status', 'active')
      .order('name');

    if (error) {
      console.error('Error loading locations:', error);
    } else {
      setLocations(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create events',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase.from('events').insert({
      title,
      description,
      event_date: eventDate,
      end_date: endDate || null,
      location_id: locationId || null,
      created_by: user.id,
    });

    if (error) {
      toast({
        title: 'Error creating event',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Event created!',
        description: 'Your event has been added to the calendar.',
      });
      setIsOpen(false);
      resetForm();
      fetchEvents();
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEventDate('');
    setEndDate('');
    setLocationId('');
  };

  if (checkingSubscription && !DEV_BYPASS_SUBSCRIPTION) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sbtp-cream to-white">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto flex justify-center items-center min-h-[50vh]">
            <p className="text-muted-foreground">Checking subscription status...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!hasSubscription && !DEV_BYPASS_SUBSCRIPTION) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sbtp-cream to-white">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <Card className="p-12 text-center">
              <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h1 className="text-3xl font-bold mb-4">Premium Feature</h1>
              <p className="text-muted-foreground mb-6">
                The Community Calendar is available exclusively to Premium members.
              </p>
              <Button onClick={() => navigate('/premium')} size="lg">
                Upgrade to Premium
              </Button>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sbtp-cream to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-sbtp-forest mb-2">Community Garden Events</h1>
              <p className="text-muted-foreground">
                Join gardeners in your community at upcoming events
              </p>
            </div>
            
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Garden Event</DialogTitle>
                  <DialogDescription>
                    Add a new event for the community garden calendar
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Event Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Spring Planting Day"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Join us for a day of planting and community building..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="event-date">Start Date & Time</Label>
                        <Input
                          id="event-date"
                          type="datetime-local"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="end-date">End Date & Time</Label>
                        <Input
                          id="end-date"
                          type="datetime-local"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Garden Location</Label>
                      <Select value={locationId} onValueChange={setLocationId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a garden" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">Create Event</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No events scheduled yet. Be the first to add one!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span>{event.title}</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {format(new Date(event.event_date), 'MMM dd, yyyy')}
                      </span>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {format(new Date(event.event_date), 'h:mm a')}
                      {event.end_date && ` - ${format(new Date(event.end_date), 'h:mm a')}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {event.description && (
                      <p className="text-sm">{event.description}</p>
                    )}
                    {event.locations && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.locations.name}</span>
                        {event.locations.address && (
                          <span className="text-xs">• {event.locations.address}</span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Calendar;
