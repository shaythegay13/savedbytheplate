import { useState, useEffect } from 'react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { Calendar as CalendarIcon, Plus, MapPin, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { cn } from '@/lib/utils';

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
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  
  // Calendar view state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    checkUser();
    checkSubscription();
  }, []);

  useEffect(() => {
    if (hasSubscription || DEV_BYPASS_SUBSCRIPTION) {
      fetchEvents();
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

    // Create a location entry with the typed name and address
    let locationId = null;
    if (locationName) {
      const { data: locationData, error: locationError } = await supabase
        .from('locations')
        .insert({
          name: locationName,
          address: locationAddress || null,
          type: 'community_garden',
          status: 'active',
          // Default NYC coordinates - users can update via map later
          latitude: 40.7128,
          longitude: -74.0060,
        })
        .select()
        .single();

      if (locationError) {
        console.error('Error creating location:', locationError);
      } else {
        locationId = locationData?.id;
      }
    }

    const { error } = await supabase.from('events').insert({
      title,
      description,
      event_date: eventDate,
      end_date: endDate || null,
      location_id: locationId,
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
    setLocationName('');
    setLocationAddress('');
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.event_date), date));
  };

  const previousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    
    // Get the day of week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = start.getDay();
    
    // Add empty cells for days before the month starts
    const emptyDays = Array(firstDayOfWeek).fill(null);
    
    return [...emptyDays, ...days];
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
                      <Label htmlFor="location-name">Garden Name</Label>
                      <Input
                        id="location-name"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        placeholder="East Village Community Garden"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location-address">Garden Address (Optional)</Label>
                      <Input
                        id="location-address"
                        value={locationAddress}
                        onChange={(e) => setLocationAddress(e.target.value)}
                        placeholder="123 Main St, Brooklyn, NY"
                      />
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
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <Button variant="outline" size="icon" onClick={previousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-2xl font-bold">
                  {format(currentMonth, 'MMMM yyyy')}
                </CardTitle>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Day headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days */}
                  {getDaysInMonth().map((day, index) => {
                    if (!day) {
                      return <div key={`empty-${index}`} className="aspect-square" />;
                    }
                    
                    const dayEvents = getEventsForDate(day);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isTodayDate = isToday(day);
                    
                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={cn(
                          "aspect-square p-2 rounded-lg border transition-colors relative",
                          isCurrentMonth ? "bg-background" : "bg-muted/50 text-muted-foreground",
                          isSelected && "border-primary bg-primary/10",
                          isTodayDate && "border-primary font-bold",
                          !isSelected && !isTodayDate && "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="text-sm">{format(day, 'd')}</div>
                        {dayEvents.length > 0 && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                            {dayEvents.slice(0, 3).map((_, i) => (
                              <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {/* Selected date events */}
                {selectedDate && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold mb-4">
                      Events on {format(selectedDate, 'MMMM d, yyyy')}
                    </h3>
                    {getEventsForDate(selectedDate).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No events scheduled for this day.</p>
                    ) : (
                      <div className="space-y-3">
                        {getEventsForDate(selectedDate).map((event) => (
                          <Card key={event.id}>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">{event.title}</CardTitle>
                              <CardDescription className="flex items-center gap-2">
                                <CalendarIcon className="h-3 w-3" />
                                {format(new Date(event.event_date), 'h:mm a')}
                                {event.end_date && ` - ${format(new Date(event.end_date), 'h:mm a')}`}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 pb-3">
                              {event.description && (
                                <p className="text-sm">{event.description}</p>
                              )}
                              {event.locations && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
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
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Calendar;
