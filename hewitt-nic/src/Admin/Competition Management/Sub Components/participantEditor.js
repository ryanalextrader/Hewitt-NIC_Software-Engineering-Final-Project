import { Button, DatePicker, Flex, Form, Input, InputNumber, Modal, Pagination, Select, Space, Table, Typography, Upload } from "antd"
import { CloseCircleTwoTone, CheckCircleTwoTone, UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import api from "../../../api";
import { useForm } from "antd/es/form/Form";
import * as XLSX from 'xlsx'


const {Title, Text} = Typography

// Subcomponent for the competition editor page for group management 
//  Allows the user to approve/disapprove groups and import users
export const CompetitionParticipantEditor = ({comp, loadFunc}) => {

    // const importForm = useForm()

    // Store current groups and guardians
    const [curGroups, setCurGroups] = useState([])
    const [curGuards, setCurGuards] = useState([])

    const [loading, setLoading] = useState(true);

    // Control if modals for import and approval are open
    const [isApproveGroupsOpen, setIsApproveGroupsOpen] = useState(false)
    const [isImportGroupsOpen, setIsImportGroupsOpen] = useState(false)

    // Get each of the group's competitions (both approved and not )
    const getGroups = async () => {
        // setLoading(true)

        try {
            const getRes = await api.get(`/api/groups/competition/${comp.id}/`)

            console.log(getRes)

            setCurGroups(getRes.data)

        } catch (error) {
            console.log(error)
        }

        // setLoading(false)
    }

    // Returns all guardian type users
    //  Used in the import functionality 
    const getGuardians = async () => {
        try {
            const getRes = await api.get(`/api/users/3/`)

            console.log(getRes)

            setCurGuards(getRes.data)

        } catch (error) {
            console.log(error)
        }
    }

    // Single handler function to async handle data calls
    const getData = async () => {
        setLoading(true)
        await getGuardians()
        await getGroups()
        setLoading(false)
    }

    // Get data on component rendering
    useEffect(() => {
        console.log(comp)
        getData()
    }, [])

    // Got nested table info from https://ant.design/components/table#table-demo-nested-table
    // Top-level table columns for group/guardian info
    const group_columns = [
        {
            title: 'Project Title',
            key: 'project_title',
            render: (_, group) => (group.project_title)
        },
        {
            title: 'Guardian First Name',
            key: 'gfirstname',
            render: (_, group) => (group.user.firstname)
        },
        {
            title: 'Guardian Family Name',
            key: 'gfamilyname',
            render: (_, group) => (group.user.familyname)
        },
        {
            title: 'Guardian Email',
            key: 'g_email',
            render: (_, group) => (group.user.email)
        },
        {
            title: 'Guardian Program',
            key: 'g_program',
            render: (_, group) => (group.user.program)
        },
        {
            title: 'Participants',
            key: 'participants',
            render: (_, group) => (group.group_participants.length)
        },
        {
            title: '',
            key: 'add',
            render: (_, group) => (
                <div>
                    {
                        group.approved && 
                        <Space vertical={true}>
                            <Button
                                onClick={() => {changeGroupApproval(group, false)}}
                            >
                                Disapprove
                            </Button>
                            <Button 
                                danger
                                onClick={() => {deleteGroup(group)}}
                            >
                                Delete
                            </Button>
                        </Space> 
                    }
                    {
                        !group.approved && 
                        <Space vertical={true}>
                            <Button
                                onClick={() => {changeGroupApproval(group, true)}}
                            >
                                Approve
                            </Button>
                            <Button 
                                danger
                                onClick={() => {deleteGroup(group)}}
                            >
                                Delete
                            </Button>
                        </Space> 
                    }
                </div>
                  
            )
            
        }
    ]

    // Sub-table columns that hold info on each participant
    const participant_columns = [
        {
            title: 'First Name',
            key: 'firstname',
            render: (_, participant) => (participant.firstname)
        },
        {
            title: 'Family Name',
            key: 'familyname',
            render: (_, participant) => (participant.familyname)
        },
        {
            title: 'Pronouns',
            key: 'pronouns',
            render: (_, participant) => (participant.pronouns)
        },
        {
            title: 'Grade',
            key: 'grade',
            render: (_, participant) => (participant.grade)
        },
        {
            title: 'Age',
            key: 'age',
            render: (_, participant) => (participant.age)
        },
        {
            title: 'School',
            key: 'school',
            render: (_, participant) => (participant.school)
        },
        {
            title: 'Address',
            key: 'address',
            render: (_, participant) => (participant.address)
        },
    ]

    // Handles rendering participant subtables
    const renderParticipantRows = (group) => {
        // console.log(index, comp.comp_groups[index]);
        return <Table 
            columns={participant_columns} 
            dataSource={group.group_participants} 
            pagination={false} 
            size="small"
            rowKey={"id"}
            />
    }

    // Handles opening and parsing the group's import csv
    const handleImportParsing = async (inputs) => {
        const file = inputs.sel_file[0].originFileObj;

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const groupData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

                let groups = [];
                let curGroup = -1;

                // The parser expects a group title and rows for each participant below it
                for (let row = 0; row < groupData.length; row++) {
                    let thisRow = groupData[row];

                    // Get new group
                    if (thisRow[0] === "Project Title:") {
                        curGroup++;
                        groups.push({
                            title: thisRow[1],
                            participants: []
                        });
                    // Get new participant for group
                    } else if (thisRow[0] !== "Participant First Name" && thisRow[0] !== "") {
                        groups[curGroup].participants.push({
                            firstname: thisRow[0],
                            familyname: thisRow[1],
                            pronouns: thisRow[2],
                            age: thisRow[3],
                            grade: thisRow[4],
                            school: thisRow[5],
                            address: thisRow[6],
                        });
                    }
                }

                try {
                    await handleGroupImportCreation(groups, inputs.sel_guardian);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            };

            reader.onerror = (err) => reject(err);

            // Call the above parse onload event for the passed in csv or xlsx 
            reader.readAsArrayBuffer(file);
        });
    }


    // Handles backend creation calls for group imports
    const handleGroupImportCreation = async (groups, guardian) => {

        console.log(groups)
        console.log(guardian)

        for (const group of groups) {
            try {
                // Handle each group creation
                console.log(group)

                // Create group
                let groupRes = await api.post("/api/groups/create/", {
                    "comp": comp.id,
                    "user": guardian,
                    "project_title": group.title,
                    "approved": true
                })

                console.log(groupRes.data)

                // Create participants
                group.participants.map(async(participant) => {
                    console.log(participant)

                    await api.post("/api/participants/", {
                        "firstname": participant.firstname,
                        "familyname": participant.familyname,
                        "pronouns": participant.pronouns,
                        "grade": participant.grade,
                        "age": participant.age,
                        "school": participant.school,
                        "address": participant.address,
                        "group": groupRes.data.id
                    }).then((res) => {
                        console.log(res)
                    })
                })
            } catch (error) {
                console.log("Group Creation Error: " + error)
                throw error;
                // alert("Group Creation Error: " + error)
            }
        }
        
    }

    // Top-level handler for group imports, imports and stores groups then calls database again to update frontend 
    const handleGroupImport = async (inputs) => {
        setLoading(true)
        try {
            await handleImportParsing(inputs);
            await getGroups();
        } catch (err) {
            console.error("Import failed", err);
            alert("Import failed: " + err.message);
        }
        setIsImportGroupsOpen(false)
        setLoading(false)
    }

    // Handler for changing group approval status
    const changeGroupApproval = async (group, approved) => {
        try {
            await api.put(`/api/groups/update/${group.id}/`, {
                "approved": approved,
            })

            getGroups()
        } catch (error) {
            console.log(error)
            alert(error)
        }
    }

    // Handler for deleting groups
    const deleteGroup = async (group) => {
        try {
            await api.delete(`/api/groups/update/${group.id}/`)

            getGroups()
        } catch (error) {
            console.log(error)
            alert(error)
        }
    }

    if (loading) return <Text>Loading...</Text>

    return (
        <div style={{ padding: 20 }}>
            <Modal
                open={isApproveGroupsOpen}
                onCancel={() => {setIsApproveGroupsOpen(false)}}
                title="Approve Groups"
                footer={null}
                width={"70%"}
            >
                <Table 
                    columns={group_columns} 
                    expandable={{ rowExpandable: (record) => true, 
                        expandedRowRender: renderParticipantRows}}
                    dataSource={curGroups.filter((group)=>{return group.approved==false})} 
                    rowKey={"id"}
                />
            </Modal>

            <Modal
                open={isImportGroupsOpen}
                onCancel={() => {setIsImportGroupsOpen(false)}}
                title="Import Groups"
                footer={null}
                width={"70%"}
            >
                <Form
                    name="group_import"
                    onFinish={(inputs) => {handleGroupImport(inputs)}}
                >
                    <Form.Item
                        name="sel_guardian"
                        label="Guardian"
                        rules={[{ required: true }]}
                    >
                        <Select 
                            options={
                                       curGuards.map((guardian) => {
                                            return {
                                                value: guardian.id,
                                                label: guardian.firstname + " " + guardian.familyname,
                                            }
                                        })
                                    }
                        />
                    </Form.Item>
                    <Form.Item
                        name="sel_file"
                        label="Group File"
                        valuePropName="fileList"
                        getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
                        rules={[{ required: true }]}
                    >
                        <Upload beforeUpload={() => false} accept=".csv,.xlsx">
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </Upload>
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
                        
            <Flex vertical={true}>
                
                <Flex justify="space-between" align="center">
                    <Title>Manage Competition Participants</Title>
                    <Space>
                        <Button
                            size="large"
                            variant="primary"
                            onClick={() => {setIsApproveGroupsOpen(true)}}
                        >
                            Approve Groups
                        </Button>
                        <Button
                            size="large"
                            variant="primary"
                            onClick={() => {setIsImportGroupsOpen(true)}}
                        >
                            Import Groups
                        </Button>
                    </Space>
                </Flex>
                <Space direction="vertical">
                    <Table 
                        columns={group_columns} 
                        expandable={{ rowExpandable: (record) => true, 
                            expandedRowRender: renderParticipantRows}}
                        dataSource={curGroups.filter((group)=>{return (group.approved==true)})} 
                        rowKey={"id"}
                    />
                </Space>
            </Flex> 
            
        </div>
        
    )
}