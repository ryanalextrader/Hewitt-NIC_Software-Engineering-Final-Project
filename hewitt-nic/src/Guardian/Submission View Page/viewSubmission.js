import { Flex, Input, Space, Typography } from "antd"
import TextArea from "antd/es/input/TextArea"
// import Link from "antd/es/typography/Link"
import { useEffect, useState } from "react"

const {Title, Text, Link} = Typography

// Basic group submission view page for judges and admin
//  Returns just the formatted text, meant to be plugged into other components
export const ViewGroupSubmission = ({submission}) => {

    return (
        <Flex vertical={true}>
            <Title>{submission.project_title}</Title>
            <Space style={{width:"100%"}}>
                <Title level={5}>Problem Solved</Title>
                <TextArea rows={2} disabled={true} style={{width:"50vh"}}
                    value={submission.problem_solved ? submission.problem_solved : ""}
                />
            </Space> 
            <Space>
                <Title level={5}>Presentation Link</Title>
                <Link href={submission.presentation_link} target="_blank"> 
                    {submission.presentation_link} 
                </Link>
            </Space> 
            <Space>
                <Title level={5}>Video Link</Title>
                <Link href={submission.youtube_link} target="_blank"> 
                    {submission.youtube_link} 
                </Link>
            </Space>
            <Space>
                <Title level={5}>Log Book Link</Title>
                <Link href={submission.log_book_link} target="_blank"> 
                    {submission.log_book_link} 
                </Link>
            </Space>  
        </Flex>
        
    )
}