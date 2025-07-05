import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Bell, Mail, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationPreferencesProps {
  onPreferencesUpdate?: (preferences: NotificationSettings) => void;
}

interface NotificationSettings {
  emailNotifications: boolean;
  plantingReminders: boolean;
  harvestAlerts: boolean;
  careReminders: boolean;
  weatherAlerts: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  onPreferencesUpdate
}) => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationSettings>({
    emailNotifications: true,
    plantingReminders: true,
    harvestAlerts: true,
    careReminders: false,
    weatherAlerts: false,
    frequency: 'weekly'
  });

  const handlePreferenceChange = (key: keyof NotificationSettings, value: boolean | string) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
  };

  const savePreferences = () => {
    onPreferencesUpdate?.(preferences);
    toast({
      title: "Preferences Saved",
      description: "Your notification preferences have been updated successfully.",
    });
  };

  return (
    <Card className="border-sbtp-green-200">
      <CardHeader>
        <CardTitle className="flex items-center text-sbtp-green-800">
          <Bell className="mr-2" />
          Smart Garden Notifications
        </CardTitle>
        <p className="text-sm text-sbtp-brown-600">
          Get AI-powered reminders and alerts based on your personalized garden plan
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-sbtp-green-600" />
              <Label htmlFor="email-notifications" className="text-sbtp-brown-700">
                Email Notifications
              </Label>
            </div>
            <Switch
              id="email-notifications"
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-4 w-4 text-sbtp-green-600" />
              <div>
                <Label htmlFor="planting-reminders" className="text-sbtp-brown-700">
                  Planting Reminders
                </Label>
                <p className="text-xs text-sbtp-brown-500">When to plant based on your zone and season</p>
              </div>
            </div>
            <Switch
              id="planting-reminders"
              checked={preferences.plantingReminders}
              onCheckedChange={(checked) => handlePreferenceChange('plantingReminders', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-4 w-4 text-sbtp-green-600" />
              <div>
                <Label htmlFor="harvest-alerts" className="text-sbtp-brown-700">
                  Harvest Alerts
                </Label>
                <p className="text-xs text-sbtp-brown-500">When your crops are ready to harvest</p>
              </div>
            </div>
            <Switch
              id="harvest-alerts"
              checked={preferences.harvestAlerts}
              onCheckedChange={(checked) => handlePreferenceChange('harvestAlerts', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-4 w-4 text-sbtp-green-600" />
              <div>
                <Label htmlFor="care-reminders" className="text-sbtp-brown-700">
                  Care Reminders
                </Label>
                <p className="text-xs text-sbtp-brown-500">Watering, fertilizing, and maintenance tasks</p>
              </div>
            </div>
            <Switch
              id="care-reminders"
              checked={preferences.careReminders}
              onCheckedChange={(checked) => handlePreferenceChange('careReminders', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-4 w-4 text-sbtp-green-600" />
              <div>
                <Label htmlFor="weather-alerts" className="text-sbtp-brown-700">
                  Weather Alerts
                </Label>
                <p className="text-xs text-sbtp-brown-500">Frost warnings and extreme weather notifications</p>
              </div>
            </div>
            <Switch
              id="weather-alerts"
              checked={preferences.weatherAlerts}
              onCheckedChange={(checked) => handlePreferenceChange('weatherAlerts', checked)}
            />
          </div>
        </div>

        <div className="border-t border-sbtp-green-100 pt-4">
          <Label className="text-sbtp-brown-700 text-sm">Notification Frequency</Label>
          <div className="mt-2 space-x-4">
            {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
              <label key={freq} className="inline-flex items-center">
                <input
                  type="radio"
                  name="frequency"
                  value={freq}
                  checked={preferences.frequency === freq}
                  onChange={(e) => handlePreferenceChange('frequency', e.target.value)}
                  className="form-radio h-4 w-4 text-sbtp-green-600"
                />
                <span className="ml-2 text-sm text-sbtp-brown-600 capitalize">{freq}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-sbtp-yellow/10 border border-sbtp-yellow/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-sbtp-brown-700 mb-2">🤖 AI Learning Feature</h4>
          <p className="text-xs text-sbtp-brown-600">
            Our AI learns from your garden's success and failures to improve future recommendations. 
            Your notification timing will become more accurate as you provide feedback on your garden's progress.
          </p>
        </div>

        <Button 
          onClick={savePreferences}
          className="w-full bg-sbtp-green-600 hover:bg-sbtp-green-700"
        >
          Save Notification Preferences
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;