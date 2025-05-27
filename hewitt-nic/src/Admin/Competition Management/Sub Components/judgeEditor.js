import { Button, Flex, InputNumber, Modal, Space, Table, Tooltip, Typography } from "antd"
import { useEffect, useState } from "react"
import api from "../../../api";

const {Title, Text} = Typography

// Subcomponent of the competition management screen
//  Meant to allow judges to view and approve/disapprove judges
export const CompetitionJudgeEditor = ({comp, assignedJudges, unassignedJudges, loadJudges}) => {

    // Control whether to open judge approval modal
    const [isAddJudgeOpen, setIsAddJudgeOpen] = useState(false);

    useEffect(() => {
        console.log(assignedJudges, unassignedJudges)
    }, [])

    // Columns for the assigned judges basic info (adds grade assignments)
    const assignedColumns = [
        {
            title: 'First Name',
            key: 'firstname',
            render: (_, judge) => (judge.firstname)
        },
        {
            title: 'Family Name',
            key: 'familyname',
            render: (_, judge) => (judge.familyname)
        },
        {
            title: 'Email',
            key: 'email',
            render: (_, judge) => (judge.email)
        },
        {
            title: 'Phone',
            key: 'phone',
            render: (_, judge) => (judge.phonenumber)
        },
        {
            title: 'Program',
            key: 'program',
            render: (_, judge) => (judge.program)
        },
        {
            title: 'Assigned Grades',
            key: 'assignedGrades',
            render: (_, judge) => (
                <Flex vertical={true}>
                    <Space>
                        <Text>Max Grade</Text>
                        <InputNumber
                            defaultValue={judge.judge_info[0].max_grade_assigned} 
                            max={12}
                            min={0}
                        />
                    </Space>
                    <Space>
                        <Text>Min Grade</Text>
                        <InputNumber
                            defaultValue={judge.judge_info[0].min_grade_assigned} 
                            max={12}
                            min={0}
                        />
                    </Space>
                </Flex>
            )
        },
        {
            title: '',
            key: 'delete',
            render: (_, judge) => (
                <Button
                    onClick={() => {removeJudge(judge)}}
                >
                    Remove
                </Button>
            )
        }
    ]

    // Columns for the unassigned judges' basic info
    const unassignedColumns = [
        {
            title: 'First Name',
            key: 'firstname',
            render: (_, judge) => (judge.firstname)
        },
        {
            title: 'Family Name',
            key: 'familyname',
            render: (_, judge) => (judge.familyname)
        },
        {
            title: 'Email',
            key: 'email',
            render: (_, judge) => (judge.email)
        },
        {
            title: 'Phone',
            key: 'phone',
            render: (_, judge) => (judge.phonenumber)
        },
        {
            title: 'Program',
            key: 'program',
            render: (_, judge) => (judge.program)
        },
        {
            title: 'Competition Count',
            key: 'program',
            render: (_, judge) => (judge.judge_info.length)
        },
        {
            title: '',
            key: 'add',
            render: (_, judge) => (
                <Button
                    onClick={() => {addJudge(judge)}}
                >
                    Add
                </Button>
            )
        }
    ]

    // Columns for the info gather from the judges on signup
    const signup_info_columns = [
        {
            title: 'Organization',
            key: 'organization',
            render: (_, info) => (info.organization)
        },
        {
            title: 'Time Zone',
            key: 'timezone',
            render: (_, info) => (info.timezone)
        },
        {
            title: 'Round Type',
            key: 'round',
            render: (_, info) => (info.round)
        },
        {
            title: 'Pervious Experience?',
            key: 'experienced',
            render: (_, info) => (info.experienced ? "Yes" : "No")
        },
        {
            title: 'Conflict of Interest?',
            key: 'conflictOfInterest',
            render: (_, info) => (info.conflictofinterest)
        },
        {
            title: 'Accommodations',
            key: 'accommodations',
            ellipsis: {
                showTitle: false,
            },
            render: (_, info) => (
                <Tooltip placement="topLeft" title={info.accomodations}>
                    {info.accomodations}
                </Tooltip>
            ),
        },
        {
            title: 'Area of Expertise',
            key: 'expertise',
            render: (_, info) => (info.areaofexpertise)
        },
        {
            title: 'Innovation Experience',
            key: 'innovationExperience',
            ellipsis: {
                showTitle: false,
            },
            render: (_, info) => (
                <Tooltip placement="topLeft" title={info.innovationexperience}>
                    {info.innovationexperience}
                </Tooltip>
            ),
        },
        {
            title: 'Reason for Interest',
            key: 'interestreason',
            ellipsis: {
                showTitle: false,
            },
            render: (_, info) => (
                <Tooltip placement="topLeft" title={info.interestquery}>
                    {info.interestquery}
                </Tooltip>
            ),
        },
        {
            title: 'Reviewer Excitement',
            key: 'excitement',
            ellipsis: {
                showTitle: false,
            },
            render: (_, info) => (
                <Tooltip placement="topLeft" title={info.excitementquery}>
                    {info.excitementquery}
                </Tooltip>
            ),
        },
        {
            title: 'Discovered by',
            key: 'discovered',
            ellipsis: {
                showTitle: false,
            },
            render: (_, info) => (
                <Tooltip placement="topLeft" title={info.hearquery}>
                    {info.hearquery}
                </Tooltip>
            ),
        },
        {
            title: 'Questions for Admin',
            key: 'questions',
            ellipsis: {
                showTitle: false,
            },
            render: (_, info) => (
                <Tooltip placement="topLeft" title={info.questionsforus}>
                    {info.questionsforus}
                </Tooltip>
            ),
        },
    ]

    // Handles adding/approving a new judge 
    const addJudge = async (newJudge) => {
        api.post(`/api/judges/`, {
            "user": newJudge.id,
            "competition": comp.id,
            "min_grade_assigned": 0, 
            "max_grade_assigned": 12, 
            "time_zone": "Pacific"
        }).then((res) => {
            console.log(res)
            
            loadJudges()   
        }).catch((err) => alert("Error adding judge: ", err))
    }

    // Handles removing/disapproving a judge from a competition 
    const removeJudge = async (judge) => {
        api.delete(`/api/judges/edit/${judge.judge_info[0].id}/`, {
            "id": judge.id
        }).then((res) => {
            console.log(res)
            
            loadJudges()   
        }).catch((err) => alert("Error removing judge: ", err))
    }

    // Renders the judge's signup info in a subtable
    const renderJudgeSignupInfoRows = (judge) => {
        // console.log(index, comp.comp_groups[index]);
        return <Table 
            columns={signup_info_columns} 
            dataSource={judge.judge_signup_info} 
            pagination={false} 
            size="small"
            rowKey={"id"}
            // scroll={{ x: 'max-content' }}
            />
    }

    return (
        <div style={{ padding: 20 }}>
            <Modal
                open={isAddJudgeOpen}
                onCancel={() => {setIsAddJudgeOpen(false)}}
                title="Add Judges"
                footer={null}
                width="90%"
            >
                <Table 
                    columns={unassignedColumns}
                    expandable={{ rowExpandable: (record) => true, 
                            expandedRowRender: renderJudgeSignupInfoRows}}
                    dataSource={unassignedJudges}
                    // style={{width:"max-content"}}
                    size="small"
                    rowKey={"id"}
                />
            </Modal>
            <Flex vertical={true}>
                <Flex justify="space-between" align="center">
                    <Title>Manage Competition Judges</Title>
                    <Button
                        size="large"
                        variant="primary"
                        onClick={() => {setIsAddJudgeOpen(true)}}
                    >
                        Add Judges
                    </Button>
                </Flex>
                <Space direction="vertical">
                    <Table 
                        columns={assignedColumns} 
                        expandable={{ rowExpandable: (record) => true, 
                            expandedRowRender: renderJudgeSignupInfoRows}}
                        dataSource={assignedJudges} 
                        size="small"
                        rowKey={"id"}
                    />
                </Space>
            </Flex>
        </div>
        
    )
}