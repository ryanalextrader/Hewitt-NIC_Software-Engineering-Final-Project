import { Button, DatePicker, Flex, Form, Grid, Input, InputNumber, Select, Space, Statistic, Switch, Table, Typography } from "antd"
import { useEffect, useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import api from "../../../api"
import { Link, Navigate } from "react-router"

const {Title, Text} = Typography


// This component is one sub-component used in the admin competition editor page
//  It is responsible for holding a form that allows the user to edit basic competition details & showing basic stats
export const CompetitionInfoEditor = ({comp, setComp, loading, setLoading, rubricList, loadFunc}) => {

    // Got this hook from https://stackoverflow.com/questions/53919499/clear-form-input-field-values-after-submitting-in-react-js-with-ant-design
    const [form] = Form.useForm();

    // Enable for the basic editor form
    const [editEnabled, setEditEnabled] = useState(false)

    useEffect(() => {
        // Reset the info editor form to match current competition values when the page is loaded
        form.resetFields()
    }, [])

    // handler for the edit info button to enable/disable the editor and reset the information
    const resetForm = () => {
        // Enable/disable form 
        setEditEnabled(!editEnabled)

        // Reset values
        form.resetFields()
    }

    // Handler for when the user updates the competition info from the form
    const updateCompInfo = async (inputs) => {
        // Loading status 
        setLoading(true)

        // Make sure the edit form is disabled
        setEditEnabled(false)

        // make the put request
        await api.put(`/api/competitions/update/${comp.id}/`, {
            "name": inputs.competitionName,
            "start_date": inputs.startDate.format('YYYY-MM-DD'), 
            "submission_due_date": inputs.submissionEndDate.format('YYYY-MM-DD'), 
            "feedback_due_date": inputs.feedbackEndDate.format('YYYY-MM-DD'), 
            "competition_state": inputs.competitionState, 
            "submission_active": inputs.submissionsActive, 
            "feedback_active": inputs.feedbackActive, 
            "rubric": inputs.rubric.id,
        }).then((res) => {
            console.log(res)
        }).catch((err) => alert(err))

        await loadFunc()

        setLoading(false)
    }

    // Handler for the delete competition button
    const deleteComp = async () => {
        api.delete(`/api/competitions/delete/${comp.id}/`, {"id": comp.id}).then(() => {
            alert(`Competition ${comp.name} deleted`)
        }).catch((err) => alert(err))
    }

    return (
            <Flex justify="space-around">
                <Flex vertical={true} align="left" style={{width: "40%", margin: "10px"}}>
                    <Space>
                        <Title>
                            Basic Info
                        </Title>
                        <Button
                        onClick={resetForm}
                        >
                            Edit
                        </Button>
                    </Space>
                    <Form
                    name="Competition Info"
                    form={form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{
                        'competitionName': comp.name,
                        'startDate': dayjs(comp.start_date),
                        'submissionEndDate': dayjs(comp.submission_due_date),
                        'feedbackEndDate': dayjs(comp.feedback_due_date),
                        'rubric': comp.rubric ? 
                            {
                                value: comp.rubric.id,
                                label: comp.rubric.name,
                            } : {
                                value: null,
                                label: "None",
                            },
                        'competitionState': comp.competition_state,
                        'submissionsActive': comp.submission_active,
                        'feedbackActive': comp.feedback_active

                    }}
                    disabled={!editEnabled}
                    onFinish={updateCompInfo}
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

                        <Form.Item
                            label="Rubric"
                            name="rubric"
                        >
                            <Select
                                style={{ width: 120 }}
                                options={[
                                       ...rubricList.map((rubric) => {
                                            return {
                                                value: rubric.id,
                                                label: rubric.name,
                                            }
                                        }),
                                        {
                                            value: null,
                                            label: "None",
                                        } 
                                    ]}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Competition State"
                            name="competitionState"
                        >
                            <Select
                                style={{ width: 120 }}
                                options={[
                                { value: 'Upcoming', label: 'Upcoming' },
                                { value: 'Ongoing', label: 'Ongoing' },
                                { value: 'Ended', label: 'Ended' },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Submissions: "
                            name="submissionsActive"
                        >
                            <Switch 
                                size="large"
                                unCheckedChildren={<Text>Disabled</Text>}
                                checkedChildren={<Text>Enabled</Text>}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Feedback: "
                            name="feedbackActive"
                        >
                            <Switch 
                                size="large"
                                unCheckedChildren={<Text>Disabled</Text>}
                                checkedChildren={<Text>Enabled</Text>}
                            />
                        </Form.Item>

                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                    <Space align="center">
                        <Link to={"/admin"}>
                            <Button danger onClick={deleteComp}>
                                Delete Competition
                            </Button>
                        </Link>
                    </Space>
                </Flex>
                <Flex vertical={true} align="left" style={{width: "40%", margin: "10px"}}>
                    <Title>Competition Stats</Title>
                    <Statistic title="Participants" value={127} />
                    <Statistic title="Judges" value={35} />
                    <Statistic title="Submission Count" value={89} />
                    <Statistic title="Feedback Count" value={140} />
                    <Statistic title="Percent Submitted" value={70} suffix="%" />
                    <Statistic title="Percent Submissions Graded" value={68} suffix="%" />
                </Flex>
            </Flex>
    )
}