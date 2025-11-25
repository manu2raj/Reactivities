import axios from "axios";
import { store } from "./stores/store";
import { toast } from "react-toastify";
import { router } from "../app/router/Routes";

const sleep = (delay: number) => {  // Function to simulate network delay
    return new Promise((resolve) => {   // Return a promise that resolves after the specified delay
        setTimeout(resolve, delay);
    })};

const agent = axios.create({              // Create an Axios instance
  baseURL: import.meta.env.VITE_API_URL,  // Set base URL from environment variable
    withCredentials: true                 // The withCredentials property within AxiosRequestConfig is a boolean flag that controls whether 
                                          // or not cross- site Access - Control requests should be made using credentials.These credentials can include cookies, authentication headers, or TLS client certificates. 
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
        const {status, data} = error.response;
        switch (status)
        {
            case 400:
                if (data.errors) {
                    const modalStateErrors = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modalStateErrors.push(data.errors[key]);
                        }
                    }
                    throw modalStateErrors.flat();
                } else {
                    toast.error(data)
                }
                break;
            case 401:
                toast.error('Unauthorized')
                break;
            case 404:
                router.navigate('/not-found')
                break;
            case 500:
                router.navigate('/server-error', {state: {error: data}})
                break;
            default:
                break;
        }

        return Promise.reject(error);                 // Reject the promise in case of error
    }
);

export default agent;       // Export the Axios instance for use in other parts of the application