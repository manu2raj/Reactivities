import { Box, Button, Paper, TextField, Typography } from "@mui/material";


export default function ActivityForm() {
  return (
    <Paper sx={{borderRadius: 3, p: 3}}>
        <Typography variant="h5" color="primary">
            Create activities
        </Typography>
        <Box component='form' display='flex' flexDirection='column' gap={3}>
            <TextField label='Title' />
            <TextField label='Description' multiline rows={3} />
            <TextField label='Category' />
            <TextField label='Date' type="date" />
            <TextField label='City' />
            <TextField label='Venue' />
            <Box display={"flex"} justifyContent='end' gap={3}>
                <Button color='inherit' >Cancel</Button>
                <Button color='success' variant="contained">Submit</Button>
            </Box>
        </Box>
    </Paper>
  )
}
