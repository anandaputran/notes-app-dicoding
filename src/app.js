import './components/app-bar.js';
import './components/note-input.js';
import './components/note-item.js';
import './components/app-footer.js';
import initialNotesData from './utils/notes-data.js';

document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notesContainer');
    const addNoteForm = document.querySelector('note-input').querySelector('#addNoteForm');

    // Elemen Modal
    const editModal = document.getElementById('editModal');
    const editNoteForm = document.getElementById('editNoteForm');
    const editTitleInput = document.getElementById('editTitle');
    const editBodyInput = document.getElementById('editBody');
    const closeModalBtn = document.querySelector('.close-modal');

    let activeEditId = null;

    function getNotes() {
        const saved = localStorage.getItem('NOTES_APP_DATA');
        if (saved) return JSON.parse(saved);
        localStorage.setItem('NOTES_APP_DATA', JSON.stringify(initialNotesData));
        return initialNotesData;
    }

    function saveNotes(notes) {
        localStorage.setItem('NOTES_APP_DATA', JSON.stringify(notes));
    }

    function renderNotes() {
        const notes = getNotes();
        notesContainer.innerHTML = '';

        notes.forEach(note => {
            const noteElement = document.createElement('note-item');
            noteElement.setAttribute('id', note.id);
            noteElement.setAttribute('title', note.title);
            noteElement.setAttribute('body', note.body);
            noteElement.setAttribute('created-at', note.createdAt);
            notesContainer.appendChild(noteElement);
        });

        bindCardEvents();
    }

    function bindCardEvents() {
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                deleteNote(id);
            });
        });

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                openEditModal(id);
            });
        });
    }

    function deleteNote(id) {
        if (!confirm('Apakah Anda yakin ingin menghapus catatan ini?')) return;
        let notes = getNotes().filter(note => note.id !== id);
        saveNotes(notes);
        renderNotes();
    }

    // --- Fungsi Modal Pop-up Edit ---
    function openEditModal(id) {
        const notes = getNotes();
        const noteToEdit = notes.find(note => note.id === id);
        if (!noteToEdit) return;

        activeEditId = id;
        editTitleInput.value = noteToEdit.title;
        editBodyInput.value = noteToEdit.body;
        editModal.style.display = 'flex';
    }

    function closeEditModal() {
        editModal.style.display = 'none';
        activeEditId = null;
        editNoteForm.reset();
    }

    closeModalBtn.addEventListener('click', closeEditModal);
    window.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
    });

    // Submit Simpan Edit via Modal
    editNoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTitle = editTitleInput.value.trim();
        const newBody = editBodyInput.value.trim();

        if (!newTitle || !newBody) return;

        let notes = getNotes().map(note => {
            if (note.id === activeEditId) {
                return { ...note, title: newTitle, body: newBody };
            }
            return note;
        });

        saveNotes(notes);
        renderNotes();
        closeEditModal();
    });

    // Submit Form Tambah Catatan Baru
    addNoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const titleVal = addNoteForm.querySelector('#title').value.trim();
        const bodyVal = addNoteForm.querySelector('#body').value.trim();

        if (!titleVal || !bodyVal) return;

        const newNote = {
            id: `notes-${Date.now()}`,
            title: titleVal,
            body: bodyVal,
            createdAt: new Date().toISOString(),
            archived: false,
        };

        const notes = getNotes();
        notes.unshift(newNote);
        saveNotes(notes);
        renderNotes();
        addNoteForm.reset();
    });

    renderNotes();
});