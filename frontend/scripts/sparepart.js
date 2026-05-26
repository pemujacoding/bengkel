// ==================== AREA 3: KATALOG SPAREPART ====================
async function loadSparepart() {
    try {
        const response = await fetch(`${API_URL}/sparepart`);
        allSpareparts = await response.json();
        renderSparepartTable(allSpareparts);
    } catch (err) { console.error(err); }
}

function renderSparepartTable(data) {
    const tbody = document.getElementById("list-sparepart-body");
    tbody.innerHTML = data.length === 0 ? `<tr><td colspan="6" class="text-center text-muted py-3">Katalog sparepart kosong.</td></tr>` : "";
    
    data.forEach(s => {
        const namaBarang = s.nama_sparepart || s.nama;
        const hargaFormat = Number(s.harga).toLocaleString("id-ID");
        const statusStokColor = s.stok <= 5 ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success';
        
        tbody.innerHTML += `
            <tr>
                <td><span class="badge bg-light text-dark border">#${s.id}</span></td>
                <td><a href="#" class="fw-semibold text-decoration-none text-primary" onclick="goToSparepartDetailPage(${s.id})">${namaBarang}</a></td>
                <td>${s.merk || "-"}</td>
                <td class="fw-medium text-secondary">Rp ${hargaFormat}</td>
                <td class="text-center"><span class="badge ${statusStokColor} px-2 py-1">${s.stok} Pcs</span></td>
                <td class="text-center">
                    <button class="btn btn-sm btn-warning text-white me-1" onclick="openEditSparepartModal(${JSON.stringify(s).replace(/"/g, '&quot;')})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteSparepart(${s.id})">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function handleSearchSparepart() {
    const query = document.getElementById("search-sparepart").value.toLowerCase().trim();
    if(!query) { renderSparepartTable(allSpareparts); return; }
    
    const filtered = allSpareparts.filter(s => {
        const nama = (s.nama_sparepart || s.nama || "").toLowerCase();
        return s.id.toString() == query || nama.includes(query);
    });
    renderSparepartTable(filtered);
}

async function goToSparepartDetailPage(id) {
    try {
        const res = await fetch(`${API_URL}/sparepart/${id}`);
        const s = await res.json();
        
        document.getElementById("det-s-id").innerText = s.id;
        document.getElementById("det-s-nama").innerText = s.nama_sparepart || s.nama;
        document.getElementById("det-s-merk").innerText = s.merk || "-";
        document.getElementById("det-s-kategori").innerText = s.kategori || "-";
        document.getElementById("det-s-harga").innerText = `Rp ${Number(s.harga).toLocaleString("id-ID")}`;
        document.getElementById("det-s-stok").innerText = `${s.stok} Unit Tersedia`;
        document.getElementById("det-s-deskripsi").innerText = s.deskripsi || "Tidak ada deskripsi produk.";
        document.getElementById("det-s-page-title").innerText = `Katalog: ${s.nama_sparepart || s.nama}`;
        
        const imgElement = document.getElementById("det-s-gambar");
        imgElement.src = s.gambar || "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=500";
        imgElement.onerror = () => { imgElement.src = "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=500"; };

        switchView('sparepart-detail');
    } catch (err) { alert("Gagal memuat katalog detail sparepart."); }
}

function openSparepartModal() {
    document.getElementById("sparepart-modal-title").innerText = "Tambah Sparepart Baru";
    document.getElementById("form-s-id").value = "";
    document.getElementById("form-data-sparepart").reset();
    bsSparepartModal.show();
}

function openEditSparepartModal(s) {
    document.getElementById("sparepart-modal-title").innerText = "Edit & Update Stok";
    document.getElementById("form-s-id").value = s.id;
    document.getElementById("form-s-nama").value = s.nama || "";
    document.getElementById("form-s-merk").value = s.merk || "";
    document.getElementById("form-s-kategori").value = s.kategori || "";
    document.getElementById("form-s-harga").value = s.harga || 0;
    document.getElementById("form-s-stok").value = s.stok || 0;
    document.getElementById("form-s-gambar").value = s.gambar || "";
    document.getElementById("form-s-deskripsi").value = s.deskripsi || "";
    bsSparepartModal.show();
}

async function saveSparepart(e) {
    e.preventDefault();
    const id = document.getElementById("form-s-id").value;
    const payload = {
        nama: document.getElementById("form-s-nama").value,
        merk: document.getElementById("form-s-merk").value,
        kategori: document.getElementById("form-s-kategori").value,
        harga: Number(document.getElementById("form-s-harga").value),
        stok: Number(document.getElementById("form-s-stok").value),
        gambar: document.getElementById("form-s-gambar").value,
        deskripsi: document.getElementById("form-s-deskripsi").value
    };
    try {
        let method = id ? "PUT" : "POST";
        let url = id ? `${API_URL}/sparepart/${id}` : `${API_URL}/sparepart`;
        const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if(res.ok) { bsSparepartModal.hide(); loadSparepart(); switchView('sparepart-list'); }
    } catch (err) { console.error(err);}
}

async function deleteSparepart(id) {
    if(confirm("Hapus produk sparepart ini dari katalog?")) {
        try {
            const res = await fetch(`${API_URL}/sparepart/${id}`, { method: "DELETE" });
            if(res.ok) loadSparepart();
        } catch (err) { console.error(err); }
    }
}