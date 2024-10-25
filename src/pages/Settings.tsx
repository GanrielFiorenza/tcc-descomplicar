import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import NotificationSettings from '@/components/NotificationSettings';
import UserProfileForm from '@/components/UserProfileForm/UserProfileForm';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    birthDate: '',
    gender: ''
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>
      
      <NotificationSettings 
        notifications={notifications}
        setNotifications={setNotifications}
      />

      <Card className="mb-6">
        <CardContent className="pt-6">
          <UserProfileForm 
            userData={userData}
            setUserData={setUserData}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;