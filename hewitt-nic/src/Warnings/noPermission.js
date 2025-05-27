import { Button, Flex, Space, Typography } from "antd";
import noPermissionStyles from "./noPermissionStyles.js";
import logo from './lockWithSlash.png'
import { Link, useNavigate } from "react-router";
import api from "../api.js";

const { Title } = Typography;

// This page is used for when users attempt to access urls that they are not authorized for. For example if a judge signed in and
// then tried to access /user/admin

// It shows a lock symbol with a slash through it, says "No Permission :(" and has buttons to take the user back to the 
// home screen they are authorized for or to logout and go back to the sign in page

const NoPermission = () => {

    const navigate = useNavigate()

    // determine what kind of user this is to know which home page to return them to
    const goHome = async () => {
        try {
            await api.get("/api/this_user/").then((res) => {
                let UserType = res.data[0].auth_user.type
                if (UserType == 1) {
                    console.log("Navigating to Admin")
                    navigate("/user/admin")
                }
                else if (UserType == 2) {
                    console.log("Navigating to Judge")
                    navigate("/user/judge")
                }
                else if (UserType == 3) {
                    console.log("Navigating to Guardian")
                    navigate("/user/guardian")
                }
                else { // the user is not signed in at all with any kind of authorization
                    console.log("Navigating to No Permission")
                    navigate("/user/no-permission")
                }
            })
        } catch (error) {
            alert(error)
        }
        
    }

    return (
        <div style={noPermissionStyles.root}>
            <Flex vertical={true} justify={'center'} align='center' gap={'large'} style={noPermissionStyles.main}>
                <img src={logo} alt="Logo" height="100"/>
                <Title level={1} style={noPermissionStyles.title}>
                    No Permission :(
                </Title>
                <Space vertical={false} justify={'center'} align='center' gap={'large'}>
                    <Button onClick={() => {goHome()}}>
                        Go Home
                    </Button>
                    <Link to="/logout/">
                        <Button>
                            Log Out
                        </Button>
                    </Link>
                </Space>
            </Flex>
        </div>
    )
}

export default NoPermission
