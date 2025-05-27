import { useNavigate } from 'react-router';
import { useEffect } from "react";

function Logout() {
    const navigate = useNavigate()

    useEffect(() => {
        clearAndRedirect()
    }, [])

    const clearAndRedirect = async() => {
        localStorage.clear()
        navigate("/")
    }

    return
}

export default Logout