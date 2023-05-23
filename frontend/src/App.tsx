import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'react-bootstrap';
import { Note } from './models/note';

function App() {
  //create a state
  const [notes, setNotes] = useState<Note[]>([]);

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
    <div className="App">
      {JSON.stringify(notes)}
    </div>
  );
}

export default App;
