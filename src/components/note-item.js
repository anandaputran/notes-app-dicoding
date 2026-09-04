class NoteItem extends HTMLElement {
  static get observedAttributes() {
    return ["id", "title", "body", "created-at", "archived"];
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const id = this.getAttribute("id");
    const title = this.getAttribute("title") || "Tanpa Judul";
    const body = this.getAttribute("body") || "";
    const createdAt =
      this.getAttribute("created-at") || new Date().toISOString();
    const archived = this.getAttribute("archived") === "true";

    const formattedDate = new Date(createdAt).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    this.innerHTML = `
        <article class="note-card" data-id="${id}">
          <div class="note-content">
            <h3 class="note-title">${title}</h3>
            <p class="note-date">${formattedDate}</p>
            <p class="note-body">${body}</p>
          </div>
          <div class="note-actions">
          ${archived ? `<button class="btn-unarchive" data-id="${id}">Kembalikan</button>` : `<button class="btn-archive" data-id="${id}">Arsipkan</button>`}
            <button class="btn-delete" data-id="${id}">Hapus</button>
          </div>
        </article>
      `;
  }
}

customElements.define("note-item", NoteItem);
