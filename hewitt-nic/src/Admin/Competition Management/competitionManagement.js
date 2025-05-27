import { Button, DatePicker, Flex, Form, Input, Layout, Modal, Space, Tabs, Typography } from "antd"
import { Content, Header } from "antd/es/layout/layout"
import { useEffect, useState } from "react"
import competitionManagementStyles from "./competitionManagementStyles"
import api from "../../api";
import Item from "antd/es/list/Item";
import dayjs, { Dayjs } from "dayjs";
import { Link } from "react-router";
import { CompSummaryCard } from "../Competition Summary Card/competitionSummaryCard";

const { Title, Text } = Typography

// Admin home/main competition management page
const CompetitionManagement = () => {

    // Competition types
    const labels = ["Ongoing", "Upcoming", "Ended"]

    // Stores the active competitions based on the status (ongoing/upcoming/ended)
    const [selComps, setSelComps] = useState([]);
    const [curLabel, setCurLabel] = useState(labels[0]);
    
    // Competition creation modal open toggle
    const [isCreateCompOpen, setIsCreateCompOpen] = useState(false);
    
    // Handles getting competitions based on selected state
    const getComps = async () => {
       try {
            await api.get(`/api/competitions/state/${curLabel}/`).then((res) => {
                setSelComps(res.data);
            })
        } catch(error){
            alert(error)
            setSelComps([])
        } 
    };

    // Gets new competitions whenever the label tabs are changed
    useEffect(() => {
        getComps()
    }, [curLabel])
    
    // Competition creation handler from modal form
    const handleCompCreate = async (inputs) => {

        api.post("/api/competitions/create/", {
            "name": inputs.competitionName, 
            "start_date": inputs.startDate.format('YYYY-MM-DD'), 
            "submission_due_date": inputs.submissionEndDate.format('YYYY-MM-DD'), 
            "feedback_due_date": inputs.feedbackEndDate.format('YYYY-MM-DD')
        }).then((res) => {
            if(res.status === 201) alert("Competition created!");
            else alert("Failed to make competition.")
            
            if (curLabel == "Upcoming") {
                getComps()
            }

        }).catch((err) => alert(err))

        setIsCreateCompOpen(false)
    }

    return (
        <Layout>
            <Header style={competitionManagementStyles.header}>
                <Flex justify="space-between" align="center">
                    <Title>
                        Manage Competitions
                    </Title>
                    <Button 
                        size="large" type="primary"
                        onClick={() => {setIsCreateCompOpen(true)}}
                    >
                        Add New Competition
                    </Button>
                </Flex>
                <Modal
                    title="Add Competition"
                    open={isCreateCompOpen}
                    // onOk={handleCompCreate}
                    onCancel={() => {setIsCreateCompOpen(false)}}
                    footer = {null}
                >
                    <Form
                        name="Competition Creator"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        onFinish={handleCompCreate}
                    >
                        <Form.Item
                            label="Competition Name"
                            name="competitionName"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Start Date"
                            name="startDate"
                        >
                            <DatePicker></DatePicker>
                        </Form.Item>
                        <Form.Item
                            label="Submission End Date"
                            name="submissionEndDate"
                        >
                            <DatePicker></DatePicker>
                        </Form.Item>
                        <Form.Item
                            label="Feedback Due Date"
                            name="feedbackEndDate"
                        >
                            <DatePicker></DatePicker>
                        </Form.Item>
                        <Form.Item label={null}>
                            <Button 
                                type="primary" htmlType="submit"
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </Header>
            <Content style={competitionManagementStyles.body}>
                <Tabs
                    defaultActiveKey="1"
                    centered
                    size="large"
                    items={
                        Array.from({length: 3}).map((_, i) => {
                            const id = String(i + 1);
                            return {
                                label: `${labels[i]} Competitions`,
                                key: id,
                            }
                        })
                    }
                    onTabClick={(key) => {
                        setCurLabel(labels[key-1])
                        // setSelComps(getDummyCompsByStatus(labels[key-1]))
                    }}
                />
                <Space 
                    direction="horizontal" wrap={true} size="middle"
                    style={{
                        justifyContent: "left",
                        width: "100%",
                        padding: 20
                    }}
                 >
                    {selComps &&
                        selComps.map((comp) => {
                            return (
                                <CompSummaryCard competition={comp} /> 
                        )
                        })
                    }
                </Space>
                
            </Content>
        </Layout>
    )
}

export default CompetitionManagement