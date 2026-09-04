import "./components/app-bar.js";
import "./components/note-input.js";
import "./components/note-item.js";
import "./components/app-footer.js";
import "./styles/style.css";

const BASE_URL = "https://notes-api.dicoding.dev/v2";

document.addEventListener("DOMContentLoaded", () => {
  const notesContainer = document.getElementById("notesContainer");
  const archivedNotesContainer = document.getElementById(
    "archivedNotesContainer",
  );
  const addNoteForm = document
    .querySelector("note-input")
    .querySelector("#addNoteForm");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const errorMessage = document.getElementById("errorMessage");

  function showLoading() {
    loadingIndicator.hidden = false;
  }

  function hideLoading() {
    loadingIndicator.hidden = true;
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
  }

  function hideError() {
    errorMessage.hidden = true;
    errorMessage.textContent = "";
  }

  async function waitForMinimumLoading(startTime, minimumTime = 1000) {
    const elapsedTime = Date.now() - startTime;

    if (elapsedTime < minimumTime) {
      await new Promise((resolve) =>
        setTimeout(resolve, minimumTime - elapsedTime),
      );
    }
  }

  async function getNotes() {
    showLoading();
    hideError();

    const startTime = Date.now();

    try {
      const response = await fetch(`${BASE_URL}/notes`);

      if (!response.ok) {
        throw new Error("Gagal mengambil data catatan.");
      }

      const responseJson = await response.json();

      return responseJson.data;
    } catch (error) {
      showError("Gagal memuat catatan. Silakan coba lagi.");
      console.error(error);

      return [];
    } finally {
      await waitForMinimumLoading(startTime);
      hideLoading();
    }
  }

  async function renderNotes() {
    const notes = await getNotes();
    notesContainer.innerHTML = "";

    notes.forEach((note) => {
      const noteElement = document.createElement("note-item");
      noteElement.setAttribute("id", note.id);
      noteElement.setAttribute("title", note.title);
      noteElement.setAttribute("body", note.body);
      noteElement.setAttribute("created-at", note.createdAt);
      notesContainer.appendChild(noteElement);
    });

    bindCardEvents();
  }

  async function renderArchivedNotes() {
    showLoading();
    hideError();

    const startTime = Date.now();

    try {
      const response = await fetch(`${BASE_URL}/notes/archived`);

      if (!response.ok) {
        throw new Error("Gagal mengambil data catatan arsip.");
      }

      const responseJson = await response.json();

      archivedNotesContainer.innerHTML = "";

      responseJson.data.forEach((note) => {
        const noteElement = document.createElement("note-item");
        noteElement.setAttribute("id", note.id);
        noteElement.setAttribute("title", note.title);
        noteElement.setAttribute("body", note.body);
        noteElement.setAttribute("created-at", note.createdAt);
        noteElement.setAttribute("archived", "true");

        archivedNotesContainer.appendChild(noteElement);
      });

      bindArchivedCardEvents();
    } catch (error) {
      showError("Gagal memuat catatan arsip. Silakan coba lagi.");
      console.error(error);
    } finally {
      await waitForMinimumLoading(startTime);
      hideLoading();
    }
  }

  function bindCardEvents() {
    notesContainer.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        deleteNote(id);
      });
    });

    notesContainer.querySelectorAll(".btn-archive").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        archiveNote(id);
      });
    });
  }

  function bindArchivedCardEvents() {
    archivedNotesContainer.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        deleteNote(id);
      });
    });

    archivedNotesContainer.querySelectorAll(".btn-unarchive").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        unarchiveNote(id);
      });
    });
  }

  // Submit Form Hapus Catatan
  async function deleteNote(id) {
    if (!confirm("Apakah Anda yakin ingin menghapus catatan ini?")) return;

    showLoading();
    hideError();

    const startTime = Date.now();

    try {
      const response = await fetch(`${BASE_URL}/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus catatan.");
      }

      await renderNotes();
      await renderArchivedNotes();
    } catch (error) {
      showError("Catatan gagal dihapus. Silakan coba lagi.");
      console.error(error);
    } finally {
      await waitForMinimumLoading(startTime);
      hideLoading();
    }
  }

  async function archiveNote(id) {
    showLoading();
    hideError();

    const startTime = Date.now();

    try {
      const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Gagal mengarsipkan catatan.");
      }

      await renderNotes();
      await renderArchivedNotes();
    } catch (error) {
      showError("Catatan gagal diarsipkan. Silakan coba lagi.");
      console.error(error);
    } finally {
      await waitForMinimumLoading(startTime);
      hideLoading();
    }
  }

  // Kembalikan Catatan dari Arsip
  async function unarchiveNote(id) {
    showLoading();
    hideError();

    const startTime = Date.now();

    try {
      const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Gagal mengembalikan catatan.");
      }

      await renderNotes();
      await renderArchivedNotes();
    } catch (error) {
      showError("Catatan gagal dikembalikan. Silakan coba lagi.");
      console.error(error);
    } finally {
      await waitForMinimumLoading(startTime);
      hideLoading();
    }
  }

  // Submit Form Tambah Catatan Baru
  addNoteForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titleVal = addNoteForm.querySelector("#title").value.trim();
    const bodyVal = addNoteForm.querySelector("#body").value.trim();

    if (!titleVal || !bodyVal) return;

    showLoading();
    hideError();

    const startTime = Date.now();

    try {
      const response = await fetch(`${BASE_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: titleVal,
          body: bodyVal,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan catatan.");
      }

      await response.json();

      addNoteForm.reset();
      await renderNotes();
    } catch (error) {
      showError("Catatan gagal ditambahkan. Silakan coba lagi.");
      console.error(error);
    } finally {
      await waitForMinimumLoading(startTime);
      hideLoading();
    }
  });

  renderNotes();
  renderArchivedNotes();
});
