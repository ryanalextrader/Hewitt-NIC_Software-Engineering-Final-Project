import {jwtDecode} from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// Module to protect routes from unverified users or users of incorrect type

// implement a protected route for this page
//   permissions - lists what types of users have access to this route
//   children - route to protect  
function ProtectedRoute({permissions, children}) {
    const [isAuthorized, setIsAuthorized] = useState(null)
    const [hasAccess, setHasAccess] = useState(null);
    const navigate = useNavigate()
    if(!permissions){
        permissions="any"; // default option is any user can access the page
    }

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false)) // see if user is authorized
    }, [])

    // if user is authorized, see if they are the correct type of user and have access to this page
    useEffect(() => {
        access().catch(() => setHasAccess(false))
    }, [isAuthorized]);

    // function to submit a refresh token and get a new access token
    const refreshToken = async() => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            // if token was accepted, user is authorized
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error)
            setIsAuthorized(false)
        }
    }

    // function to determine if user is of correct type to access this page
    const access = async() => {
        // debug console prints
        console.log(window.location.pathname)
        console.log("permissions: ", permissions);
        console.log("isAuthorized: ", isAuthorized)
        // if permissions set to any, user will always have access to this page
        if(permissions.includes("any")){
            setHasAccess(true)
            return
        }
        else if(isAuthorized){
            console.log("You are authorized")
            console.log(permissions)
            // request to get user information
            await api.get('/api/users/auth_user_id/').then((res) => {
                console.log(res.data[0]);
                console.log(res.data[0]);
                console.log(res.data[0].type == 2)
                console.log(res.data[0].type === 2 && permissions.includes("judge"));
                // see if user type matches the permissions, grant access on match
                if(res.data[0].type === 1 && permissions.includes("admin")){
                    setHasAccess(true)
                }
                else if(res.data[0].type === 2 && permissions.includes("judge")){
                    setHasAccess(true);
                }
                else if(res.data[0].type === 3 && permissions.includes("guardian")){
                    setHasAccess(true)
                }
                else{
                    setHasAccess(false);
                }
            }).catch((err) => {
                console.error("Error validating credentials:", err)
                alert("Error validating credentials:", err)
                setHasAccess(false);
            })
        }
    }

    // function to determine if a user is authenticated
    const auth = async() => {
        const token = localStorage.getItem(ACCESS_TOKEN) // see if there is a local access token

        console.log(token)

        // if no access token, user is not authorized and does not have access to this page
        if (!token) {
            setIsAuthorized(false)
            setHasAccess(false);
            return
        }
        // otherwise decode token and see if is expired (if expired, try to refresh access token with refresh token)
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000

        if (tokenExpiration < now){
            await refreshToken()
        } else {
            setIsAuthorized(true)
        }
    }

    // blocks access to page until useEffects are complete
    if (isAuthorized == null){
        return <div>Loading...</div>
    }

    if(hasAccess == null){
        return <div>Loading...</div>
    }
    
    console.log(isAuthorized)   

    console.log("hasAccess: ", hasAccess)

    // only grant access to page if user is authorized and has access to the page
    if(isAuthorized && hasAccess){
        return children
    }
    // navigate users to log in if user is not authenticated
    else if(!isAuthorized){
        return navigate("/");
    }
    // block pages that user does not have access to 
    else{
        return navigate('/no-permission');   
    }
    // return (isAuthorized && hasAccess)? children : navigate("/")
}

export default ProtectedRoute