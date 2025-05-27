import { Card, Input, Button } from "antd";
const { TextArea } = Input;

// This is the long answer field for the rubric compoenents
// It creates a field where the judge can type in longer feedback and thoughts about a specific question

const LongAnswerCard = ({card, cardData, setCardData, setDelete}) => {
  // when user clicks off of the entry space, update the frontend values in memory
  // by updating state of cardData (which updates entries in editRubric.js)
  const onBlur = (e) => {
    let updated = [...cardData]
    updated.find((arrayCard) => arrayCard.id === card.id).text = e.target.value
    setCardData(updated)
  }

  return (
    <Card title={"Long Answer"} hoverable style={{ textAlign: 'left' }} extra={<Button onClick={() => setDelete(card)}>Delete</Button>}>
        <TextArea 
            placeholder="Put long answer prompt here"
            defaultValue={card.text}
            onBlur={onBlur}
        />
    </Card>
  );
};

export default LongAnswerCard;