import { useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { icons } from "@/utils/constants";
import "./Notes.scss";
import { TextInput } from "@/components";

const ItemType = {
  NOTE: "note",
};

const NoteItem = ({ item, index, moveNote, onEdit, onDelete }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemType.NOTE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: ItemType.NOTE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveNote(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const opacity = isDragging ? 1 : 1;

  return (
    <div
      ref={(node) => dragRef(dropRef(node))}
      style={{ opacity }}
      className="d-flex flex-nowrap gap-2 wp-100 mb-20"
    >
      <div className="w-24 h-24 f-center">
        <img src={icons.dragMenu} alt="" className="fit-image pointer" />
      </div>
      <div className="flex-grow-1 color-ffff py-5 px-10 br-6 bg-9c3f text-16-400 font-gilroy-m">
        {item.text}
      </div>
      <div className="w-24 h-24 f-center pointer" onClick={() => onEdit(index)}>
        <img src={icons.editImg} alt="" className="fit-image" />
      </div>
      <div
        className="w-24 h-24 f-center pointer"
        onClick={() => onDelete(index)}
      >
        <img src={icons.gdelete} alt="" className="fit-image" />
      </div>
    </div>
  );
};

const Notes = () => {
  const [noteList, setNoteList] = useState([
    { text: "Try to master the common notes first" },
    { text: "Practice consistently" },
  ]);

  const moveNote = (fromIndex, toIndex) => {
    const updatedList = [...noteList];
    const [movedItem] = updatedList.splice(fromIndex, 1);
    updatedList.splice(toIndex, 0, movedItem);
    setNoteList(updatedList);
  };

  const addNote = () => {
    setNoteList([...noteList, { text: "New Note" }]);
  };

  const editNote = (index) => {
    const newText = prompt("Edit Note", noteList[index].text);
    if (newText) {
      const updatedList = noteList.map((note, i) =>
        i === index ? { ...note, text: newText } : note
      );
      setNoteList(updatedList);
    }
  };

  const deleteNote = (index) => {
    setNoteList(noteList.filter((_, i) => i !== index));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div id="notes-container">
        <div className="cardBlock d-flex flex-column">
          <div className="fb-center flex-nowrap gap-3 mb-20">
            <div className="text-20-400 color-1a1a font-gilroy-sb">Notes</div>
          </div>
          <div className="listBlock brave-scroll">
            {noteList.map((item, index) => (
              <NoteItem
                key={index}
                index={index}
                item={item}
                moveNote={moveNote}
                onEdit={editNote}
                onDelete={deleteNote}
              />
            ))}
          </div>
          <div className="fa-center gap-3 flex-nowrap wp-100">
            <div className="wp-100">
              <TextInput className="bg-f7f7 h-49" />
            </div>
            <div className="addBlock p-2 br-6" onClick={addNote}>
              <div className="w-23 h-23 f-center">
                <img src={icons.bAdd} alt="" className="fit-image" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Notes;
