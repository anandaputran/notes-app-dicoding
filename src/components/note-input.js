class NoteInput extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initValidation();
  }

  render() {
    this.innerHTML = `
        <form id="addNoteForm" class="note-form">
          <h2>Buat Catatan Baru</h2>
          
          <div class="form-group">
            <label for="title">Judul</label>
            <input type="text" id="title" placeholder="Masukkan judul..." required />
            <span class="error-msg" id="titleError"></span>
          </div>
  
          <div class="form-group">
            <label for="body">Isi Catatan</label>
            <textarea id="body" rows="4" placeholder="Tulis catatanmu di sini..." required></textarea>
            <span class="error-msg" id="bodyError"></span>
          </div>
  
          <button type="submit" id="submitBtn">Tambah Catatan</button>
        </form>
      `;
  }

  initValidation() {
    const titleInput = this.querySelector("#title");
    const bodyInput = this.querySelector("#body");
    const titleError = this.querySelector("#titleError");
    const bodyError = this.querySelector("#bodyError");

    titleInput.addEventListener("input", () => {
      if (titleInput.value.trim() === "") {
        titleError.textContent = "Judul tidak boleh kosong.";
      } else if (titleInput.value.length < 3) {
        titleError.textContent = "Judul minimal 3 karakter.";
      } else {
        titleError.textContent = "";
      }
    });

    bodyInput.addEventListener("input", () => {
      if (bodyInput.value.trim() === "") {
        bodyError.textContent = "Isi catatan tidak boleh kosong.";
      } else {
        bodyError.textContent = "";
      }
    });
  }
}

customElements.define("note-input", NoteInput);
