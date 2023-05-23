import styles from "../styles/Note.module.css"
import { Note as NoteModel } from '../models/note'
import { Card } from 'react-bootstrap'
import { formatDate } from "../utils/formatDate"

//convention is to name it
interface NoteProps {
    note: NoteModel,
    className?: string,

}

const Note = ({ note, className }: NoteProps) => {
    const {
        title,
        text,
        createdAt,
        updatedAt,
    } = note

    let createdUpdateText: string;
    if (updatedAt > createdAt) {
        createdUpdateText = "Updated " + formatDate(updatedAt)
    } else {
        createdUpdateText = "Created: " + formatDate(createdAt)
    }
    return (
        <Card className={`${styles.noteCard} ${className}`}>
            <Card.Body className={styles.cardBody}>
                <Card.Title>
                    {title}
                </Card.Title>
                <Card.Text className={styles.noteText}>
                    {text}
                </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
                {createdUpdateText }
            </Card.Footer>
        </Card>
    )
}

export default Note