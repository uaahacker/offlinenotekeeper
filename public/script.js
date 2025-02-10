document.addEventListener('DOMContentLoaded', function () {
    const notesContainer = document.getElementById('notes-container');
    const addNoteForm = document.getElementById('addNoteForm');
    const editNoteForm = document.getElementById('editNoteForm');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const updateNoteBtn = document.getElementById('updateNoteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    // --- Data Storage ---
    const STORAGE_KEY = 'offlineNotes';

    function getNotesFromStorage() {
        const notesString = localStorage.getItem(STORAGE_KEY);
        return notesString ? JSON.parse(notesString) : [];
    }

    function saveNotesToStorage(notes) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }

    function generateNoteId() {
        return Math.random().toString(36).substring(2, 15); // Simple ID generator
    }

    // --- UI Rendering ---
    function displayNotes() {
        notesContainer.innerHTML = ''; // Clear existing notes
        const notes = getNotesFromStorage();
        if (notes.length === 0) {
            notesContainer.innerHTML = '<div class="col-12 text-center">No notes yet. Add some!</div>';
            return;
        }

        notes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.className = 'col-md-4 note-card'; // Bootstrap column class for responsiveness
            noteCard.innerHTML = `
                <div class="card">
                    <div class="card-body note-card-body">
                        <h5 class="card-title">${note.summary}</h5>
                        <p class="card-text">${note.details}</p>
                        <div class="note-actions">
                            <button class="btn btn-sm btn-info edit-note-btn" data-note-id="${note.id}" data-toggle="modal" data-target="#editNoteModal">Edit</button>
                            <button class="btn btn-sm btn-danger delete-note-btn" data-note-id="${note.id}" data-toggle="modal" data-target="#deleteConfirmModal">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            notesContainer.appendChild(noteCard);
        });
        attachNoteCardEventListeners(); // Attach event listeners after rendering
    }

    function attachNoteCardEventListeners() {
        // Edit button event listeners
        document.querySelectorAll('.edit-note-btn').forEach(button => {
            button.addEventListener('click', function() {
                const noteId = this.dataset.noteId;
                const note = getNoteById(noteId);
                if (note) {
                    document.getElementById('edit-note-id').value = note.id;
                    document.getElementById('edit-note-summary').value = note.summary;
                    document.getElementById('edit-note-details').value = note.details;
                }
            });
        });

        // Delete button event listeners
        document.querySelectorAll('.delete-note-btn').forEach(button => {
            button.addEventListener('click', function() {
                const noteId = this.dataset.noteId;
                document.getElementById('delete-note-id').value = noteId; // Set note ID in delete modal
            });
        });
    }

    function getNoteById(noteId) {
        const notes = getNotesFromStorage();
        return notes.find(note => note.id === noteId);
    }

    // --- CRUD Operations ---
    function addNewNote() {
        const summary = document.getElementById('note-summary').value;
        const details = document.getElementById('note-details').value;

        if (!summary || !details) {
            alert('Please enter summary and details.');
            return;
        }

        const newNote = {
            id: generateNoteId(),
            summary: summary,
            details: details,
            createdDate: new Date().toISOString(),
            modifiedDate: new Date().toISOString()
        };

        const notes = getNotesFromStorage();
        notes.push(newNote);
        saveNotesToStorage(notes);
        displayNotes();
        $('#addNoteModal').modal('hide'); // Hide modal after saving
        addNoteForm.reset(); // Clear form fields
    }

    function updateNote() {
        const noteId = document.getElementById('edit-note-id').value;
        const summary = document.getElementById('edit-note-summary').value;
        const details = document.getElementById('edit-note-details').value;

        if (!summary || !details) {
            alert('Please enter summary and details.');
            return;
        }

        let notes = getNotesFromStorage();
        notes = notes.map(note => {
            if (note.id === noteId) {
                return {
                    ...note,
                    summary: summary,
                    details: details,
                    modifiedDate: new Date().toISOString()
                };
            }
            return note;
        });
        saveNotesToStorage(notes);
        displayNotes();
        $('#editNoteModal').modal('hide'); // Hide edit modal
    }

    function deleteNote() {
        const noteId = document.getElementById('delete-note-id').value;
        let notes = getNotesFromStorage();
        notes = notes.filter(note => note.id !== noteId);
        saveNotesToStorage(notes);
        displayNotes();
        $('#deleteConfirmModal').modal('hide'); // Hide delete confirm modal
    }

    // --- Event Listeners ---
    saveNoteBtn.addEventListener('click', addNewNote);
    updateNoteBtn.addEventListener('click', updateNote);
    confirmDeleteBtn.addEventListener('click', deleteNote);

    // Initial display of notes on page load
    displayNotes();
});