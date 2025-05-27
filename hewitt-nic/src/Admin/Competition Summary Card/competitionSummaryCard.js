import { Button, Card, Divider, Space, Tooltip, Typography } from "antd";

import compSummaryStyles from "./competitionSummaryCardStyles";
import { Link } from "react-router";
import { useEffect } from "react";

const {Title, Text} = Typography;

// Cards to display on the main competition page
//  Used to display basic info and include management buttons
const CompSummaryCard = ({competition}) => {
    
    return (
        <Card 
            className="CompSummaryCard" 
            title={
                // <Title level={4}>{competition.name}</Title>
                <Tooltip
                    title={competition.name}
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
                        {competition.name}
                    </Title>
                </Tooltip>
            } 
            extra={
                <Link to="/user/admin/competition-edit" state={{id: competition.id}}>
                    <Button size="large" type="default">Manage</Button>
                </Link>
            }
            style={compSummaryStyles.card}
        >
            <Space className="CompSummaryContent" align="center" split={
                <Divider type="Horizontal"></Divider>
            }>
                <Space direction="vertical" align="start">
                    <Text>{"Participant Due Date: " + competition.submission_due_date}</Text>
                    <Text>{"Judge Due Date: " + competition.feedback_due_date}</Text>
                </Space>
            </Space>
        </Card>
    )
}


export {CompSummaryCard}