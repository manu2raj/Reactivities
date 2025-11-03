import { useQuery } from "@tanstack/react-query";
import agent from "../agent";

export const useActivities = () => {
  // Placeholder for activity state and logic
  const {data: activities, isPending} = useQuery({
    queryKey: ['activities'],
    queryFn: async () => { 
      const response = await agent.get<Activity[]>('/activities');
      return response.data;
    }  
  })
  
  return { activities, isPending };
}