import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

import CategoryCard from './rubricCards/category';
import LongAnswerCard from './rubricCards/longAnswer';
import ScaleCard from './rubricCards/scale';
import TextCard from './rubricCards/text';

const ItemType = 'CARD';

// This is the container component for the fields added to the rubric template
// They are able to be dragged and moved around and their content is loaded in from specific cards from the rubricCards folder

// set the specific card content component based on the type of field it is
const RenderCardContent = ({ card, cardData, setCardData, setDelete }) => {
  switch (card.type) {
    case 'scale':
      return (
        <ScaleCard card={card} cardData={cardData} setCardData={setCardData} setDelete={setDelete}/>
      );
    case 'longAnswer':
      return (
        <LongAnswerCard card={card} cardData={cardData} setCardData={setCardData} setDelete={setDelete}/>
      );
    case 'text':
      return (
        <TextCard card={card} cardData={cardData} setCardData={setCardData} setDelete={setDelete}/>
      );
    case 'category':
      return (
        <CategoryCard card={card} cardData={cardData} setCardData={setCardData} setDelete={setDelete}/>
      );
    default:
      return null;
  }
};

// The component declaration for an individual draggable card
const DraggableCard = ({ card, cardData, moveCard, setCardData, setDelete }) => {
  const ref = React.useRef(null);

  // This controls moving around cards
  // If the card is dragged over halfway past another card, it will move around the cards
  // Then it updates the positions of the cards to show the new order in which they are now arranged
  const [, drop] = useDrop({
    accept: ItemType,
    hover(draggedItem, monitor) {
      if (!ref.current) return;
    
      const dragId = draggedItem.id;
      const hoverId = card.id;
    
      if (dragId === hoverId) return; // if the card is hovering over its own position do nothing
    
      // otherwise get the current index for both the card being dragged and the one it is hovering over
      const dragIndex = cardData.findIndex(c => c.id === dragId);
      const hoverIndex = cardData.findIndex(c => c.id === hoverId);
    
      if (dragIndex === -1 || hoverIndex === -1) return; // again check if they are the same to be sure
    
      // if they are distinct, get the dimensions of the card being hovered over
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
    
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    
      // check if the card being dragged is in the top or bottom half of the card it is hovering over
      const isMovingDown = dragIndex < hoverIndex && hoverClientY > hoverMiddleY;
      const isMovingUp = dragIndex > hoverIndex && hoverClientY < hoverMiddleY;
    
      // update the card position based on if it passed over the top half of the card or the bottom half
      if (isMovingDown || isMovingUp) {
        moveCard(dragIndex, hoverIndex);
      }
    },    
  });

  // useDrag hook from React DnD makes a component draggable
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: card.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  
  // Connect both drag and drop functionality to the same DOM node
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        marginBottom: 12,
        opacity: isDragging ? 0.5 : 1, // change the opacity of the card when it is being dragged to be a bit more translucent
        cursor: 'move',
      }}
    >
      <RenderCardContent card={card} cardData={cardData} setCardData={setCardData} setDelete={setDelete}/>
    </div>
  );
};

const DragCardList = ({cardData, setCardData, setDelete}) => {

  // switch indexes when a card is dragged over another one
  const moveCard = (fromIndex, toIndex) => {
    const updated = [...cardData];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setCardData(updated); // update the positions
  };

  return (
    <>
      {cardData.map((card) => (
        <DraggableCard
          key={card.id}
          card={card}
          cardData={cardData}
          moveCard={moveCard}
          setCardData={setCardData}
          setDelete={setDelete}
        />
      ))}
    </>

  );
};

export default DragCardList;
