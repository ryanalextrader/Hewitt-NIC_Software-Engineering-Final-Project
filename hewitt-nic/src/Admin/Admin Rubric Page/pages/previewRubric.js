import React, { useState, useEffect } from 'react';
import { Row, Col, Checkbox, Slider, Divider, Typography, Button, message, Input, Form } from "antd";
import { Link, useLocation } from 'react-router-dom';

import api from '../../../api';

const { Text, Title } = Typography
const { TextArea } = Input;

// This component allows the admin to see what the judge would see for the rubric they selected
// The form cannot be changed in this view, nor will anything the admin enters or tests for input in the rubric get saved

const PreviewRubric = () => {

  const [entries, setEntries] = useState([]);
  const [rubricData, setRubricData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [rubricTitle, setRubricTitle] = useState(null)
  const [checkboxText, setCheckboxText] = useState('')
  // this gets set in the viewRubric page to whatever rubric was selected by the admin to preview
  const rubricID = useLocation().state.id 
  let temp_entries = [] // used to store entries before they get sorted and put in "entries" variable

  // used for all the scale parts of the rubric
  // they are implemented as sliders where the judge can see the value they set
  // along with the text for what the lowest and highest score indicates
  const [sliderValues, setSliderValues] = useState({});

  const onChangeSlide = (id, newValue) => {
    setSliderValues(prev => ({
      ...prev,
      [id]: newValue
    }));
  };

  // Keeps the status for the checkbox component 
  const onChangeCheck = e => {
    console.log(`checked = ${e.target.checked}`);
  };
  
  // function to initialize rubric data by processing each catagory of prompt the rubric has
  // and then sort by the order of data
  const initializeRubric = () => {
    rubricData['categories'].forEach((element) => insertIntoEntries(element, 'category'))
    rubricData['comments'].forEach((element) => insertIntoEntries(element, 'text'))
    rubricData['long_answers'].forEach((element) => insertIntoEntries(element, 'longAnswer'))
    rubricData['scales'].forEach((element) => insertIntoEntries(element, 'scale'))
    console.log("temp_entries: ", temp_entries)

    temp_entries.sort((a,b) => a.order - b.order) // sort by the actual order of the form rather than catagory type
    setEntries(temp_entries)
  }

  // insert previous rubric data into entries of newly created rubric
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

  // fetch the rubric data from the database
  const getRubricData = async () =>{
    const rubric_full = await api.get(`api/rubric/full/${rubricID}/`);
    let rubric_data = rubric_full.data[0];

    // initialize any empty fields for rubric name or checkbox
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

    setRubricData(rubric_full.data[0])
  }

  // load in rubric data when page loads
  useEffect(() => {
    getRubricData().catch(() => alert("Error with getRubricData!"))
  }, []);

  // initialize specific rubric fields into local variables after raw data has been loaded from database
  useEffect(() => {
    if(rubricData !== null){
      console.log("Initializing rubricData!") 
      initializeRubric();
    }
  }, [rubricData])

  // show a status of loading until data has been initialized
  useEffect(() => {
    setIsLoading(false)
  }, [entries])


  console.log("entries:", entries)

  if (isLoading || rubricTitle == null || checkboxText == null){
    return <div>Loading...</div>
  }

  return (
    <>
      <div style={{ padding: 12, backgroundColor: 'white'}}>
      <Form
        layout="vertical"
        style={{textAlign: 'left'}}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-begin' }}>
            <Title level={2}>Rubric Preview: {rubricTitle} </Title>
        </div>
        
        
          {entries.map((item) => {
            switch (item.type) {
              case 'text':
                return (
                  <Form.Item key={item.id}>
                    <Text>{item.text}</Text>
                  </Form.Item>
                );

              case 'category':
                return (
                  <Form.Item key={item.id}>
                    <Divider orientation="start">
                      <span style={{ fontSize: '1.5em' }}>{item.text}</span>
                    </Divider>
                  </Form.Item>
                );

              case 'longAnswer':
                return (
                  <Form.Item key={item.id} label={item.text}>
                    <TextArea rows={4} placeholder="Enter feedback here..." maxLength={255} />
                  </Form.Item>
                );

              case 'scale':
                return (
                  <Form.Item key={item.id} label={item.text}>
                    <Row align="middle" gutter={8}>
                      <Col>
                        <Text>{item.scaleMinText}</Text>
                      </Col>
                      <Col span={5}>
                        <Slider
                          min={0}
                          max={item.scale}
                          onChange={(value) => onChangeSlide(item.id, value)}
                          value={sliderValues[item.id] || 0}
                        />
                      </Col>
                      <Col>
                        <Text>{item.scaleMaxText}</Text>
                      </Col>
                    </Row>
                  </Form.Item>
                  
                );

              default:
                return (
                  <p key={item.id} className="text-red-500">
                    Unknown type: {item.type}
                  </p>
                );
            }
          })}

          <Form.Item>
            <Divider orientation="start">
              <span style={{ fontSize: '1.5em' }}>Summary</span>
            </Divider>
          </Form.Item>

          <Form.Item label="Student Feedback (this will be reviewed and then shown to the students for their submissions)">
            <TextArea rows={4} placeholder="Enter feedback here..." maxLength={255} />
          </Form.Item>

          <Form.Item>
            <Checkbox onChange={onChangeCheck}>{checkboxText}</Checkbox>
          </Form.Item>

          <Link to="/user/admin/rubric">
              <Button type="primary">Go Back</Button>
          </Link>
      </Form>
      
    </div>

    </>
  
  );
};

export default PreviewRubric;