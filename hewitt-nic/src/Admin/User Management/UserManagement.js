import { Flex, Select, Table, Typography } from "antd"
import { useEffect, useState } from "react"
import api from "../../api"
import { useNavigate } from "react-router"
import { getUserID } from "../../utility"


// Component for admins to view and edit the roles of all users
const UserManagement = () => {

    // Stores all users 
    const [users, setUsers] = useState([])
    const navigate = useNavigate()

    // Get all project users
    const getUsers = async () => {
        try {
            const userRes = await api.get('/api/users/')
            console.log(userRes)
            setUsers(userRes.data)
        } catch (error) {
            console.error("Error loading users:", error);
            alert("Error loading users:", error)
        }
    }

    // Handler to update a user's role
    const updateUserRole = async (newRole, user) => {

        console.log(newRole, user)

        // Store previous role for admin checking
        const prevRole = user.type

        // Check to make sure the last admin user isn't demoted
        if (newRole != 1 && user.type == 1 && users.filter((user) => {return user.type==1}).length <= 1) {
            alert("Error, cannot demote only admin user!")
        }
        else {
            const updateRes = await api.patch(`/api/users/update/${user.id}/`, {
                "type": newRole
            })

            console.log(updateRes)

            // Get the current user
            const curUser = getUserID()

            // See if admin needs to be logged out
            if (curUser.id == user.id && prevRole == 1 && newRole != 1) {
                navigate("/logout")
            }
        }

        // Get updated users
        getUsers()
    }

    // Get users on page load
    useEffect(() => {
        getUsers()
    }, [])

    // Columns for each user in the table
    const user_columns = [
        {
            title: 'First Name',
            key: 'firstname',
            render: (_, user) => (user.firstname)
        },
        {
            title: 'Family Name',
            key: 'familyname',
            render: (_, user) => (user.familyname)
        },
        {
            title: 'Pronouns',
            key: 'pronouns',
            render: (_, user) => (user.pronouns)
        },
        {
            title: 'Role',
            key: 'role',
            render: (_, user) => (
                <Select
                    defaultValue={user.type}
                    options={[
                        {
                            value: 1,
                            label: "Admin"
                        },
                        {
                            value: 2,
                            label: "Judge"
                        },
                        {
                            value: 3,
                            label: "Guardian"
                        },
                    ]}
                    onChange={(newRole) => {updateUserRole(newRole, user)}}
                    style={{
                        width:"60%"
                    }}
                />
            )
        },
        {
            title: 'Email',
            key: 'email',
            render: (_, user) => (user.email)
        },
        {
            title: 'Phone Number',
            key: 'phonenumber',
            render: (_, user) => (user.phonenumber)
        },
        {
            title: 'Program',
            key: 'program',
            render: (_, user) => (user.program)
        },
    ]

    return (
        <Flex vertical={true}>
            <Typography.Title>Manage Users</Typography.Title>
            <Table 
                columns={user_columns}
                dataSource={users}
                size="small"
                rowKey={"id"}
            />
        </Flex>
    )
}

export default UserManagement