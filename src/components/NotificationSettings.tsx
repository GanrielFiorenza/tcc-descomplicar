import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from 'lucide-react';

interface NotificationSettingsProps {
  notifications: boolean;
  setNotifications: (value: boolean) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ notifications, setNotifications }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 text-yellow-500" />
          Notificações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Switch
            checked={notifications}
            onCheckedChange={setNotifications}
          />
          <Label htmlFor="notifications">Ativar notificações</Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;