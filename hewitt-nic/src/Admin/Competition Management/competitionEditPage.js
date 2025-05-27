import { Button, Flex, Layout, Space, Tabs, Typography } from "antd"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router"
import { Content, Header } from "antd/es/layout/layout"
import { CompetitionInfoEditor } from "./Sub Components/basicInfoEditor"
import { CompetitionJudgeEditor } from "./Sub Components/judgeEditor"
import { CompetitionParticipantEditor } from "./Sub Components/participantEditor"
import { CompetitionFeedbackEditor } from "./Sub Components/feedbackApproval"
import api from "../../api"
import { ConsoleSqlOutlined } from "@ant-design/icons"

const { Title } = Typography

// Top-level competition editor page
// Preforms main backend calls and handles displaying correct subcomponents
const CompetitionEditor = () => {

    // Get the competition UID for getting the right comp
    const compUID = useLocation().state.id

    const [loading, setLoading] = useState(true)

    // Store this competition, available rubrics, and judges
    const [curComp, setCurComp] = useState(null)
    const [rubrics, setRubrics] = useState(null)
    const [assignedJudges, setAssignedJudges] = useState(null)
    const [unassignedJudges, setUnassignedJudges] = useState(null)

    // Store active tab to navigate subcomponents
    const [activeTabKey, setActiveTabKey] = useState("0");

    // Handles main competition loading call
    const loadComp = async () => {
        // Load competition info
        await api.get(`/api/competitions/idFull/${compUID}/`).then((res) => {
            setCurComp(res.data[0]);
            // setloading(false)
            // console.log("LOADED Competitions", res)
        }).catch((err) => {
            console.error("Error loading competition:", err);
            alert("Error loading competition:", err)
            setCurComp(null);
        })
    };

    // Handles loading available rubrics
    const loadRubric = async () => {
        // Load rubrics
        await api.get(`/api/rubric/`).then((res) => {
            setRubrics(res.data);
            // console.log("LOADED Rubrics", res)
        }).catch((err) => {
            console.error("Error loading rubrics:", err);
            alert("Error loading rubrics:", err)
            setRubrics(null);
        })
    }

    // Handles loading judges who are assigned and not assigned to the competition
    const loadJudges = async () => {
        // Load assigned judges
        await api.get(`/api/users/judges/in_compid/${compUID}/`).then((res) => {
            setAssignedJudges(res.data);
            // console.log("LOADED Assigned judges", res)
        }).catch((err) => {
            console.error("Error loading assigned judges:", err);
            alert("Error loading assigned judges:", err)
            setAssignedJudges(null);
        })

        // Load unassigned judges
        await api.get(`/api/users/judges/not_in_compid/${compUID}/`).then((res) => {
            setUnassignedJudges(res.data);
            // console.log("LOADED Assigned judges", res)
        }).catch((err) => {
            console.error("Error loading unassigned judges:", err);
            alert("Error loading unassigned judges:", err)
            setUnassignedJudges(null);
        })
    }
    
    // top-level handler for fetching data asynchronously 
    const loadData = async () => {
        setLoading(true)
        await loadComp()
        await loadRubric()
        await loadJudges()
        setLoading(false)
    }

    // Load data on the compUID changing (mostly when the page is loaded)
    useEffect(() => {
        if (compUID) {
            loadData()
        } else {
            setLoading(false);
            alert("No competition ID provided");
        }
    }, [compUID]);

    // Define subcomponent tabs
    const editOptions = [
        { label: "Basic Info", key: "0" },
        { label: "Edit Judges", key: "1" },
        { label: "Edit Participants", key: "2" },   
        { label: "Approve Feedback", key: "3" },
    ];

    // Function to render the appropriate component based on active tab
    const renderTabContent = () => {
        if (loading || !curComp) return null;
        
        switch(activeTabKey) {
            case "0":
                return <CompetitionInfoEditor comp={curComp} setComp={setCurComp} loading={loading} setLoading={setLoading} rubricList={rubrics} loadFunc={loadData}  />;
            case "1":
                return <CompetitionJudgeEditor comp={curComp} assignedJudges={assignedJudges} unassignedJudges={unassignedJudges} loadJudges={loadJudges}/>;
            case "2":
                return <CompetitionParticipantEditor comp={curComp} loadFunc={loadData} />;
            case "3":
                return <CompetitionFeedbackEditor comp={curComp} judges={assignedJudges} />;
            default:
                return <CompetitionInfoEditor comp={curComp} setComp={setCurComp} loading={loading} setLoading={setLoading} rubricList={rubrics}  />;
        }
    };

    if (loading) return <Title level={3}>Loading competition data...</Title>;
    
    if (!curComp) return <Title level={3}>Competition not found</Title>;

    return (
        <Layout>
            <Header
            style={{padding:25, height:"5%"}}>
                <Flex 
                    justify="space-between"
                    align="center"
                >
                    <Title style={{width: "33%"}}>
                        {curComp.name}
                    </Title>
                    <Tabs 
                        style={{width: "33%"}}
                        defaultActiveKey="0"
                        centered
                        size="large"
                        items={editOptions}
                        onChange={(key) => {
                            setActiveTabKey(key)
                        }}
                    />
                    <div
                    style={{width: "33%", justifyItems: "center"}}>
                        <Link to={"/user/admin"}>
                            <Button type="primary">
                                Go Back
                            </Button>
                        </Link>
                    </div>
                    
                </Flex>
                
            </Header>
            <Content>
                {renderTabContent()}
            </Content>
        </Layout>
    )
}

export default CompetitionEditor