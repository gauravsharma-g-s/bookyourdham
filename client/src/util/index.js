import {  toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

// Display toast
export const displayToast = (text, status) => { // Toast Settings  Displaying Toast
    if (status === 1) toast.success(text)
    else if (status === 2) toast.error(text)
    else if (status === 3) toast.warn(text)
    else if (status === 4) toast.info(text)
}


// Function to check if the access token is expired
 export const isAccessTokenExpired = (accessToken) => {
    const decodedToken = jwtDecode(accessToken)
    // Check if the access token exists and its expiry time is in the future
    return !accessToken || Date.now() >= decodedToken.exp;
};