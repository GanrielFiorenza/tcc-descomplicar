import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import NotificationSettings from '@/components/NotificationSettings';
import UserProfileForm from '@/components/UserProfileForm/UserProfileForm';
import EmptyDataAlert from '@/components/EmptyDataAlert';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    birthDate: '',
    gender: ''
  });
  const [showEmptyDataAlert, setShowEmptyDataAlert] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const hasEmptyFields = !userData.username || !userData.birthDate || !userData.gender;
    if (hasEmptyFields) {
      setShowEmptyDataAlert(true);
    }
  }, [userData]);

  const handleEmptyDataConfirm = () => {
    setShowEmptyDataAlert(false);
    setEditMode(true);
  };

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
            forceEditMode={editMode}
            onEditModeChange={setEditMode}
          />
        </CardContent>
      </Card>

      <EmptyDataAlert 
        isOpen={showEmptyDataAlert} 
        onConfirm={handleEmptyDataConfirm}
      />
    </div>
  );
};

export default Settings;