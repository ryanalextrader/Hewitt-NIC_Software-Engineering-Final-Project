import { Card, Input, Button } from "antd";
const { TextArea } = Input;

// This is the text field for the rubric compoenents
// It creates a text field, this allows the admin to add notes or instructions to clarify the rubric or a particular section of the rubric

const TextCard = ({card, cardData, setCardData, setDelete}) => {
  // when user clicks off of the entry space, update the frontend values in memory
  // by updating state of cardData (which updates entries in editRubric.js)
  const onBlur = (e) => {
    let updated = [...cardData]
    updated.find((arrayCard) => arrayCard.id === card.id).text = e.target.value
    setCardData(updated)
  }

  return (
    <Card title={"Text"} hoverable style={{ textAlign: 'left' }} extra={<Button onClick={() => setDelete(card)}> Delete</Button>}>
        <TextArea
            placeholder="Put plain text to include here"
            defaultValue={card.text}
            onBlur={onBlur}
        />
    </Card>
  );
};

export default TextCard;