import { Button, Flex, Space, Typography, Form, Input, Checkbox, Select } from "antd";
import api from "../api";
import signUpStyles from "./signUpStyles";
import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const { Text, Title } = Typography;

const SignUp = () => {
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [pronouns, setPronouns] = useState("")
    const [loading, setLoading] = useState("")

    const navigate = useNavigate()

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onFinish = async (values) => {
        setLoading(true)
        try {
            const res = await api.post("/api/user/register/", { username, password, fname, lname, email, pronouns })
            navigate("/")
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
        console.log(fname)
        console.log(lname)
        console.log(email)
        console.log(pronouns)
    }

    // SIGN UP PAGE
    // 3 buttons availabe: 
    // - 'Sign Up as a Guardian' -> once clicked will bring you to guardian sign up page
    // - 'Sign up as a Judge' -> once clicked will bring you to judge sign up page
    // - 'Back to Login' -> once clicked will bring you back to previous page (login page)
    return (
        <div style={signUpStyles.root}>
            <Flex vertical={true} justify={'center'} align='center' gap={'large'} style={signUpStyles.main}>
                <Title level={1} style={signUpStyles.title}>
                    Sign Up
                </Title>
                <Link to="/guardian-sign-up">
                    <Button>Sign Up as a Guardian</Button>
                </Link>
                <Link to="/judge-sign-up">
                    <Button>Sign up as a Judge</Button>
                </Link>
                <Link to="/">
                    <Button>Back to Login</Button>
                </Link>
            </Flex>
        </div>
    )
}

export default SignUp
