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
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    // Only check required fields after data is loaded and not in edit mode
    if (isDataLoaded && !editMode) {
      const hasEmptyRequiredFields = !userData.username?.trim() || 
                                   !userData.birthDate?.trim() || 
                                   !userData.gender?.trim();
      setShowEmptyDataAlert(hasEmptyRequiredFields);
    }
  }, [userData, editMode, isDataLoaded]);

  const handleEmptyDataConfirm = () => {
    setShowEmptyDataAlert(false);
    setEditMode(true);
  };

  // This function will be called after data is loaded from Firebase
  const handleDataLoaded = () => {
    setIsDataLoaded(true);
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
            onDataLoaded={handleDataLoaded}
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