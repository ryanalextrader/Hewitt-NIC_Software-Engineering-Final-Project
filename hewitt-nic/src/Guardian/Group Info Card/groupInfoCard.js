import { Button, Card, Divider, Flex, Modal, Space, Tooltip, Typography } from "antd";

import "./groupInfoCard.css"
import groupInfoStyles from "./groupInfoCardStyles"

import { useEffect, useState } from "react"
import { Link } from "react-router";
import { ViewSubmissionFeedback } from "../Feedback View Page/viewFeedback";

const {Title, Text} = Typography;

// Card to view group info for the guardian home page
//  Also includes conditional buttons for submissions/viewing rubrics
const GroupInfoCard = ({group}) => {

    // Modal for seeing a group's feedback is attached to the card
    const [isSeeFeedbackOpen, setIsSeeFeedbackOpen] = useState(false)

    useEffect(() => {
        console.log(group)
    }, [])

    const dueDate = new Date(group.comp.submission_due_date);

    return (
        <div>
            <Modal
                open={isSeeFeedbackOpen}
                onCancel={() => {setIsSeeFeedbackOpen(false)}}
                title="See Group Feedback"
                footer={null}
                width="90%"
            >
                {group.group_submission.length > 1 &&
                    <ViewSubmissionFeedback submission_feedback={group.group_submission[0].submission_feedback}/>
                }
                
            </Modal>
            <Card 
                className="CompInfoCard" 
                title={
                    // <Title level={4}>{group.project_title}</Title>
                    <Tooltip
                        title={group.project_title}
                        placement="topLeft"
                    >
                        <Title 
                            level={4}
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                textAlign: 'left'
                            }}
                        >
                                {group.project_title}
                        </Title>
                    </Tooltip>
                } 
                extra={
                    <div>
                        {
                            group.approved == true && 

                        <Space size="middle">
                                <Button>
                                See Rubric
                                </Button>
                                {
                                    (group.comp.competition_state != "Ended") &&
                                    <Link to="/user/guardian/submission" state={{group: group}}>
                                        <Button
                                            disabled={!group.comp.submission_active}
                                        >
                                            Edit Submission
                                        </Button>
                                    </Link>
                                    
                                }
                                {
                                    (group.comp.competition_state == "Ended" 
                                        && 
                                        group.group_submission[0].submission_feedback.filter((feedb) => {return feedb.approved}).length > 0) 
                                    &&
                                    <Button onClick={() => {setIsSeeFeedbackOpen(true)}}>
                                        See Feedback
                                    </Button>
                                }
                            </Space> 
                        }
                        {
                            group.approved == false && 
                            <Text>Group Not Approved</Text>
                        }
                        
                    </div>
                    
                }
                style={groupInfoStyles.card}
            >
                <Flex 
                    className="CompInfoContent" justify="space-around" align="start" 
                    style={{width:"100%"}}
                    split={<Divider type="Horizontal"></Divider>}
                >
                    <Space direction="vertical" align="start">
                        <Text>Participants:</Text>
                        {
                            group.group_participants &&
                            group.group_participants.map((participant) => {
                                return (
                                    <Text>{participant.firstname + " " + participant.familyname}</Text>
                                )
                            })
                        }
                    </Space>
                    <Space direction="vertical" align="start">
                        <Text>{"Competition: " + (group.comp.name)}</Text>
                        <Text>{"Due Date: " + (dueDate.getMonth() + "/" + dueDate.getDate() + "/" + dueDate.getFullYear())}</Text>
                    </Space>
                </Flex>
            </Card>
        </div>
        
    )
}

export { GroupInfoCard }