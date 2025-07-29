import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Cloud, CloudRain, CloudSnow, Sun, AlertTriangle, Phone, Mail, MessageSquare, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WeatherNotificationSettings {
  enabled: boolean;
  phoneNumber: string;
  email: string;
  preferences: {
    frostWarnings: boolean;
    heatWaves: boolean;
    heavyRain: boolean;
    drought: boolean;
    strongWinds: boolean;
    hail: boolean;
  };
  leadTime: '1hour' | '6hours' | '12hours' | '24hours';
  methods: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

interface WeatherAlert {
  id: string;
  type: string;
  severity: 'Low' | 'Medium' | 'High';
  event: string;
  headline: string;
  description: string;
  gardenImpact: string;
  recommendations: string[];
  timeframe: string;
  icon: React.ReactNode;
}

interface WeatherBasedNotificationsProps {
  latitude?: number;
  longitude?: number;
}

const WeatherBasedNotifications: React.FC<WeatherBasedNotificationsProps> = ({ 
  latitude = 40.7128, 
  longitude = -74.0060 
}) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<WeatherNotificationSettings>({
    enabled: false,
    phoneNumber: '',
    email: '',
    preferences: {
      frostWarnings: true,
      heatWaves: true,
      heavyRain: true,
      drought: false,
      strongWinds: false,
      hail: true
    },
    leadTime: '12hours',
    methods: {
      email: true,
      sms: false,
      push: true
    }
  });

  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (latitude && longitude) {
      fetchWeatherAlerts();
    }
  }, [latitude, longitude]);

  const fetchWeatherAlerts = async () => {
    setLoading(true);
    try {
      const response = await supabase.functions.invoke('get-weather-alerts', {
        body: {
          latitude,
          longitude,
          user_id: 'demo-user' // In real app, get from auth context
        }
      });

      if (response.error) {
        console.error('Error fetching weather alerts:', response.error);
      } else {
        const processedAlerts = response.data?.alerts?.map((alert: any) => ({
          id: alert.id,
          type: alert.type,
          severity: alert.severity,
          event: alert.event,
          headline: alert.headline,
          description: alert.description,
          gardenImpact: alert.gardenImpact,
          recommendations: alert.recommendations,
          timeframe: alert.onset ? new Date(alert.onset).toLocaleDateString() : 'Soon',
          icon: getAlertIcon(alert.type)
        })) || [];
        
        setAlerts(processedAlerts);
      }
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertIcon = (type: string) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('frost') || typeLower.includes('freeze')) {
      return <CloudSnow className="w-4 h-4" />;
    } else if (typeLower.includes('rain') || typeLower.includes('flood')) {
      return <CloudRain className="w-4 h-4" />;
    } else if (typeLower.includes('heat')) {
      return <Sun className="w-4 h-4" />;
    } else if (typeLower.includes('wind')) {
      return <Cloud className="w-4 h-4" />;
    }
    return <AlertTriangle className="w-4 h-4" />;
  };

  const handleSettingChange = (key: keyof WeatherNotificationSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePreferenceChange = (key: keyof WeatherNotificationSettings['preferences'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handleMethodChange = (key: keyof WeatherNotificationSettings['methods'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      methods: {
        ...prev.methods,
        [key]: value
      }
    }));
  };

  const saveSettings = () => {
    // In real app, save to database and set up weather API webhooks
    toast({
      title: "Weather Notifications Configured",
      description: "You'll receive alerts based on your preferences and local weather conditions.",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Weather Alerts */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-orange-800">
            <div className="flex items-center">
              <AlertTriangle className="mr-2" />
              Active Weather Alerts for Your Garden
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchWeatherAlerts}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.length === 0 ? (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                {loading ? 'Loading weather alerts...' : 'No active weather alerts for your area. Your garden is safe!'}
              </AlertDescription>
            </Alert>
          ) : (
            alerts.map(alert => (
              <Alert key={alert.id} className="border-orange-200">
                <div className="flex items-start gap-3">
                  {alert.icon}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-orange-900">{alert.headline}</h4>
                      <Badge variant={getSeverityColor(alert.severity) as any}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <AlertDescription className="text-orange-800 mb-2">
                      <strong>Garden Impact:</strong> {alert.gardenImpact}
                    </AlertDescription>
                    {alert.recommendations && alert.recommendations.length > 0 && (
                      <AlertDescription className="text-orange-800">
                        <strong>Recommendations:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {alert.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm">{rec}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    )}
                  </div>
                </div>
              </Alert>
            ))
          )}
        </CardContent>
      </Card>

      {/* Weather Notification Settings */}
      <Card className="border-sbtp-green-200">
        <CardHeader>
          <CardTitle className="flex items-center text-sbtp-green-800">
            <Cloud className="mr-2" />
            Smart Weather Notifications
          </CardTitle>
          <p className="text-sm text-sbtp-brown-600">
            Get personalized alerts based on weather conditions that affect your specific plants and garden setup.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weather-enabled" className="text-sbtp-brown-700 font-medium">
                Enable Weather-Based Notifications
              </Label>
              <p className="text-sm text-sbtp-brown-500 mt-1">
                Receive automatic alerts when weather conditions might affect your garden
              </p>
            </div>
            <Switch
              id="weather-enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
            />
          </div>

          {settings.enabled && (
            <>
              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-sbtp-green-700">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-sm text-sbtp-brown-600">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleSettingChange('email', e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm text-sbtp-brown-600">Phone Number (for SMS)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={settings.phoneNumber}
                      onChange={(e) => handleSettingChange('phoneNumber', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Notification Methods */}
              <div className="space-y-4">
                <h4 className="font-medium text-sbtp-green-700">Notification Methods</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-sbtp-green-600" />
                    <Label htmlFor="method-email" className="text-sbtp-brown-700">Email</Label>
                    <Switch
                      id="method-email"
                      checked={settings.methods.email}
                      onCheckedChange={(checked) => handleMethodChange('email', checked)}
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-sbtp-green-600" />
                    <Label htmlFor="method-sms" className="text-sbtp-brown-700">SMS Text</Label>
                    <Switch
                      id="method-sms"
                      checked={settings.methods.sms}
                      onCheckedChange={(checked) => handleMethodChange('sms', checked)}
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-4 h-4 text-sbtp-green-600" />
                    <Label htmlFor="method-push" className="text-sbtp-brown-700">Push Notifications</Label>
                    <Switch
                      id="method-push"
                      checked={settings.methods.push}
                      onCheckedChange={(checked) => handleMethodChange('push', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Alert Preferences */}
              <div className="space-y-4">
                <h4 className="font-medium text-sbtp-green-700">Weather Alert Preferences</h4>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CloudSnow className="w-4 h-4 text-blue-600" />
                      <div>
                        <Label htmlFor="frost-warnings" className="text-sbtp-brown-700">Frost Warnings</Label>
                        <p className="text-xs text-sbtp-brown-500">Critical for tender plants</p>
                      </div>
                    </div>
                    <Switch
                      id="frost-warnings"
                      checked={settings.preferences.frostWarnings}
                      onCheckedChange={(checked) => handlePreferenceChange('frostWarnings', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Sun className="w-4 h-4 text-orange-600" />
                      <div>
                        <Label htmlFor="heat-waves" className="text-sbtp-brown-700">Heat Wave Alerts</Label>
                        <p className="text-xs text-sbtp-brown-500">Extended high temperatures</p>
                      </div>
                    </div>
                    <Switch
                      id="heat-waves"
                      checked={settings.preferences.heatWaves}
                      onCheckedChange={(checked) => handlePreferenceChange('heatWaves', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CloudRain className="w-4 h-4 text-blue-600" />
                      <div>
                        <Label htmlFor="heavy-rain" className="text-sbtp-brown-700">Heavy Rain Warnings</Label>
                        <p className="text-xs text-sbtp-brown-500">Flooding and drainage concerns</p>
                      </div>
                    </div>
                    <Switch
                      id="heavy-rain"
                      checked={settings.preferences.heavyRain}
                      onCheckedChange={(checked) => handlePreferenceChange('heavyRain', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Sun className="w-4 h-4 text-yellow-600" />
                      <div>
                        <Label htmlFor="drought" className="text-sbtp-brown-700">Drought Conditions</Label>
                        <p className="text-xs text-sbtp-brown-500">Extended dry periods</p>
                      </div>
                    </div>
                    <Switch
                      id="drought"
                      checked={settings.preferences.drought}
                      onCheckedChange={(checked) => handlePreferenceChange('drought', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Cloud className="w-4 h-4 text-gray-600" />
                      <div>
                        <Label htmlFor="strong-winds" className="text-sbtp-brown-700">Strong Wind Alerts</Label>
                        <p className="text-xs text-sbtp-brown-500">Risk to tall plants and structures</p>
                      </div>
                    </div>
                    <Switch
                      id="strong-winds"
                      checked={settings.preferences.strongWinds}
                      onCheckedChange={(checked) => handlePreferenceChange('strongWinds', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CloudSnow className="w-4 h-4 text-gray-600" />
                      <div>
                        <Label htmlFor="hail" className="text-sbtp-brown-700">Hail Warnings</Label>
                        <p className="text-xs text-sbtp-brown-500">Potential crop damage</p>
                      </div>
                    </div>
                    <Switch
                      id="hail"
                      checked={settings.preferences.hail}
                      onCheckedChange={(checked) => handlePreferenceChange('hail', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Lead Time */}
              <div className="space-y-4">
                <h4 className="font-medium text-sbtp-green-700">Alert Timing</h4>
                <div>
                  <Label htmlFor="lead-time" className="text-sm text-sbtp-brown-600">
                    How far in advance would you like to be notified?
                  </Label>
                  <Select value={settings.leadTime} onValueChange={(value) => handleSettingChange('leadTime', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1hour">1 hour before</SelectItem>
                      <SelectItem value="6hours">6 hours before</SelectItem>
                      <SelectItem value="12hours">12 hours before</SelectItem>
                      <SelectItem value="24hours">24 hours before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Alert className="border-sbtp-blue/20 bg-sbtp-blue/5">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>AI Enhancement:</strong> Our system learns from your garden's specific microclimate and 
                  your plant selections to provide increasingly accurate and relevant weather alerts over time.
                </AlertDescription>
              </Alert>

              <Button onClick={saveSettings} className="w-full">
                Save Weather Notification Settings
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherBasedNotifications;