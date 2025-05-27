import { Card, Input, Button } from "antd";

// This is the catagory field for the rubric compoenents
// It creates a title for the input fields below in the rubric e.g. Lab Work or Project Idea

const CategoryCard = ({card, cardData, setCardData, setDelete}) => {
  // when user clicks off of the entry space, update the frontend values in memory
  // by updating state of cardData (which updates entries in editRubric.js)
  const onBlur = (e) => {
    let updated = [...cardData]
    updated.find((arrayCard) => arrayCard.id === card.id).text = e.target.value
    setCardData(updated)
  }

  return (
    <Card title={"Category"} hoverable style={{ textAlign: 'left' }} extra={<Button onClick={() => setDelete(card)}>Delete</Button>}>
        <Input 
            placeholder="Put category name here"
            style={{ maxWidth: 300 }}
            defaultValue={card.text}
            onBlur={onBlur}
        />
    </Card>
  );
};

export default CategoryCard;