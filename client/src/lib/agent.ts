import axios from "axios";
import { store } from "./stores/store";

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

agent.interceptors.response.use(async response => {
    try {
        await sleep(1000);      // Simulate network delay of 1 second
        return response;        // Return the response after delay
    } catch (error) {
        console.log(error);
        return Promise.reject(error);   // Reject the promise in case of error
    } finally {
        store.uiStore.isIdle();
    }
});

export default agent;       // Export the Axios instance for use in other parts of the application