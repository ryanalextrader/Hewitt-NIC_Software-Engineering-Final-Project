import { Card, Input, InputNumber, Button, Form } from "antd";

// This is the scale field for the rubric compoenents
// It creates a scale for how well a student did at a particular task e.g. How well organized was the lab book?
// Then a range can be set 0-x where the max is 10 for how many points to allow for that question
// Text can also be added to give an indication of what the lowest and highest scores mean e.g. Very disorganized and Organization couldnt be better

// need to pass in all of cardData and the setCardData function
// on change, use .filter on cardData to look up element with id matching card.data (remember, this is a string value!)
// Then, alter this value within cardData to match what was just called (probably want to do this in a temp value)
// Then call setCardData to update everything

const ScaleCard = ({card, cardData, setCardData, setDelete}) => {
    // when user clicks off of the entry space, update the frontend values in memory
    // by updating state of cardData (which updates entries in editRubric.js)
    const onBlurPrompt = (e) => {
        let updated = [...cardData]
        updated.find((arrayCard) => arrayCard.id === card.id).text = e.target.value
        setCardData(updated)
    }
    // when user clicks off of the entry space, update the frontend values in memory
    // by updating state of cardData (which updates entries in editRubric.js)
    const onBlurScaleMinText = (e) => {
        let updated = [...cardData]
        updated.find((arrayCard) => arrayCard.id === card.id).scaleMinText = e.target.value
        setCardData(updated)
    }

    // when user clicks off of the entry space, update the frontend values in memory
    // by updating state of cardData (which updates entries in editRubric.js)
    const onBlurScaleMaxText = (e) => {
        let updated = [...cardData]
        updated.find((arrayCard) => arrayCard.id === card.id).scaleMaxText = e.target.value
        setCardData(updated)
    }
    // when updates scale max value, update the frontend values in memory
    // by updating state of cardData (which updates entries in editRubric.js)
    const onChangeScaleMax = (e) => {
        console.log("e: ", e)
        let updated = [...cardData]
        updated.find((arrayCard) => arrayCard.id === card.id).scale = e
        setCardData(updated)
    }
    
    return (
        <Card title={"Scale"} hoverable style={{ textAlign: 'left' }} extra={<Button onClick={() => setDelete(card)}>Delete</Button>}>
            <Form
                layout="vertical"
                style={{textAlign: 'left'}}
            >
                <Form.Item label="Scale Prompt">
                    <Input 
                        placeholder="Put scale prompt here"
                        defaultValue={card.text}
                        onBlur={onBlurPrompt}
                    />
                </Form.Item>

                <Form.Item label="Scale Min Text">
                    <Input 
                        placeholder="Put scale min text here"
                        defaultValue={card.scaleMinText}
                        onBlur={onBlurScaleMinText}
                    />
                </Form.Item>

                <Form.Item label="Scale Max Text">
                    <Input 
                        placeholder="Put scale max text here"
                        defaultValue={card.scaleMaxText}
                        onBlur={onBlurScaleMaxText}
                    />
                </Form.Item>
        
                <Form.Item label="Scale Max">
                    <InputNumber
                        min={1} 
                        max={10} // ask about changing
                        defaultValue={card.scale}
                        onChange={onChangeScaleMax}
                    />
                </Form.Item>
            </Form>
        </Card>
    );
};

export default ScaleCard;