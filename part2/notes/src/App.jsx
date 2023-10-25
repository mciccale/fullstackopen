import { useState, useEffect } from "react";
import noteService from "./services/notes.js";
import Note from "./components/Note.jsx";
import Notification from "./components/Notification.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("a new note...");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    noteService.getAll().then((data) => {
      setNotes(data);
    });
  }, []);
  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: notes.length + 1,
    };
    noteService.create(noteObject).then((data) => {
      setNotes(notes.concat(data));
      setNewNote("");
    });
  };
  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };
  const toggleImportance = (id) => {
    const note = notes.find((note) => note.id === id);
    const newNote = { ...note, important: !note.important };
    noteService
      .update(id, newNote)
      .then((data) => {
        setNotes(notes.map((note) => (note.id !== id ? note : data)));
      })
      .catch(() => {
        setErrorMessage(
          `Note "${note.content}" was already removed from the server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        // console.log(err);
        // alert(`the note '${note.content}' was already deleted from the server`);
        setNotes(notes.filter((note) => note.id !== id));
      });
  };
  const notesToShow = showAll
    ? notes
    : notes.filter(({ important }) => important === true);
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note key={note.id} note={note} toggleImportance={toggleImportance} />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
}

export default App;
