import { Button, Flex, Space, Typography, Form, Input, Checkbox, Select, BackTop } from "antd";
import api from "../api";
import signUpStyles from "./signUpStyles";
import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

//http://4x.ant.design/components/back-top/ backtop
const { Text, Title } = Typography;

const JudgeSignUp = () => {
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmedPass, setConfirmedPass] = useState("")
    const [pronouns, setPronouns] = useState("")
    const [overAdult, setOverAdult] = useState(false)
    const [whatsAppNumber, setWhatsAppNumber] = useState("")
    const [address, setAddress] = useState("")
    const [organization, setOrganization] = useState("")
    const [contactTitle, setContactTitle] = useState("")
    const [round, setRound] = useState("")
    const [timeZone, setTimeZone] = useState("")
    const [loading, setLoading] = useState("")
    const [experienced, setExperienced] = useState(0)
    const [innovationExperience, setInnovationExperience] = useState("")
    const [areaOfExpertise, setAreaOfExpertise] = useState("")
    const [accommodations, setAccommodations] = useState("")
    const [interestQuery, setInterestQuery] = useState("")
    const [hearQuery, setHearQuery] = useState("")
    const [excitementQuery, setExcitementQuery] = useState("")
    const [conflictsOfInterest, setConflictsOfInterest] = useState("")
    const [understand, setUnderstand] = useState(false)
    const [questionsForUs, setQuestionsForUs] = useState("")

    const navigate = useNavigate()

    // function for handling if the form was not properly filled out
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // walk through judge backend sign up process when form is completed
    // making sure that the required checklists are checked, both fields password and confirmation password matched,
    //      put error if rules aren't met
    const onFinish = async (values) => {
        setLoading(true)
        try {
            // check that user said they are over 18
            if (!overAdult) {
                alert("Please confirm that you are at least 18 years old.")
            }
            // check that password matches the confirmed password
            else if (password !== confirmedPass) {
                alert("Passwords do not match")
            }
            // check that user checked that they understand their responsibilities 
            else if (!understand) {
                alert("Please confirm you understand your role as a judge.")
            }
            else {
                console.log(fname, lname, email, phoneNumber, username, password, confirmedPass, pronouns, overAdult, whatsAppNumber, address, organization,
                    contactTitle, round, timeZone, experienced, innovationExperience, areaOfExpertise, accommodations, interestQuery, hearQuery,
                    excitementQuery, conflictsOfInterest, understand, questionsForUs
                )
                // let create_user_info_res;
                // let create_judge_info_res;
                // let auth_res;
                // create a general user in backend
                const auth_res = await api.post("/api/user/register/", { "username": username, "password": password })
                // create an entry for further user info in backend
                const create_user_info_res = await api.post("/api/users/", { "firstname": fname, "familyname": lname, "type": 2, "email": email, "pronouns": pronouns, "phonenumber": phoneNumber, "user": auth_res.data.id })
                // create an entry for further judge info in backend
                const create_judge_info_res = await api.post("/api/judgeinfo/", {
                    "whatsappnumber": whatsAppNumber, "address": address, "organization": organization,
                    "contacttitle": contactTitle, "round": round, "timezone": timeZone, "experienced": experienced, "innovationexperience": innovationExperience,
                    "areaofexpertise": areaOfExpertise, "accommodations": accommodations, "interestquery": interestQuery, "hearquery": hearQuery,
                    "excitementquery": excitementQuery, "conflictofinterest": conflictsOfInterest, "questionsforus": questionsForUs
                })
                // connect judgeinfo table to user info table (foreign key)
                api.put(`/api/judgeinfo/update/${create_judge_info_res.data.id}/`, { "users": create_user_info_res.data.id })
                navigate("/")
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    }


     // Judge Sign up Page
    // Inserting all the fields accordingly to their current webpage sign up, accordingly if they are required fields or not
    return (
        <div style={signUpStyles.scroll}>
            <Space direction="vertical" className="mainSignUp" style={{ width: "100%" }}>
                <Flex vertical={true} justify={'center'} align='center' gap={'large'} style={signUpStyles.main}>
                    <Title level={1} style={signUpStyles.title}>
                        Judge Sign Up
                    </Title>

                    <Flex vertical={true} align={'center'}>
                        <Form
                            name="basic"
                            labelCol={{
                                span: 50,
                            }}
                            wrapperCol={{
                                span: 50,
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
                                label="WhatsApp Number"
                                name="whatsAppNumber"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Please input your WhatsApp Number!',
                                    },
                                ]}
                            >
                                <Input onChange={(e) => setWhatsAppNumber(e.target.value)} />
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
                                    style={{ width: 400 }}
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
                                label="Contact Title"
                                name="contactTitle"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Please input your Contact Title!',
                                    },
                                ]}
                            >
                                <Input onChange={(e) => setContactTitle(e.target.value)} />
                            </Form.Item>

                            <Form.Item
                                label="Organization"
                                name="organization"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Organization (if you are not with an organization, put "independent")!',
                                    },
                                ]}
                            >
                                <Input onChange={(e) => setOrganization(e.target.value)} />
                            </Form.Item>

                            <Form.Item
                                label="Round"
                                name="round"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select your Round!',
                                    },
                                ]}
                            >
                                <Select
                                    defaultValue=" "
                                    style={{ width: 400 }}
                                    options={[
                                        { value: 'NIC Live Round', label: 'NIC LiveRound' },
                                        { value: 'NIC AsynchronousRound', label: 'NIC AsynchronousRound' },
                                        { value: 'Any Round', label: 'Any Round' },
                                    ]}
                                    onChange={(e) => setRound(e)}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Please input your Address!',
                                    },
                                ]}
                            >
                                <Input onChange={(e) => setAddress(e.target.value)} />
                            </Form.Item>

                            <Form.Item
                                label="Time Zone"
                                name="timeZone"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Time Zone!',
                                    },
                                ]}
                            >
                                <Input onChange={(e) => setTimeZone(e.target.value)} />
                            </Form.Item>

                            <Form.Item
                                label={null}
                                name="experienced"
                                valuePropName="checked"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Please check if you have ever judged an invention/innovation challenge before this.'
                                    },
                                ]}>
                                <Checkbox onChange={() => experienced ? setExperienced(0) : setExperienced(1)}>Please check if you have ever judged an invention/innovation challenge before this.</Checkbox>
                            </Form.Item>

                            <Form.Item
                                label="What is your experience with innovation and/or invention?"
                                name="innovationExperience"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Please select innovation/invention experience',
                                    },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    style={{ width: 400 }}
                                    options={[
                                        { value: 'I am an educator/mentor', label: 'I am an educator/mentor' },
                                        { value: 'I am an inventor/innovator', label: 'I am an inventor/innovator' },
                                        { value: 'I hold patents for my own inventions', label: 'I hold patents for my own inventions' },
                                        { value: 'I am a parent of an innovator', label: 'I am a parent of an innovator' },
                                        { value: 'I am an entrepreneur', label: 'I am an entrepreneur' }
                                    ]}
                                    onChange={(e) => setInnovationExperience(e.toString())}
                                />
                            </Form.Item>

                            <Form.Item
                                label="What is your primary field or area of expertise?"
                                name="areaOfExpertise"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Please select your area of expertise!',
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: 400 }}
                                    options={[
                                        { value: 'STEM', label: 'Stem' },
                                        { value: 'Education', label: 'Education' },
                                        { value: 'Entrepreneurship', label: 'Entrepreneurship' },
                                        { value: 'Innovation/Invention', label: 'Innovation/Invention' },
                                        { value: 'Intellectual Property Rights', label: 'Intellectual Property Rights' },
                                        { value: 'Design', label: 'Design' },
                                        { value: 'Marketing', label: 'Marketing' },
                                        { value: 'Sustainability', label: 'Sustainability' },
                                        { value: 'Research', label: 'Research' },
                                        { value: 'Business', label: 'Business' },
                                    ]}
                                    onChange={(e) => setAreaOfExpertise(e)}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Do you require any accommodations to fully participate as a judge?"
                                name="accommodations"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Please select any necessary accommodations!',
                                    },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    style={{ width: 400 }}
                                    options={[
                                        { value: 'Closed Caption', label: 'Closed Caption' },
                                        { value: 'Interpreter', label: 'Interpreter' },
                                        { value: 'Audio Descriptions', label: 'Audio Descriptions' },
                                        { value: 'Other', label: 'Other' }
                                    ]}
                                    onChange={(e) => setAccommodations(e.toString())}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Why would you like to judge for the NIC?"
                                name="interestQuery"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Pleas provide an interest query!',
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    onChange={(e) => setInterestQuery(e.target.value)}
                                />
                            </Form.Item>

                            <Form.Item
                                label="How did you hear about the US NIC?"
                                name="hearQuery"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Pleas provide a hear query!',
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    onChange={(e) => setHearQuery(e.target.value)}
                                />
                            </Form.Item>

                            <Form.Item
                                label="What excites you about reviewing student-led innovations?"
                                name="excitementQuery"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Please provide an excitement query!',
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    onChange={(e) => setExcitementQuery(e.target.value)}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Do you have any conflicts of interest (e.g., family members or students you currently mentor) that could affect your objectivity?"
                                name="conflictsOfInterest"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select if you have any conflicts of interest!',
                                    },
                                ]}
                            >
                                <Select
                                    defaultValue=" "
                                    style={{ width: 400 }}
                                    options={[
                                        { value: 'Yes', label: 'Yes' },
                                        { value: 'No', label: 'No' },
                                    ]}
                                    onChange={(e) => setConflictsOfInterest(e)}
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
                                name="overAdult"
                                valuePropName="checked"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm that you are at least 18 years old.'
                                    },
                                ]}>
                                <Checkbox onChange={() => overAdult ? setOverAdult(false) : setOverAdult(true)}>I confirm that I am at least 18 years old.</Checkbox>
                            </Form.Item>

                            <Form.Item
                                label={null}
                                name="understand"
                                valuePropName="checked"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please check if you understand your responsibilities'
                                    },
                                ]}>
                                <Checkbox onChange={() => understand ? setUnderstand(false) : setUnderstand(true)}>
                                    I understand that serving as judge requires reviewing projects thoroughly and providing
                                    constructive feedback. I agree to adhere to NIC's guidelines, including the Code of Civility
                                    and confidentiality policies.
                                </Checkbox>
                            </Form.Item>

                            <Form.Item
                                label="Do you have any questions for us?"
                                name="questionsForUsQuery"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Please add any questions or comments here!',
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    onChange={(e) => setQuestionsForUs(e.target.value)}
                                />
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

                            <BackTop />

                        </Form>
                    </Flex>
                </Flex>
            </Space>
        </div>

    )
}

export default JudgeSignUp
