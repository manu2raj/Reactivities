import { Box, Button, Paper, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useParams } from "react-router";
import { useForm } from "react-hook-form"
import { useEffect } from "react";
import { activitySchema, type ActivitySchema } from "../../../lib/schemas/activitySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../../app/shared/components/TextInput";

export default function ActivityForm() {
    const { control, reset, handleSubmit } = useForm<ActivitySchema>({
        mode: "onTouched",
        resolver: zodResolver(activitySchema)
    })
    const {id} = useParams();
    const { updateActivity, createActivity, activity, isLoadingActivity } = useActivities(id);

    useEffect(() => {
        if (activity) reset(activity);
    }, [activity, reset]);

    const onSubmit = async (data: ActivitySchema) => { 
        console.log(data)
    }

    if (isLoadingActivity) { return <Typography>Loading...</Typography>; }

    return (
    <Paper sx={{borderRadius: 3, p: 3}}>
        <Typography variant="h5" color="primary">
            {activity ? 'Edit Activity' : 'Create Activities'}
        </Typography>
        <Box component='form' onSubmit={handleSubmit(onSubmit)} display='flex' flexDirection='column' gap={3}>
            <TextInput label='Title' control={control} name='title' />
            <TextInput label='description' control={control} name='description' multiline rows={3} />
            <TextInput label='category' control={control} name='category' />
            <TextInput label='date' control={control} name='date' />
            <TextInput label='city' control={control} name='city' />
            <TextInput label='venue' control={control} name='venue' />
            <Box display={"flex"} justifyContent='end' gap={3}>
                <Button color='inherit' >Cancel</Button>
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
