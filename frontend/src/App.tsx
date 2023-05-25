import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import styles from "./styles/NotesPage.module.css"
import styleUtils from "./styles/utils.module.css"
import * as NotesApi from "./network/notes_api"
import AddNoteDialogue from './components/AddNoteDialogue';

function App() {
  //create a state
  const [notes, setNotes] = useState<NoteModel[]>([]);

  const [showAddNoteDialogue, setShowAddNoteDialogue] = useState(false)
  //execute side effects outside of the  rendering of the component itself
  useEffect(() => {
    async function loadNotes() {
      try {
        const notes = await NotesApi.fetchNotes()
        setNotes(notes);
      } catch (error) {
        console.error(error);
        //open up popup window in browser
        alert(error);
      }
    }
    loadNotes();
    //empty array means that useEffect only executes once at the beginning
  }, []);

  return (
    <Container>
      <Button className={`'mb-4' ${styleUtils.blockCenter}`} onClick={() => setShowAddNoteDialogue(true)}>
        Add new note
      </Button>
      <Row xs={1} md={2} xl={3} className='g-4'>
        {notes.map(note => (
          <Col key={note._id} >
            <Note note={note} className={styles.note} />
          </Col>
        ))}
      </Row>
      {
        //ensures that showAddNoteDialogue is true
        showAddNoteDialogue &&
        <AddNoteDialogue
          onDismiss={() => setShowAddNoteDialogue(false)}
          onNoteSaved={(newNote) => {
            //creates a new array and add the notes alr in notes state
            //this displayed new note on the UI
            setNotes([...notes, newNote])
            setShowAddNoteDialogue(false)}}
        />
      }
    </Container>
  );
}

export default App;
