import React, { useState, useEffect } from 'react';
import { DownOutlined, StarOutlined, EditOutlined, AlignLeftOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Space, Button, Dropdown, message, Flex, Input, Form, Modal } from "antd";
import { Link, useLocation } from 'react-router-dom';

import DragCardList from './dragCardList';
import api from '../../../api';

// This component acts as a form builder for rubrics where admins can add as many 
// scales, long answers, plain text, or catagories as they want
// This page will also load in previous data if the rubric is being edited or 
// initialize empty if a rubric is being created for the first time

// The options that appear in the menu when the admin wants to add a field to the rubric template
const items = [
  {
    label: 'Scale',
    key: 'scale',
    icon: <StarOutlined />,
  },
  {
    label: 'Long Answer',
    key: 'longAnswer',
    icon: <EditOutlined />,
  },
  {
    label: 'Text',
    key: 'text',
    icon: <AlignLeftOutlined />,
  },
  {
    label: 'Category',
    key: 'category',
    icon: <AppstoreOutlined />,
  },
];

const EditRubric = () => {

  const [entries, setEntries] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rubricData, setRubricData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [rubricTitle, setRubricTitle] = useState(null)
  const [checkboxText, setCheckboxText] = useState('')
  const [deleteItem, setDeleteItem] = useState(null)
  const [deleteArray, setDeleteArray] = useState([])
  const rubricID = useLocation().state.id
  let temp_entries = []


  // handle user selection to add a new element to the rubric
  const handleMenuClick = e => {
    const newEntry = {
      id: `${entries.length + 1}`,
      type: e.key,
      text: '',
      scale: 1,
      scaleMinText: '',
      scaleMaxText: '',
      dbID: -1,
      order: 0,
    };
    setEntries([newEntry, ...entries]); // sets correct ordering of rubric entries (new entry at top of rubric)
    message.info('Click on menu item.');
    console.log('click', e);
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  // insert previous data from rubric in backend to the newly rendered rubric
  const insertIntoEntries = (entry, entryType) => {
    let newType = entryType;
    let newText = '';
    let newScale = 1;
    let newScaleMinText = '';
    let newScaleMaxText = '';
    let newDbID = entry['id'];
    let newOrder = entry['order']
    if(entryType === 'category' || entryType === 'text'){
      newText = entry['text']
    }
    if(entryType === 'longAnswer'){
      newText = entry['prompt']
    }
    if(entryType === 'scale'){
      newText = entry['prompt_text']
      newScale = entry['max_score']
      newScaleMinText = entry['min_text']
      newScaleMaxText = entry['max_text']
    }

    const newEntry = {
      id: `${temp_entries.length + 1}`,
      type: newType,
      text: newText,
      scale: newScale,
      scaleMinText: newScaleMinText,
      scaleMaxText: newScaleMaxText,
      dbID: newDbID,
      order: newOrder,
    };
    temp_entries = [newEntry, ...temp_entries]
  }
  
  // initialize the initial rubric from the database upon first rendering
  const initializeRubric = () => {
    rubricData['categories'].forEach((element) => insertIntoEntries(element, 'category'))
    rubricData['comments'].forEach((element) => insertIntoEntries(element, 'text'))
    rubricData['long_answers'].forEach((element) => insertIntoEntries(element, 'longAnswer'))
    rubricData['scales'].forEach((element) => insertIntoEntries(element, 'scale'))
    console.log("temp_entries: ", temp_entries)
    temp_entries.sort((a,b) => a.order - b.order)
    setEntries(temp_entries)
  }

  // function to get specific rubric data from the backend based on rubricID
  const getRubricData = async () =>{
    const rubric_full = await api.get(`api/rubric/full/${rubricID}/`); // api to backend to get rubric info
    let rubric_data = rubric_full.data[0];

    // properly set rubric name and checkbox text
    if(rubric_data['name'] == null){
      setRubricTitle('')
    }
    else{
      setRubricTitle(rubric_data['name'])
    }
    if(rubric_data['checkbox_text'] == null){
      setCheckboxText('')
    }
    else{
      setCheckboxText(rubric_data['checkbox_text'])
    }

    setRubricData(rubric_full.data[0]) // set rubric data to data fetched from database
  }

  // get initial rubric data from backend when first rendering this page
  useEffect(() => {
    getRubricData().catch(() => alert("Error with getRubricData!"))
  }, []);

  // once we have rubric data, initialize rubric info that was retrieved from the backend
  useEffect(() => {
    if(rubricData !== null){
      console.log("Initializing rubricData!") 
      initializeRubric();
    }
  }, [rubricData])

  // if we hav3e data in entries, we have loaded all rubric data, set loading to false
  useEffect(() => {
    setIsLoading(false)
  }, [entries])

  // function to delete an entry from the rubric frontend
  const deleteEntry = async () => {
    console.log(deleteItem)
    let trimmed_entries = [...entries]
    trimmed_entries.splice(entries.indexOf(deleteItem), 1)
    setEntries(trimmed_entries)
    setDeleteArray([...deleteArray, deleteItem]) // add item to deleteArray, will be deleted from database on save
    setDeleteItem(null)
  }

  // used as callback function for prop drilling, when deleteItem is updated, we run the deleteEntry
  // function for that item in the entries array
  useEffect(() => {
    if(deleteItem !== null){
      deleteEntry()
    }
  }, [deleteItem])

  // function to save current frontend state of rubrics to the backend
  const handleSave = async () => {
    console.log(entries)
    let response
    const api_opening_text = 'api/rubric/' // all api starts with this request
    let api_closing_text
    let is_post
    let argument_dictionary
    let full_api_text
    // update rubric title and checkbox text no matter what
    await api.put(`api/rubric/update/${rubricID}/`, {"name":rubricTitle, "checkbox_text": checkboxText})
    // configure proper api request for the item we are saving
    for(let i = 0; i < entries.length; i++){
      // if item does not exist in database yet, we are posting the item to the db
      if(entries[i]['dbID'] === -1){
        api_closing_text = '/'
        is_post = true
      }
      // otherwise, we are not posting, we are updating an existing db item
      else{
        api_closing_text = `/update/${entries[i]["dbID"]}/`
        is_post = false
      }
        // configure api by type of data
        if(entries[i]['type'] === 'scale'){
          full_api_text = api_opening_text + 'scale' + api_closing_text
          argument_dictionary = {"rubric":rubricID, "max_score":entries[i]["scale"], "min_text":entries[i]["scaleMinText"], "max_text":entries[i]["scaleMaxText"], "prompt_text":entries[i]["text"], "order":i}
        }
        if(entries[i]['type'] === 'longAnswer'){
          full_api_text = api_opening_text + 'longanswer' + api_closing_text
          argument_dictionary ={"rubric":rubricID, "prompt":entries[i]["text"], "order":i}
        }
        if(entries[i]['type'] === 'text'){
          full_api_text = api_opening_text + 'comment' + api_closing_text
          argument_dictionary = {"rubric":rubricID, "text":entries[i]["text"], "order": i}
        }
        if(entries[i]['type'] === 'category'){
          full_api_text = api_opening_text + 'category' + api_closing_text
          argument_dictionary = {"rubric":rubricID, "text":entries[i]["text"], "order": i}
        }
        // run the correct form of the api request
        if(is_post){
          response = await api.post(full_api_text, argument_dictionary)
        }
        else{
          response = await api.put(full_api_text, argument_dictionary)
        }

        // update the dbID for items so that we know where things exist in the db (and so we know
        // not to create this item in the db again on next save)
        let updated = [...entries]
        // console.log("response: ", response.data)
        updated.find((item) => item.id === entries[i].id).dbID = response.data.id
        setEntries(updated)
    }
    console.log(deleteArray)
    // delete all entries in deleteArray from the db
    for(let i = 0; i < deleteArray.length; i++){
      if(deleteArray[i].dbID !== -1){
        if(deleteArray[i].type == 'scale'){
          await api.delete(`api/rubric/scale/delete/${deleteArray[i].dbID}/`)
        }
        if(deleteArray[i].type == 'longAnswer'){
          await api.delete(`api/rubric/longanswer/delete/${deleteArray[i].dbID}/`)
        }
        if(deleteArray[i].type == 'text'){
          await api.delete(`api/rubric/comment/delete/${deleteArray[i].dbID}/`)
        }
        if(deleteArray[i].type == 'category'){
          await api.delete(`api/rubric/category/delete/${deleteArray[i].dbID}/`)
        }
      }
    }
  }


  if (isLoading || rubricTitle == null || checkboxText == null){
    return <div>Loading...</div>
  }

  return (
    <div style={{ padding: 12 }}>
    <Form
      layout="vertical"
      style={{textAlign: 'left'}}
    >
      <Form.Item label="Rubric Title">
        <Input
          placeholder="Enter rubric title"
          defaultValue={rubricTitle}
          style={{ maxWidth: 300 }}
          onBlur={(e) => setRubricTitle(e.target.value)}
        />
      </Form.Item>

      <Form.Item label="Checkbox Text">
        <Input
          placeholder="Enter checkbox text"
          defaultValue={checkboxText}
          style={{ maxWidth:700 }}
          onBlur={(e) => setCheckboxText(e.target.value)}
        />
      </Form.Item>

      <Form.Item>
        <Flex gap="small" wrap>
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
          <Link to="/user/admin/rubric">
            <Button type="primary">Back</Button>
          </Link>
        </Flex>
      </Form.Item>

      <Form.Item>
        <Dropdown menu={menuProps}>
          <Button>
            <Space>
              Add Entry
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </Form.Item>

      <DragCardList cardData={entries} setCardData={setEntries} setDelete={setDeleteItem}/>
    </Form>
    
    <Modal
      title="Success"
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}  // Hides OK and Cancel buttons
      closable={true}  // Ensures the X button is visible
    >
      <p>Progress has been saved!</p>
    </Modal>
  </div>
  
  );
};

export default EditRubric;