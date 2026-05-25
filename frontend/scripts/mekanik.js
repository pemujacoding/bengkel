// ==================== AREA 2: DATA MEKANIK ====================
async function loadMekanik() {
    try {
        const response = await fetch(`${API_URL}/mekanik`);
        allMechanics = await response.json();
        renderMekanikTable(allMechanics);
    } catch (err) { console.error(err); }
}

function renderMekanikTable(data) {
    const tbody = document.getElementById("list-mekanik-body");
    tbody.innerHTML = data.length === 0 ? `<tr><td colspan="3" class="text-center text-muted py-3">Tidak ada data mekanik.</td></tr>` : "";
    
    data.forEach(m => {
        tbody.innerHTML += `
            <tr>
                <td><span class="badge bg-light text-dark border">#${m.id}</span></td>
                <td><a href="#" class="fw-semibold text-decoration-none text-primary" onclick="goToMekanikDetailPage(${m.id})">${m.nama}</a></td>
                <td class="text-center">
                    <button class="btn btn-sm btn-warning text-white me-1" onclick="openEditMekanikModal(${JSON.stringify(m).replace(/"/g, '&quot;')})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteMekanik(${m.id})">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function handleSearchMekanik() {
    const query = document.getElementById("search-mekanik").value.toLowerCase().trim();
    if(!query) { renderMekanikTable(allMechanics); return; }
    const filtered = allMechanics.filter(m => m.id.toString() == query || m.nama.toLowerCase().includes(query));
    renderMekanikTable(filtered);
}

async function goToMekanikDetailPage(id) {
    try {
        const res = await fetch(`${API_URL}/mekanik/${id}`);
        const m = await res.json();
        document.getElementById("det-m-id").innerText = m.id;
        document.getElementById("det-m-nama").innerText = m.nama;
        document.getElementById("det-m-telp").innerText = m.no_telp || "-";
        document.getElementById("det-m-alamat").innerText = m.alamat || "-";
        document.getElementById("det-m-title").innerText = `Profil Mekanik: ${m.nama}`;
        switchView('mekanik-detail');
    } catch (err) { alert("Gagal memuat profil mekanik."); }
}

function openMekanikModal() {
    document.getElementById("mekanik-modal-title").innerText = "Tambah Mekanik Baru";
    document.getElementById("form-m-id").value = "";
    document.getElementById("form-data-mekanik").reset();
    bsMekanikModal.show();
}

function openEditMekanikModal(m) {
    document.getElementById("mekanik-modal-title").innerText = "Edit Data Mekanik";
    document.getElementById("form-m-id").value = m.id;
    document.getElementById("form-m-nama").value = m.nama;
    document.getElementById("form-m-telp").value = m.no_telp || "";
    document.getElementById("form-m-alamat").value = m.alamat || "";
    bsMekanikModal.show();
}

async function saveMekanik(e) {
    e.preventDefault();
    const id = document.getElementById("form-m-id").value;
    const payload = {
        nama: document.getElementById("form-m-nama").value,
        no_telp: document.getElementById("form-m-telp").value,
        alamat: document.getElementById("form-m-alamat").value
    };
    try {
        let method = id ? "PUT" : "POST";
        let url = id ? `${API_URL}/mekanik/${id}` : `${API_URL}/mekanik`;
        const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if(res.ok) { bsMekanikModal.hide(); loadMekanik(); switchView('mekanik-list'); }
    } catch (err) { console.error(err); }
}

async function deleteMekanik(id) {
    if(confirm("Hapus data mekanik ini?")) {
        try {
            const res = await fetch(`${API_URL}/mekanik/${id}`, { method: "DELETE" });
            if(res.ok) loadMekanik();
        } catch (err) { console.error(err); }
    }
}