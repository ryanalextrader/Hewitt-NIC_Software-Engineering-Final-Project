import api from "./api"

// File to hold utility functions

// Handles getting the user information of the logged in user
export const getUserID = async () => {

    let user = -1
    try {
        await api.get("/api/this_user/").then((res) => {
            user = res.data[0]
        })
    } catch (error) {
        // alert("Error Obtaining Current User Info: " + error)
        console.error("Error Obtaining Current User Info: ", error)
    }
    return user
}