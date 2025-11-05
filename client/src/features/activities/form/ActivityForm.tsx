import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import type { FormEvent } from "react";
import { useActivities } from "../../../lib/hooks/useActivities";

type Props = {
    activity?: Activity;
    closeForm: () => void;
}

export default function ActivityForm({activity, closeForm}: Props) {
    const { updateActivity, createActivity } = useActivities();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();     // Prevent default form submission behavior

        const formData = new FormData(event.currentTarget);     // Create FormData from the form element
        const data: {[key: string]: FormDataEntryValue} = {};   // Initialize empty object to hold form data

        formData.forEach((value, key) => {  // Convert FormData to a regular object
            data[key] = value;
        });
        
        if(activity) {  // If activity exists, we are updating
            data.id = activity.id;
            await updateActivity.mutate(data as unknown as Activity);
            closeForm();
        }
        else {  // Creating new activity    
            await createActivity.mutate(data as unknown as Activity);
            closeForm();
        }
    }

    return (
    <Paper sx={{borderRadius: 3, p: 3}}>
        <Typography variant="h5" color="primary">
            Create activities
        </Typography>
        <Box component='form' onSubmit={handleSubmit} display='flex' flexDirection='column' gap={3}>
            <TextField name="title" label='Title' defaultValue={activity?.title} />
            <TextField name="description"  label='Description' multiline rows={3}  defaultValue={activity?.description} />
            <TextField name="category"  label='Category'  defaultValue={activity?.category}  />
            <TextField name="date"  label='Date' type="date" 
                defaultValue={activity?.date
                    ? new Date(activity.date).toISOString().split('T')[0]
                    :new Date().toISOString().split('T')[0]
                }/>
            <TextField name="city"  label='City'  defaultValue={activity?.city} />
            <TextField name="venue"  label='Venue'  defaultValue={activity?.venue} />
            <Box display={"flex"} justifyContent='end' gap={3}>
                <Button onClick={closeForm} color='inherit' >Cancel</Button>
                <Button 
                    type="submit" 
                    color='success' 
                    variant="contained"
                    disabled={updateActivity.isPending || createActivity.isPending}
                >Submit</Button>
            </Box>
        </Box>
    </Paper>
  )
}
