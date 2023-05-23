import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import styles from "./styles/NotesPage.module.css"

function App() {
  //create a state
  const [notes, setNotes] = useState<NoteModel[]>([]);

  //execute side effects outside of the  rendering of the component itself
  useEffect(() => {
    async function loadNotes() {
      try {
        const response = await fetch("/api/notes", { method: "GET" });
        const notes = await response.json();
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
      <Row xs={1} md={2} xl={3} className='g-4'>
        {notes.map(note => (
          <Col key={note._id} >
            <Note note={note} className={styles.note} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default App;
