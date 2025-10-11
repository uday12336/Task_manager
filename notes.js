document.addEventListener('DOMContentLoaded', () => {
    const noteTitle = document.getElementById('note-title');
    const notesInput = document.getElementById('notes-input');
    const saveNotes = document.getElementById('save-notes');
    const notesHistory = document.getElementById('notes-history');
    const notePopup = document.getElementById('note-popup');
    const closePopup = document.getElementById('close-popup');
    const popupTitle = document.getElementById('popup-title');
    const popupText = document.getElementById('popup-text');
    const popupTimestamp = document.getElementById('popup-timestamp');
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let editingIndex = null; // Track the index of the note being edited

    function renderNotes() {
        notesHistory.innerHTML = '';
        notes.forEach((note, index) => {
            const div = document.createElement('div');
            div.classList.add('note-entry');
            div.innerHTML = `
                <div class="note-content">
                    <p>${note.title || 'Untitled'}</p>
                    <p class="timestamp">Saved: ${new Date(note.timestamp).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                </div>
                <div class="note-actions">
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            `;
            // Click on note content to show popup
            div.querySelector('.note-content').addEventListener('click', () => {
                popupTitle.textContent = note.title || 'Untitled';
                popupText.textContent = note.text;
                popupTimestamp.textContent = `Saved: ${new Date(note.timestamp).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
                notePopup.style.display = 'flex';
            });
            // Click on edit button to populate inputs
            div.querySelector('.edit-btn').addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering the popup
                editingIndex = index;
                noteTitle.value = note.title || '';
                notesInput.value = note.text;
                saveNotes.textContent = 'Update'; // Change button text to indicate editing
            });
            // Click on delete button to remove note
            div.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering the popup
                notes.splice(index, 1); // Remove note from array
                editingIndex = null; // Reset editing state
                saveNotes.textContent = 'Save'; // Reset button text
                saveNotesToStorage();
                renderNotes();
            });
            notesHistory.appendChild(div);
        });
        // Reset inputs only if not editing
        if (editingIndex === null) {
            noteTitle.value = '';
            notesInput.value = notes.length > 0 ? notes[notes.length - 1].text : '';
            if (notes.length > 0) noteTitle.value = notes[notes.length - 1].title || '';
            saveNotes.textContent = 'Save';
        }
    }

    function saveNotesToStorage() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    saveNotes.addEventListener('click', () => {
        const title = noteTitle.value.trim();
        const text = notesInput.value.trim();
        if (text) {
            if (editingIndex !== null) {
                // Update existing note
                notes[editingIndex] = { title, text, timestamp: notes[editingIndex].timestamp };
                editingIndex = null;
                saveNotes.textContent = 'Save';
            } else {
                // Add new note
                notes.push({ title, text, timestamp: new Date().toISOString() });
            }
            renderNotes();
            saveNotesToStorage();
        }
    });

    notesInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) saveNotes.click();
    });

    closePopup.addEventListener('click', () => {
        notePopup.style.display = 'none';
    });

    // Close popup when clicking outside the popup content
    notePopup.addEventListener('click', (e) => {
        if (e.target === notePopup) {
            notePopup.style.display = 'none';
        }
    });

    renderNotes();
});