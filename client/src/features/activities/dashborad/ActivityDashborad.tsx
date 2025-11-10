import { Grid2 } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityFilter from "./ActivityFilter";

export default function ActivityDashborad() {
    return (
        <Grid2 container spacing={8}>
            <Grid2 size={7}>
                <ActivityList />
            </Grid2>
            <Grid2 size={4}>
                <ActivityFilter />
            </Grid2>
        </Grid2>
    )
}
