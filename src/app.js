import './components/app-bar.js';
import './components/note-input.js';
import './components/note-item.js';
import './components/app-footer.js';
import './styles/style.css';

const BASE_URL = 'https://notes-api.dicoding.dev/v2';

document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notesContainer');
    const addNoteForm = document.querySelector('note-input').querySelector('#addNoteForm');
    const loadingIndicator = document.getElementById('loadingIndicator');

    function showLoading() {
        loadingIndicator.hidden = false;
    }

    function hideLoading() {
        loadingIndicator.hidden = true;
    }

    async function waitForMinimumLoading(startTime, minimumTime = 1000) {
        const elapsedTime = Date.now() - startTime;

        if (elapsedTime < minimumTime) {
            await new Promise(resolve =>
                setTimeout(resolve, minimumTime - elapsedTime)
            );
        }
    }

    async function getNotes() {
        showLoading();
        const startTime = Date.now();

        try {
            const response = await fetch(`${BASE_URL}/notes`);
            const responseJson = await response.json();

            return responseJson.data;
        } finally {
            await waitForMinimumLoading(startTime);
            hideLoading();
        }
    }


    async function renderNotes() {
        const notes = await getNotes();
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
    }

    // Submit Form Hapus Catatan
    async function deleteNote(id) {
        if (!confirm('Apakah Anda yakin ingin menghapus catatan ini?')) return;

        showLoading();
        const startTime = Date.now();

        try {
            await fetch(`${BASE_URL}/notes/${id}`, {
                method: 'DELETE',
            });

            await renderNotes();
        } finally {
            await waitForMinimumLoading(startTime);
            hideLoading();
        }
    }


    // Submit Form Tambah Catatan Baru
    addNoteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const titleVal = addNoteForm.querySelector('#title').value.trim();
        const bodyVal = addNoteForm.querySelector('#body').value.trim();

        if (!titleVal || !bodyVal) return;

        showLoading();
        const startTime = Date.now();

        try {
            const response = await fetch(`${BASE_URL}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: titleVal,
                    body: bodyVal,
                }),
            });

            await response.json();

            addNoteForm.reset();
            await renderNotes();
        } finally {
            await waitForMinimumLoading(startTime);
            hideLoading();
        }
    });

    renderNotes();
});