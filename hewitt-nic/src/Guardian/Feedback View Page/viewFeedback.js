import { Flex, Input, Space, Typography } from "antd"
import TextArea from "antd/es/input/TextArea"
// import Link from "antd/es/typography/Link"
import { useEffect, useState } from "react"

const {Title, Text, Link} = Typography

// Component for users to see group submission
//  Returns just the formatted text, meant to be plugged into other components
export const ViewSubmissionFeedback = ({submission_feedback}) => {

    return (
        <Flex vertical={true}> 
                { submission_feedback &&
                    submission_feedback.filter((feedb) => {return feedb.approved == true}).map((feedback, i) => {
                        return (
                            <Space>
                                <Title level={4}>Feedback {i}</Title>
                                <TextArea rows={2} disabled={true} style={{width:"75%"}}
                                    defaultValue={feedback.text_feedback}
                                />
                            </Space>
                        )
                })}
        </Flex>
        
    )
}