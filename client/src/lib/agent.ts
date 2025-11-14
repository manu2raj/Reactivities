import axios from "axios";
import { store } from "./stores/store";
import { toast } from "react-toastify";

const sleep = (delay: number) => {  // Function to simulate network delay
    return new Promise((resolve) => {   // Return a promise that resolves after the specified delay
        setTimeout(resolve, delay);
    })};

const agent = axios.create({              // Create an Axios instance
  baseURL: import.meta.env.VITE_API_URL   // Set base URL from environment variable
});

agent.interceptors.request.use(config => {  
    store.uiStore.isBusy();
    return config;
})

agent.interceptors.response.use(
    async response => {
        await sleep(1000);      // Simulate network delay of 1 second
        store.uiStore.isIdle();
        return response;        // Return the response after delay
    },
    async error => {
        await sleep(1000);      // Simulate network delay of 1 second
        store.uiStore.isIdle();

        //console.log('axios error: ' + error);        // Return the response after delay
        const {status} = error.response;
        switch (status)
        {
            case 400:
                toast.error('bad request')
                break;
            case 401:
                toast.error('Unauthorized')
                break;
            case 404:
                toast.error('Not found')
                break;
            case 500:
                toast.error('Server Error')
                break;
            default:
                break;
        }

        return Promise.reject(error);                 // Reject the promise in case of error
    }
);

export default agent;       // Export the Axios instance for use in other parts of the application