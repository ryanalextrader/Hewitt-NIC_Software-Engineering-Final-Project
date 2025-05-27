import "./guardianHome.css";
import { GroupInfoCard } from "../Group Info Card/groupInfoCard";
import { useEffect, useReducer, useState } from "react";
import { Button, Divider, Flex, Layout, Space, Tabs, Typography } from "antd";
import GuardianHomeStyles from "./guardianHomeHomeStyles";
import { Content, Header } from "antd/es/layout/layout";
import api from "../../api";
import GroupCreation from "./Group Creation/groupCreation";
import { getUserID } from "../../utility";

const { Title } = Typography

// Home page component for the guardian
//  Shows group info cards for each competition state and includes group creation button
const GuardianHome = () => {

    // Comp status labels
    const labels = ["Ongoing", "Upcoming", "Ended"]
    const [curLabel, setCurLabel] = useState(labels[0]);
    
    // Store selected groups based on selected comp status
    const [selGroups, setSelGroups] = useState([]);
    // Store upcoming comps for group creation
    const [openComps, setOpenComps] = useState([]);

    // Toggle for viewing group creation modal
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

    // Handles getting groups based on comp state
    const getGroups = async () => {
        try {
            await api.get(`/api/groups/${curLabel}/`).then((res) => {
                setSelGroups(res.data)
            })
        } catch(error){
            alert(error)
            setSelGroups([])
        } 
    }

    // Handler to get upcoming competitions
    const getComps = async () => {
        // console.log(`Getting upcoming comps`)
        try {
            await api.get(`/api/competitions/state/upcoming/`).then((res) => {
                // console.log(res.data)
                setOpenComps(res.data)
            })
        } catch(error){
            alert(error)
            setOpenComps([])
        } 
    }

    // Get new set of groups whenever the selected type is changed
    useEffect(() => {
        getGroups()
    }, [curLabel])

    // Load upcoming competitions on page load
    useEffect(() => {
        getComps()
    }, [])

    // Handles creating new participant
    const handleParticipantCreate = async (participant, groupID) => {
        console.log("Participant Create Inputs: ")
        console.log(participant, groupID)

        try {
            await api.post("/api/participants/", {
                "firstname": participant.firstname,
                "familyname": participant.familyname,
                "pronouns": participant.pronouns,
                "grade": participant.grade,
                "age": participant.age,
                "school": participant.school,
                "address": participant.address,
                "group": groupID
            }).then((res) => {
                console.log(res)
            })
        } catch (error) {
            alert("Participant Creation Error: " + error)
        }
    }

    // Handles overall process of creating a group (with all participants)
    const handleGroupCreate = async (inputs) => {

        // Prevent participant-less groups
        if (!inputs.participants) {
            alert("No participants specified!")
            return false
        }

        setIsCreateGroupOpen(false)

        let curUser = await getUserID()

        console.log("Group Create Inputs: ")
        console.log(inputs)
        let groupRes;
        // Create group
        try {
            await api.post("/api/groups/create/", {
                "comp": inputs.sel_comp,
                "user": curUser.auth_user.id,
                "project_title": inputs.group_title
            }).then((res) => {
                console.log("Group Create Res: ")
                console.log(res)
                groupRes = res.data
            })
        } catch(error){
            alert("Group Creation Error: " + error)
        } 

        inputs.participants.map(async (participant) => {
            await handleParticipantCreate(participant, groupRes.id)
        })

        // setCurLabel(labels[1])
        getGroups()
    }
  
    return (
        <Layout>
            <Header
                style={{height:"100px"}}
            >
                <Flex justify="space-between" align="center">
                    <Title>
                        See Your Groups
                    </Title>
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
                        }}
                    />
                    <Button 
                        size="large" type="primary"
                        onClick={() => {setIsCreateGroupOpen(true)}}
                    >
                        Sign Up New Groups
                    </Button>
                </Flex>
                
            </Header>
            <Content>
                <GroupCreation active={isCreateGroupOpen} setActive={setIsCreateGroupOpen} competitions={openComps} submitFunc={handleGroupCreate}/>
                <Space
                    direction="horizontal"
                    wrap={true}
                    size="middle"
                >
                    {selGroups && 
                     selGroups.map((group) => {
                        return <GroupInfoCard key={group.id} group={group} />
                     })
                    }
                </Space>
            </Content>
        </Layout>
    );
};

    export default GuardianHome;

