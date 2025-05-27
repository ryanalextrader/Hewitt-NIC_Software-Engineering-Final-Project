import { Button, Checkbox, Flex, Form, Input, Space, Typography } from "antd"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router";
import api from "../../api";

const { Title, Text } = Typography

// Submission editor page for guardian users
//  Called from group info cards
const SubmissionEdit = () => {

    const [SubmissionForm] = Form.useForm();

    const group = useLocation().state.group
    const state = useLocation().state
    const [loading, setLoading] = useState(true);
    const [initSubmission, setInitSubmission] = useState();

    // Gets the up to date submission details from the group
    //  Create new submission if none currently exist
    const getSubmission = async () => {
        try {
            const getRes = await api.get(`/api/submissions/${group.id}/`);
    
            if (getRes.data && getRes.data.length > 0) {
                setInitSubmission(getRes.data[0]);
            } else {
                const createRes = await api.post(`/api/submissions/`, {
                    group: group.id,
                });
    
                console.log("Created new submission:", createRes.data);
                setInitSubmission(createRes.data);
            }
        } catch (error) {
            console.log("Error in getSubmission:", error);
        }
    
        setLoading(false);
    };
    
    // Handles saving/editing a solution
    const postSubmission = async (inputs) => {
        try {
            // Update submission item
            await api.put(`/api/submissions/update/${initSubmission.id}/`, {
                "group": initSubmission.group.id,
                "problem_solved": inputs.problemSolved,
                "presentation_link": inputs.presentationLink,
                "youtube_link": inputs.youtubeLink,
                "log_book_link": inputs.logbookLink,
            })

            // Update group project title
            await api.put(`/api/groups/update/${initSubmission.group.id}/`, {
                "project_title": inputs.projectTitle,
            })

            alert("Submission Saved!")
        } catch (error) {
            console.log(error)
            alert(error)
        }
        
    }

    // Get submission on load (group id won't change while using the component)
    useEffect(() => {
        console.log(group)
        getSubmission()
    }, [group.id])

    if (loading) return <Title level={3}>Loading submission...</Title>;

    return (
        <Flex vertical={true} justify="space-around" align="center" style={{width:"100%", height:"100%"}}>
            <Space size="large">
                <Title>Edit Your Submission</Title>
                <Link to="/user/guardian/">
                    <Button>Go Back</Button>
                </Link>
            </Space>
            <Form
                style={{ width: "95%" }}
                name="Submission Info"
                form={SubmissionForm}
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 20 }}
                initialValues={{
                    'projectTitle': group.project_title,
                    'problemSolved': initSubmission.problem_solved ? initSubmission.problem_solved : "",
                    'presentationLink': initSubmission.presentation_link ? initSubmission.presentation_link : "",
                    'youtubeLink': initSubmission.youtube_link ? initSubmission.youtube_link : "",
                    'logbookLink': initSubmission.log_book_link ? initSubmission.log_book_link : "",
                }}
                onFinish={postSubmission}
            >
                <Form.Item
                    label="Project Title"
                    name="projectTitle"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Problem Solved"
                    name="problemSolved"
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    label="Presentation Link"
                    name="presentationLink"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Youtube Link"
                    name="youtubeLink"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Logbook Link"
                    name="logbookLink"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={null}
                    name="shared"
                    valuePropName="checked"
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm that you have shared your links with the moderators.'
                        },
                    ]}>
                    <Checkbox>I confirm that I have made my presentation materials available to moderators.</Checkbox>
                </Form.Item>
                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </Flex>
    )
}

export default SubmissionEdit