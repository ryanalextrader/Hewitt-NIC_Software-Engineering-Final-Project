import "./judgeHome.css";
import { useEffect, useState } from "react";
import { Input, Modal, Space, Table, Typography, Tabs, Button } from "antd";
import judgeHomeStyles from "./judgeHomeStyles";
import api from "../api";

const { TextArea } = Input;

const JudgeHome = () => {
    const labels = ["Ungraded", "Graded"];
    const [selSubs, setSelSubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selComps, setSelComps] = useState([]);
    const [curSubmissons, setCurSubmissions] = useState([]);
    const [modalDetailsVisible, setModalDetailsVisible] = useState(false);
    const [modalFeedbackVisible, setModalFeedbackVisible] = useState(false);
    const [activeSubmission, setActiveSubmission] = useState(null);
    const [feedbackText, setFeedbackText] = useState("");

    const [gradedSubs, setGradedSubs] = useState([]);
    const [ungradedSubs, setUngradedSubs] = useState([]);

  
    const getComps = async () => {
      try {
        const res = await api.get(`/api/competitions/state/Ongoing/`);
        setSelComps(res.data);
        
      } catch (error) {
        alert("Error fetching competitions");
        console.error(error);
        setSelComps([]);
      }
    };
  
    useEffect(() => {
      getComps();
    }, []);

    const getSubmissions = async (competitions) => {
        try {
          const subResList = await Promise.all(
            competitions.map((comp) =>
              api.get(`/api/submissions/by_competition/${comp.id}/`)
            )
          );
      
          // Combine all submissions into one list
          const allSubs = subResList.flatMap((res) => res.data);
          setCurSubmissions(allSubs);
        } catch (error) {
          console.error("Error loading submissions:", error);
          alert("Error loading submissions: " + error);
          setCurSubmissions([]);
        }
      };

    useEffect(() => {
        if (selComps.length > 0) {
          console.log(selComps);
          getSubmissions(selComps);
        }
      }, [selComps]);

      useEffect(() => {
        console.log("Updated Submissions:", curSubmissons);
      }, [curSubmissons]);

      useEffect(() => {
        const graded = curSubmissons.filter(sub => sub.submission_feedback.length > 0);
        const ungraded = curSubmissons.filter(sub => sub.submission_feedback.length === 0);
      
        setGradedSubs(graded);
        setUngradedSubs(ungraded);
      
        // Show ungraded by default
        setSelSubs(ungraded);
      }, [curSubmissons]);

    const submitFeedback = async () => {
        if (!activeSubmission || !feedbackText.trim()) return;
    
        try {

        // add protection against multiple saves of feedback

        const res = await api.post(`/api/feedback/`, {
            submission: activeSubmission.id,
            judge: 0, // need to update later
            text_feedback: feedbackText,
            box_checked: false,
            approved: false,
        });
    
        const newFeedback = res.data;
    
        setCurSubmissions((prevSubs) =>
            prevSubs.map((sub) =>
            sub.id === activeSubmission.id
                ? {
                    ...sub,
                    submission_feedback: [newFeedback], // Replace with new only
                }
                : sub
            )
        );
    
        setModalFeedbackVisible(false);
        setFeedbackText("");
    
    } catch (error) {
        console.error("Failed to submit feedback:", error);
        alert("Error updating feedback.");
    }
    };
      


      const columns = [
        {
          title: 'Project Title',
          key: 'project_title',
          render: (_, submission) => (
            <span>{submission.group?.project_title || 'Untitled'}</span>
          ),
        },
        {
          title: 'Action',
          key: 'action',
          render: (_, submission) => (
            <Space size="middle">
                <a onClick={() => {
                    setActiveSubmission(submission);
                    setModalDetailsVisible(true);
                }}>Show More</a>
                <a onClick={() => {
                setActiveSubmission(submission);
                setFeedbackText(""); // Reset input
                setModalFeedbackVisible(true);
                }}>
                Submit Feedback
                </a>
            </Space>
          ),
        },
      ];

      
    return (
        <Space direction="vertical" className="mainJudgeHome" wrap style={judgeHomeStyles.main}>
            <Tabs 
            defaultActiveKey="1"
            centered
            size="large"
            items={labels.map((label, i) => ({
                label: `${label} Submissions`,
                key: String(i + 1),
            }))}
            onTabClick={(key) => {
                const index = parseInt(key, 10);
                if (labels[index - 1] === "Graded") {
                setSelSubs(gradedSubs);
                } else {
                setSelSubs(ungradedSubs);
                }
            }}
            />

            <div style={{ width: '100%', padding: '0 40px', maxWidth: '1400px', margin: '0 auto' }}>
                <Table 
                    columns={columns} 
                    dataSource={selSubs} 
                    rowKey={(record) => record.id}
                />
                <Modal
                    title="Submission Feedback"
                    open={modalFeedbackVisible}
                    onCancel={() => setModalFeedbackVisible(false)}
                    footer={[
                        <Button key="submit" type="primary">
                        Save and Close
                        </Button>,
                    ]}
                    >
                    <TextArea
                        rows={4}
                        placeholder="Enter feedback here..."
                        maxLength={255}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                    />
                </Modal>
                <Modal
                    title="Submission Details"
                    open={modalDetailsVisible}
                    onCancel={() => setModalDetailsVisible(false)}
                    footer={null}
                    >
                    {activeSubmission && (
                        <div>
                        <p><strong>Project Title:</strong> {activeSubmission.group?.project_title}</p>
                        <p><strong>Problem Solved:</strong> {activeSubmission.problem_solved}</p>
                        <p>
                        <strong>Presentation Link:</strong>{" "}
                        <a href={activeSubmission.presentation_link} target="_blank" rel="noreferrer">
                            {activeSubmission.presentation_link}
                        </a>
                        </p>

                        <p>
                        <strong>YouTube Link:</strong>{" "}
                        <a href={activeSubmission.youtube_link} target="_blank" rel="noreferrer">
                            {activeSubmission.youtube_link}
                        </a>
                        </p>

                        <p>
                        <strong>Logbook Link:</strong>{" "}
                        <a href={activeSubmission.log_book_link} target="_blank" rel="noreferrer">
                            {activeSubmission.log_book_link}
                        </a>
                        </p>
                        </div>
                    )}
                </Modal>
            </div>
         
        </Space>
    );
};

export default JudgeHome;