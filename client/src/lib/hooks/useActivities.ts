import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../agent";
import { useLocation } from "react-router";
import type { Activity } from "../types";

export const useActivities = (id?: string) => {
  const queryClient = useQueryClient();   // Get the QueryClient instance
  const location = useLocation();

// Placeholder for activity state and logic
  const {data: activities, isPending} = useQuery({    // Fetch activities using React Query
    queryKey: ['activities'],                         // Unique key for the query
    queryFn: async () => {                            // Function to fetch activities
      const response = await agent.get<Activity[]>('/activities');  // Send GET request to fetch activities
      return response.data;                         // Return the data from the response
    },
    enabled: !id && location.pathname === '/activities'
  })
  
  const {data: activity , isLoading: isLoadingActivity} = useQuery({    // Fetch a single activity by ID
    queryKey: ['activity', id],                         
    queryFn: async () => {                                              // Function to fetch activities
      const response = await agent.get<Activity>(`/activities/${id}`);  // Send GET request to fetch activities
      return response.data;                                             // Return the data from the response
    },                                                                  // Function to fetch a single activity
    enabled: !!id,                                                      // Only run this query if id is provided
  })  

  const updateActivity = useMutation ({   // Mutation for updating an activity
    mutationFn: async (activity: Activity) => {
      await agent.put('/activities', activity);   // Send PUT request to update activity
    },
    onSuccess: async () => {    // Invalidate activities query to refetch data
      await queryClient.invalidateQueries({ queryKey: ['activities'] });    // Invalidate activities query to refetch data
    }
  });

  const createActivity = useMutation ({   // Mutation for creating a new activity
    mutationFn: async (activity: Activity) => {
      const response = await agent.post('/activities', activity);  // Send POST request to create activity
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['activities'] });  //  Invalidate activities query to refetch data
    }
  });

    const deleteActivity = useMutation ({   // Mutation for deleting an activity
    mutationFn: async (id: string) => {
      await agent.delete(`/activities/${id}`);  // Send DELETE request to delete activity
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['activities'] });  //  Invalidate activities query to refetch data
    }
  });

  return {    // Return activities and mutation functions
     activities,
     isPending,
     updateActivity,
     createActivity,
     deleteActivity,
     activity,
     isLoadingActivity
    };
}

