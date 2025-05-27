import { Button, DatePicker, Flex, Form, Input, InputNumber, Modal, Space, Table, Tooltip, Typography } from "antd"
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import { useEffect, useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import Feedback from "react-bootstrap/esm/Feedback";
import api from "../../../api";
import { ViewGroupSubmission } from "../../../Guardian/Submission View Page/viewSubmission";


const {Title, Text} = Typography

export const CompetitionFeedbackEditor = ({comp, judges}) => {

    // State var for holding the submissions (and assoc. feedback) gathered from the backend)
    const [curSubmissons, setCurSubmissions] = useState([])
    const [loading, setLoading] = useState(true);

    // Submission viewer vars
    const [isSeeSubmissionOpen, setIsSeeSubmissionOpen] = useState(false)
    const [selSubmission, setSelSubmission] = useState([])

    // Handler to get a competition's submissions when the page loads
    const getSubmissions = async () => {
        setLoading(true)

        try {
            const subRes = await api.get(`/api/submissions/by_competition/${comp.id}/`)

            console.log(subRes)

            setCurSubmissions(subRes.data)
        } catch (error) {
            console.log("Error loading submissions: " + error)
            alert("Error loading submissions: " + error)
        }

        setLoading(false)
    }

    // useEffect hook to get submissions when the page loads
    useEffect(() => {
        console.log(comp)
        console.log(judges)
        getSubmissions()
    }, [])

    // Table columns for each submission 
    const submissionColumns = [
        {
            title: "Project Title",
            key: "project_title",
            render: (_, submission) => (submission.group.project_title)
        },
        {
            title: "Judged Grade",
            key: "judged_grade",
            // Get the grade level that this group as considered (for judge assignments)
            //  Syntax from https://stackoverflow.com/questions/4020796/finding-the-max-value-of-a-property-in-an-array-of-objects 
            render: (_, submission) => (Math.max(...submission.group.group_participants.map(o => o.grade)))
        },
        {
            title: "Number of Evaluations",
            key: "num_evaluation",
            render: (_, submission) => (submission.submission_feedback.length)
        },
        {
            title: "See Submission",
            key: "seeSubmission",
            render: (_, submission) => (
                <Button
                    onClick={() => {
                        // Button to open the submission's actual content
                        console.log(submission)
                        setSelSubmission(submission)
                        setIsSeeSubmissionOpen(true)
                    }}
                >
                    View
                </Button>
            )
        },
    ]

    // Columns for the feedback subtable
    const feedbackColumns = [
        {
            title: "Judge Name",
            key: "judge name",
            render: (_, feedback) => {
                // From https://stackoverflow.com/questions/75771816/find-any-match-in-an-array-of-objects 
                const judge = judges.find(j => j.id === feedback.judge);
                console.log(judge)
                return judge ? `${judge.firstname} ${judge.familyname}` : "Unknown Judge";
            }
        },
        {
            title: "Recommended By Judge?",
            key: "recommended",
            render: (_, feedback) => (feedback.box_checked ? "Yes":"No")
        },
        {
            title: "Feedback Statement",
            key: "feedback_statement",
            ellipsis: {
                showTitle: false,
            },
            render: (_, feedback) => (
                <Tooltip placement="topLeft" title={feedback.text_feedback}>
                    {feedback.text_feedback}
                </Tooltip>
            ),
        },
        {
            title: "See Evaluation",
            key: "seeFeedback",
            render: (_, feedback) => (
                <Button>View</Button>
            )
        },
        {
            title: "Approval",
            key: "approval",
            render: (_, feedback) => (feedback.approved ? (
                <Space>
                    <Text>Yes</Text>
                    <Button onClick={() => {changeGroupApproval(feedback, false)}}>
                        Disapprove
                    </Button>
                </Space>
                
            ):(
                <Space>
                    <Text>No</Text>
                    <Button onClick={() => {changeGroupApproval(feedback, true)}}>
                        Approve
                    </Button>
                </Space>
            ))
        },
    ]

    // Function to handle rendering each feedback nested table
    const renderFeedbackRows = (submission) => {
        // console.log(index, comp.comp_groups[index]);
        if (!submission.submission_feedback) return (<Typography.Text>No Evaluations</Typography.Text>)
        return <Table 
            columns={feedbackColumns} 
            dataSource={submission.submission_feedback} 
            pagination={false} 
            size="small"
            rowKey={"id"}
            />
    }

    // Function to handle the feedback approval/disapproval change
    const changeGroupApproval = async (feedback, approved) => {
        try {
            await api.put(`/api/feedback/update/${feedback.id}/`, {
                "approved": approved,
            })

            getSubmissions()
        } catch (error) {
            console.log(error)
            alert(error)
        }
    }

    if (loading) return <Title>Loading...</Title>

    return (
        <div>
            <Modal
                open={isSeeSubmissionOpen}
                onCancel={() => {setIsSeeSubmissionOpen(false)}}
                title="See Group Submission"
                footer={null}
                width="90%"
            >
                <ViewGroupSubmission submission={selSubmission} />
            </Modal>
            <Flex vertical={true} align="center">
                <Title>Manage Competition Submissions</Title>
                <Flex align="space-around" justify="space-around">
                    <Table 
                        columns={submissionColumns}
                        expandable={{ rowExpandable: (record) => true, 
                                expandedRowRender: renderFeedbackRows}}
                        dataSource={curSubmissons}
                        rowKey={"id"}
                        style={{width:"100%"}}
                    />
                </Flex>
            </Flex>
        </div>
        
        
    )
}