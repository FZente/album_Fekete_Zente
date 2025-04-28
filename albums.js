async function fetchAlbums() {
    try {
      const res = await fetch('http://localhost:3000/album');
      const albums = await res.json();
      renderAlbums(albums);
    } catch (err) {
      console.error(err);
      alert('Hiba történt az albumok betöltésekor!');
    }
  }

  async function fetchAlbumById() {
    const id = document.getElementById('album-id-input').value;
    if (!id) return alert("Adj meg egy album ID-t!");

    const res = await fetch('http://localhost:3000/album');
    const albums = await res.json();
    const album = albums.find(a => a.id == id);

    if (!album) {
      document.getElementById('album-container').innerHTML =
        `<p class="text-center bg-danger text-light w-25 mx-auto d-block p-2">Nem található ilyen ID-jű album.</p>`;
      return;
    }

    renderAlbums([album]);
  }

  function renderAlbums(albums) {
    const container = document.getElementById('album-container');
    container.innerHTML = '';

    albums.forEach(album => {
      const card = document.createElement('div');
      card.className = 'col-sm-6 col-lg-4';
      card.innerHTML = `
        <div class="card h-100 shadow text-bg-secondary">
          <div class="card-body">
            <h5 class="card-title d-flex justify-content-between align-items-center">
              <span>${album.zenecim || '<i></i>'}</span>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-warning" onclick="editField(${album.id}, 'zenecim', '${album.zenecim || ''}')">✏️</button>
                <button class="btn btn-outline-danger" onclick="clearField(${album.id}, 'zenecim')">🗑</button>
              </div>
            </h5>
            ${generateFieldRow(album, 'Zenekar', 'zenekar')}
            ${generateFieldRow(album, 'Kiadás éve', 'kiadaseve')}
            ${generateFieldRow(album, 'Hossz', 'hossza')}
            <button class="btn btn-danger w-100 mt-3" onclick="deleteAlbum(${album.id})">Törlés</button>
          </div>
      `;
      container.appendChild(card);
    });
  }

  function generateFieldRow(album, label, key) {
    return `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div><strong>${label}:</strong> ${album[key] || ''}</div>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-warning m-1" onclick="editField(${album.id}, '${key}', '${album[key] || ''}')">✏️</button>
          <button class="btn btn-outline-danger m-1" onclick="clearField(${album.id}, '${key}')">🗑</button>
        </div>
      </div>
    `;
  }

  async function createAlbums() {
    const zenekar = prompt("Zenekar:");
    const zenecim = prompt("Zene címe:");
    const kiadaseve = prompt("Kiadás éve:");
    const hossza = prompt("Hossz:");
  
    if (!zenekar || !zenecim || !kiadaseve || !hossza) {
      alert("Minden mezőt ki kell tölteni!");
      return;
    }
  
    await fetch('http://localhost:3000/album', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zenekar, zenecim, kiadaseve, hossza })
    });
  
    fetchAlbums();
  }

  async function editField(id, field, currentValue) {
    const newValue = prompt(`Új érték (${field}):`, currentValue);
    if (newValue === null || newValue.trim() === '' || newValue === currentValue) return;

    const res = await fetch('http://localhost:3000/album');
    const album = (await res.json()).find(a => a.id === id);
    album[field] = newValue;

    await fetch(`http://localhost:3000/album/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(album)
    });

    fetchAlbums();
  }

  async function clearField(id, field) {
    if (!confirm(`Biztosan törlöd a(z) "${field}" mezőt?`)) return;

    const res = await fetch('http://localhost:3000/album');
    const album = (await res.json()).find(a => a.id === id);
    album[field] = '';

    await fetch(`http://localhost:3000/album/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(album)
    });

    fetchAlbums();
  }

  async function deleteAlbum(id) {
    if (confirm('Biztosan törlöd az albumot?')) {
      await fetch(`http://localhost:3000/album/${id}`, {
        method: 'DELETE'
      });
      fetchAlbums();
    }
  }

  function toggleForm() {
    const formContainer = document.getElementById('album-form-container');
    formContainer.classList.toggle('d-none');
  }

  document.getElementById('album-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const zenekar = document.getElementById('zenekar').value.trim();
    const zenecim = document.getElementById('zenecim').value.trim();
    const kiadaseve = document.getElementById('kiadaseve').value.trim();
    const hossza = document.getElementById('hossza').value.trim();
  
    if (!zenekar || !zenecim || !kiadaseve || !hossza) {
      alert("Minden mezőt ki kell tölteni!");
      return;
    }
  
    await fetch('http://localhost:3000/album', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zenekar, zenecim, kiadaseve, hossza })
    });
  
    e.target.reset(); 
    document.getElementById('album-form-container').classList.add('d-none'); 
    fetchAlbums(); 
  });