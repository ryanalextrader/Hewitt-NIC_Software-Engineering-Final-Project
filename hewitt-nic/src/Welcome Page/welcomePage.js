import { Button, Flex, Space, Typography, Form, Input, Checkbox } from "antd";
import api from "../api";
import welcomePageStyles from "./welcomePageStyles";
import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import './welcomePage.css'
import logo from './nicLogo.png' //https://create-react-app.dev/docs/adding-images-fonts-and-files/

const { Text, Title } = Typography;

console.log(logo);

// https://ant.design/components/button for buttons styling
const WelcomePage = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState("")
    const navigate = useNavigate()

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onFinish = async (values) => {
        console.log("Username: ", username)
        console.log("Password", password)
        setLoading(true)
        try {
            const res = await api.post("/api/token/", { username, password })
            localStorage.setItem(ACCESS_TOKEN, res.data.access)
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
            await api.get("/api/this_user/").then((res) => {
                console.log(res)
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
                else {
                    console.log("Navigating to No Permission")
                    navigate("/user/no-permission")
                }
            })
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    };

    const handleSubmit = (e) => {
        setLoading(true)
        e.preventDefault()
        console.log(username)
        console.log(password)
    }


    return (
        <div style={welcomePageStyles.root}>
            <div justify={'left'} style={welcomePageStyles.main}>
            <Flex vertical={true} justify={'center'} align='center' gap={'large'} style={welcomePageStyles.main}>
                <img src={logo} alt="Logo" height="100" style={{ paddingTop: '30px', paddingLeft: '30px'}}/>
                <Title level={1} style={welcomePageStyles.title}>
                    Welcome!
                </Title>

                <Flex vertical={true} align={'center'}>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            color: "pink",
                            maxWidth: 600,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        onSubmit={handleSubmit}
                        autoComplete="off"
                    >
                        <Form.Item
                            label={<label style={{ color: "black" }}>Username</label>} // https://stackoverflow.com/questions/62355929/antd-how-to-change-antd-form-item-label-text-color
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input onChange={(e) => setUsername(e.target.value)} />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password onChange={(e) => setPassword(e.target.value)} />
                        </Form.Item>

                        <Form.Item name="remember" valuePropName="checked" label={null}>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <Form.Item label={null}>
                            {/* <Link to={"/user/admin"}> */}
                            <Button color="blue" htmlType="submit" variant="solid">
                                Submit
                            </Button>
                            {/* </Link> */}

                        </Form.Item>
                    </Form>
                    <Space>
                        <Text>
                            Not a current user?
                        </Text>
                        <Link to={"/sign-up"}>
                            <Button color="blue" htmlType="submit" variant="solid">
                                Sign Up
                            </Button>
                        </Link>

                    </Space>
                </Flex>


                {/* <Space size={"large"}>
                    <Link to={"/user/admin"}>
                        <Button color="purple" size="large" variant="filled">
                            Go to admin
                        </Button>
                    </Link>

                    <Link to={"/user/judge"}>
                        <Button color="purple" size="large" variant="filled">
                            Go to judge
                        </Button>
                    </Link>

                    <Link to={"/user/participant"}>
                        <Button color="purple" size="large" variant="filled">
                            Go to participant
                        </Button>
                    </Link>
                </Space> */}
            </Flex>
        </div>
        </div>

    );
}

export default WelcomePage