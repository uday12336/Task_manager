document.addEventListener('DOMContentLoaded', () => {
    const notesInput = document.getElementById('notes-input');
    const saveNotes = document.getElementById('save-notes');
    const notesHistory = document.getElementById('notes-history');
    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    function renderNotes() {
        notesHistory.innerHTML = '';
        notes.forEach(note => {
            const div = document.createElement('div');
            div.classList.add('note-entry');
            div.innerHTML = `
                <p>${note.text}</p>
                <p class="timestamp">Saved: ${new Date(note.timestamp).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
            `;
            notesHistory.appendChild(div);
        });
        notesInput.value = notes.length > 0 ? notes[notes.length - 1].text : '';
    }
    function saveNotesToStorage() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }
    saveNotes.addEventListener('click', () => {
        const text = notesInput.value.trim();
        if (text) {
            notes.push({ text, timestamp: new Date().toISOString() });
            renderNotes();
            saveNotesToStorage();
        }
    });
    notesInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) saveNotes.click();
    });
    renderNotes();
});