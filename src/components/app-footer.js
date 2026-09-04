class AppFooter extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
        <footer>
          <p>&copy; ${new Date().getFullYear()} Notes App &bull; Dibuat oleh <a href="https://anandaputran.github.io" target="_blank" rel="noopener noreferrer">Ananda Putra Nugraha</a></p>
        </footer>
      `;
  }
}

customElements.define('app-footer', AppFooter);