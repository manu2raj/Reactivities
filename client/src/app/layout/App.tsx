import { Box, Container, CssBaseline } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import ActivityDashborad from "../../features/activities/dashborad/ActivityDashborad";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  
  useEffect(() => {
    axios.get<Activity[]>('https://localhost:5001/api/activities')
      .then(response => setActivities(response.data));
  }, []);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.find(a => a.id === id));
  }

  const handleCancelSelectActivity = () => {
    setSelectedActivity(undefined);
  }

  const handleOpenForm = (id?: string) => {
    if (id) handleSelectActivity(id);
    else handleCancelSelectActivity();
    setEditMode(true);    
  }

  const handleCloseForm = () => {
    setEditMode(false);
  }

  const handleSubmitForm = (activity: Activity) => {
    // TODO submit form
    if (activity.id) {
      setActivities(activities.map(a => a.id === activity.id ? activity : a));
    } else {      
      const newActivity = {...activity, id: (activities.length + 1).toString()};
      setSelectedActivity(newActivity);
      setActivities([...activities, newActivity]);
    } 
    setEditMode(false);
    
  }
  return (
    <Box sx={{bgcolor: '#eeeeee'}}>
      <CssBaseline />
      <NavBar  openForm={handleOpenForm}/>
      <Container maxWidth="xl" sx={{mt: 3}}>
        <ActivityDashborad 
          activities={activities}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          selectedActivity={selectedActivity} 
          editMode={editMode}
          openForm={handleOpenForm}
          closeForm={handleCloseForm}
          submitForm={handleSubmitForm}
          />
      </Container>      
    </Box>
  )
}

export default App
