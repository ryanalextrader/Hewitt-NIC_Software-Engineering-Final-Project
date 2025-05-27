import { Button, Flex, Layout, Space, Tabs, Typography } from "antd"
import { lazy, useEffect, useState } from "react";
import api from "../../api"
import { PieChart, Pie, ResponsiveContainer, BarChart, Bar, Tooltip, XAxis, YAxis, LabelList, Cell, Legend } from 'recharts';
import { Color } from "antd/es/color-picker";
import chartStyles from "./chartStyles";


// To make this file work npm install react-dnd-html5-backend.
// Want to creat new charts? Here is the documentation https://recharts.org/en-US/api
// Then make a function that returns the chart you want to make.

// Need to go to hewitt-nic\django_backend\backend\api\views.py folder
// In that fodler you need to add django queries that will return jason response in the 
// format of data [{key: value}, {key: value}]




const { Title } = Typography

const Colors = ["#8ECAE6", "#219EBC", "#023047"]
const MyPie = ({ data, dataKey, nameKey }) => {
    if (!data || data.length === 0) return <p>No data available</p>;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={data} dataKey={dataKey} nameKey={nameKey} fill="#8874d8" cx="50%" cy="50%" labelLine={false} label>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={Colors[index % Colors.length]} />
                    ))}
                </Pie>
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    )
}


const MyBar = ({ data, dataKey, nameKey }) => {
    if (!data || data.length === 0) return <p>No data available</p>;
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart width={730} height={250} data={data} >
                <XAxis dataKey={dataKey} />
                <YAxis dataKey={nameKey} allowDecimals={false} />
                <Tooltip />
                <Bar data={data} dataKey="amount" fill="#219EBC">
                    <LabelList dataKey="amount" position="top" />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}

const url = "http://127.0.0.1:8000";

const Chart = () => {
    const [dataS, setStates] = useState([])
    const [dataP, setPronouns] = useState([])
    const [dataG, setGrades] = useState([])
    const [dataPG, setProgrmas] = useState([])

    const loadPronouns = async () => {
        await api.get(url + `/api/pronoun-amount/`).then((res) => {
            setPronouns(res.data);
            // console.log("LOADED Pronouns", res)
        }).catch((err) => {
            console.error("Error loading pronouns:", err);
            alert("Error loading pronouns:", err)
            setPronouns(null);
        })
    };

    const loadStates = async () => {
        await api.get(url + `/api/states-amount/`).then((res) => {
            setStates(res.data);
            // console.log("LOADED States", res)
        }).catch((err) => {
            console.error("Error loading states:", err);
            alert("Error loading states:", err)
            setStates(null);
        })

    };

    const loadGrades = async () => {
        await api.get(url + `/api/grades-amount/`).then((res) => {
            setGrades(res.data);
            // console.log("LOADED Grades", res)
        }).catch((err) => {
            console.error("Error loading grades:", err);
            alert("Error loading grades:", err)
            setGrades(null);
        })
    }

    const loadProgrmas = async () => {
        await api.get(url + `/api/program-amount/`).then((res) => {
            setProgrmas(res.data);
            // console.log("LOADED Grades", res)
        }).catch((err) => {
            console.error("Error loading grades:", err);
            alert("Error loading grades:", err)
            setProgrmas(null);
        })
    }


    useEffect(() => {
        loadPronouns()
        loadStates()
        loadGrades()
        loadProgrmas()
    }, [])


    // const dataP = [
    //     { "pronouns": 'Other', "amount": 10 },
    //     { "pronouns": 'She/Her', "amount": 20 },
    //     { "pronouns": 'He/Him', "amount": 90 },
    // ];

    // const dataS = [
    //     { state: 'WA', amount: 10 },
    //     { state: 'WA', amount: 20 },
    //     { state: 'WA', amount: 90 },
    //     { state: 'OR', amount: 5 },
    //     { state: 'OR', amount: 15 },
    //     { state: 'OR', amount: 40 },
    // ];

    return (
        <Space direction="vertical" className="mainAdminHome" style={chartStyles.main}>
            <div style={{ position: "absolute", top: "50px", left: "1000px", width: "500px", height: "000px" }}>
                <h1>Pronouns</h1>
                <MyPie data={dataP} dataKey="amount" nameKey="pronouns" />
            </div>
            <div style={{ position: "absolute", top: "50px", left: "100px", width: "600px", height: "200px" }}>
                <h1>State</h1>
                <MyBar data={dataS} dataKey="state" nameKey="amount" />
            </div>
            <div style={{ position: "absolute", top: "50px", right: "100px", width: "600px", height: "200px" }}>
                <h1>Grades</h1>
                <MyBar data={dataG} dataKey="grade" nameKey="amount" />
            </div>
            <div style={{ position: "absolute", top: "600px", left: "100px", width: "600px", height: "200px" }}>
                <h1>Programs</h1>
                <MyBar data={dataPG} dataKey="program" nameKey="amount" />
            </div>

        </Space>
    );
}

export default Chart;