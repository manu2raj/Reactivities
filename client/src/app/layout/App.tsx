import { Box, Container, CssBaseline, Typography } from "@mui/material";
import { useState } from "react";
import NavBar from "./NavBar";
import ActivityDashborad from "../../features/activities/dashborad/ActivityDashborad";
import { useActivities } from "../../lib/hooks/useActivities";

function App() {
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  
  const {activities, isPending} = useActivities();

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities!.find(a => a.id === id));
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
    // if (activity.id) {
    //   setActivities(activities.map(a => a.id === activity.id ? activity : a));
    // } else {      
    //   const newActivity = {...activity, id: (activities.length + 1).toString()};
    //   setSelectedActivity(newActivity);                 // Show newly created activity in detail view
    //   setActivities([...activities, newActivity]);      // Add new activity to the list
    // } 
    console.log(activity);
    setEditMode(false);    
  }
  
  const handleDeleteActivity = (id: string) => {
    console.log(id);  
    // setActivities(activities.filter(a => a.id !== id));
  }

  return (
    <Box sx={{bgcolor: '#eeeeee', minHeight: '100vh'}}>
      <CssBaseline />
      <NavBar  openForm={handleOpenForm}/>
      <Container maxWidth="xl" sx={{mt: 3}}>
        {!activities || isPending ? (
          <Typography>
            Loading
          </Typography>
        ) : (
          <ActivityDashborad 
            activities={activities}
            selectActivity={handleSelectActivity}
            cancelSelectActivity={handleCancelSelectActivity}
            selectedActivity={selectedActivity} 
            editMode={editMode}
            openForm={handleOpenForm}
            closeForm={handleCloseForm}
            submitForm={handleSubmitForm}
            deleteActivity={handleDeleteActivity}
            />
        )}
        
      </Container>      
    </Box>
  )
}

export default App
