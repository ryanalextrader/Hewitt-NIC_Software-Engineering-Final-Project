import { Button, Flex, Space, Typography, Form, Input, Checkbox, Select } from "antd";
import api from "../api";
import signUpStyles from "./signUpStyles";
import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const { Text, Title } = Typography;

const GuardianSignUp = () => {
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confimedPass, setConfirmedPass] = useState("")
    const [pronouns, setPronouns] = useState("")
    const [checked, setChecked] = useState(false)
    const [loading, setLoading] = useState("")

    const navigate = useNavigate()

    // function for handling if the form was not properly filled out
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // walk through guardian backend sign up process when form is completed
    // making sure that the checklist is checked, both fields password and confirmation password matched,
    //      put error if rules aren't met
    const onFinish = async (values) => {
        setLoading(true)
        try {
            // check that user said they are over 18
            if (!checked) {
                alert("Please confirm that you are at least 18 years old.")
            }
            // check that password matches the confirmed password
            else if (password !== confimedPass) {
                alert("Passwords do not match")
            }
            else {
                console.log(fname, lname, email, phoneNumber, username, password, pronouns);
                // create a general user in backend
                const auth_res = await api.post("/api/user/register/", {"username":username, "password":password})
                // create an entry for further user info in backend
                await api.post("/api/users/", {"firstname": fname, "familyname":lname, "type": 3, "email": email, "pronouns":pronouns, "phonenumber": phoneNumber, "user": auth_res.data.id})
                navigate("/")
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    };


        // Guardian Sign up Page
        // Inserting all the fields accordingly to their current webpage sign up, where they're all required field
    return (
        <div style={signUpStyles.scroll}>
            <Space direction="vertical" className="mainSignUp" style={{ width: "100%" }}>
                <Flex vertical={true} justify={'center'} align='center' gap={'large'} style={signUpStyles.main}>
                    <Title level={1} style={signUpStyles.title}>
                        Guardian Sign Up
                    </Title>

                    <Flex vertical={true} align={'center'}>
                        <Form
                            name="basic"
                            labelCol={{
                                span: 50,
                            }}
                            wrapperCol={{
                                span:50,
                            }}
                            style={{
                                maxWidth: 400,
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            layout="vertical"
                        >
                            <Form.Item
                                label="First Name"
                                name="fname"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your First Name!',
                                    },
                                ]}
                            >
                                <Input onChange={(e) => setFname(e.target.value)} />
                            </Form.Item>


                            <Form.Item
                                label="Last Name"
                                name="lname"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Last Name!',
                                    },
                                ]}
                            >
                                <Input onChange={(e) => setLname(e.target.value)} />
                            </Form.Item>


                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Email!',
                                    },
                                ]}
                            >
                                <Input onChange={(e) => setEmail(e.target.value)} />
                            </Form.Item>

                            <Form.Item
                                label="Phone Number"
                                name="phoneNumber"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Phone Number!',
                                    },
                                ]}
                            >
                                <Input onChange={(e) => setPhoneNumber(e.target.value)} />
                            </Form.Item>

                            <Form.Item
                                label="Pronouns"
                                name="pronouns"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select your Pronouns!',
                                    },
                                ]}
                            >
                                <Select
                                    defaultValue=" "
                                    // style={{ width: 225}}
                                    options={[
                                        { value: 'she/her', label: 'she/her' },
                                        { value: 'he/him', label: 'he/him' },
                                        { value: 'they/them', label: 'they/them' },
                                        { value: 'other', label: 'other', disabled: true },
                                    ]}
                                    onChange={(e) => setPronouns(e)}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Username"
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
                                        message: 'Please input your Password!',
                                    },
                                ]}
                            >
                                <Input.Password onChange={(e) => setPassword(e.target.value)} />
                            </Form.Item>

                            <Form.Item
                                label="Confirm Password"
                                name="confirmedPassword"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm your Password!',
                                    },
                                ]}
                            >
                                <Input.Password onChange={(e) => setConfirmedPass(e.target.value)} />
                            </Form.Item>

                            <Form.Item
                                label={null}
                                name="over18"
                                valuePropName="checked"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm that you are at least 18 years old.'
                                    },
                                ]}>
                                <Checkbox onChange={() => checked ? setChecked(false) : setChecked(true)}>I confirm that I am at least 18 years old.</Checkbox>
                            </Form.Item>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Form.Item>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <Button type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                        <Link to="/sign-up">
                                            <Button>Back</Button>
                                        </Link>
                                    </div>
                                </Form.Item>
                            </div>
                        </Form>
                    </Flex>
                </Flex>
            </Space>
        </div>

    )
}

export default GuardianSignUp
