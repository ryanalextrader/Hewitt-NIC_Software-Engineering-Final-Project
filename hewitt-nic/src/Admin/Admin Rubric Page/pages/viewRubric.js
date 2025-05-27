import React, { useState, useEffect } from 'react';
import { Space, Table, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import api from '../../../api';

const ViewRubric = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // function to handle deletion of rubric in memory as well as in database
  const handleDelete = async (id) => {
    setData(prevData => prevData.filter(item => item.id !== id));
    await api.delete(`api/rubric/delete/${id}/`)
  };

  // get all rubric info that exists in the database 
  const getRubrics = async () =>{
    const res = await api.get("api/rubric/");
    setData(res.data)
  }

  // function handle creation of a new rubric (creates a new rubric in backend)
  const handleCreateRubric = async () => {
    const res = await api.post("api/rubric/");
    console.log(res.data)
    navigate('edit', {state:{id:res.data.id}})
  }

  // upon first rendering this rubric, get all rubric data from the backend
  useEffect(() => {
    getRubrics()
  }, [])

  const columns = [
    {
      title: 'Title',
      dataIndex: 'name',
      key: 'title',
      render: text => <div>{text}</div>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to="preview" state ={{id: record.id}}>
            <Button>Preview</Button>
          </Link>
          <Link to="edit" state ={{id: record.id}}>
            <Button>Edit</Button>
          </Link>
          <Button onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Button type="primary" onClick={handleCreateRubric}>Create New Rubric</Button>
      </div>
      <div style={{ paddingTop: 12, paddingBottom: 12 }}>
        <Table columns={columns} dataSource={data} rowKey="id" />
      </div>
    </>
  );
};

export default ViewRubric;