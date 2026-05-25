// ==================== AREA 6: JADWAL SERVICE ====================
async function loadJadwal() {
    try {
        const response = await fetch(`${API_URL}/jadwal-service`);
        allJadwal = await response.json();
        
        // PERBAIKAN: Mengubah nama fungsi menjadi renderJadwalTable
        renderJadwalTable(allJadwal); 
    } catch (err) { 
        console.error(err); 
    }
}

function renderJadwalTable(data) {
    const tbody = document.getElementById("list-jadwal-body");
    
    tbody.innerHTML = data.length === 0 
        ? `<tr><td colspan="5" class="text-center text-muted py-3">Tidak ada data jadwal.</td></tr>` 
        : "";
    
    data.forEach(j => {
        const tglService = new Date(j.tanggal).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' });

        tbody.innerHTML += `
            <tr>
                <td><span class="badge bg-light text-dark border">#${j.id}</span></td>
                <td><span>${j.id_kendaraan}</span></td>
                <td><a href="#" class="fw-semibold text-decoration-none text-primary" onclick="goToJadwalDetailPage(${j.id})">${j.judul}</a></td>
                <td>${tglService}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-warning text-white me-1" onclick="openEditJadwalModal(${JSON.stringify(j).replace(/"/g, '&quot;')})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteJadwal(${j.id})">Hapus</button>
                </td>
            </tr>
        `;
    });
}
function handleSearchJadwal() {
    const query = document.getElementById("search-jadwal").value.toLowerCase().trim();
    if(!query) { renderMekanikTable(allJadwal); return; }
    const filtered = allJadwal.filter(m => j.id.toString() == query || j.judul.toLowerCase().includes(query) || j.tanggal.toLowerCase().includes(query));
    renderJadwalTable(filtered);
}

async function goToJadwalDetailPage(id) {
    try {
        const res = await fetch(`${API_URL}/jadwal-service/${id}`);
        const j = await res.json();
        const tglService = new Date(j.tanggal).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' });

        document.getElementById("det-j-id").innerText = j.id;
        document.getElementById("det-j-kendaraan").innerText = j.id_kendaraan;
        document.getElementById("det-j-judul").innerText = j.judul;
        document.getElementById("det-j-tanggal").innerText = tglService || "-";
        document.getElementById("det-j-deskripsi").innerText = j.deskripsi || "-";
        document.getElementById("det-j-title").innerText = `Detail Jadwal #${j.id}`;
        switchView('jadwal-detail');
    } catch (err) { alert("Gagal memuat detail jadwal."); }
}

async function loadKendaraanDropdown() {
    try {
        const resKendaraan = await fetch(`${API_URL}/kendaraan`);
        const kList = await resKendaraan.json();
        const selectKendaraan = document.getElementById("form-j-kendaraan");
        
        selectKendaraan.innerHTML = `<option value="">-- Pilih ID Kendaraan Terdaftar --</option>`;
        kList.forEach(k => {
            const unit = k ? `- ${k.merk} (${k.plat})` : "";
            selectKendaraan.innerHTML += `<option value="${k.id}"> ${k.id} ${unit}</option>`;
        });
    } catch (err) {
        console.error("Gagal memuat data kendaraan:", err);
    }
}

async function openJadwalModal() {

    document.getElementById("jadwal-modal-title").innerText = "Buat Invoice Kasir Baru";
    document.getElementById("form-j-id").value = "";
    document.getElementById("form-data-jadwal").reset();
    await loadKendaraanDropdown();
    bsJadwalFormModal.show();
}

async function openEditJadwalModal(j) {
    document.getElementById("jadwal-modal-title").innerText = "Edit Jadwal Service";
    document.getElementById("form-j-id").value = j.id;
    await loadKendaraanDropdown();
    document.getElementById("form-j-kendaraan").value = j.id_kendaraan,
    document.getElementById("form-j-judul").value = j.judul;
    document.getElementById("form-j-tanggal").value = j.tanggal || "";
    document.getElementById("form-j-deskripsi").value = j.deskripsi || "";
    bsJadwalFormModal.show();
}

async function saveJadwal(e) {
    e.preventDefault();
    const id = document.getElementById("form-j-id").value;
    const payload = {
        id_kendaraan: Number(document.getElementById("form-j-kendaraan").value),
        judul: document.getElementById("form-j-judul").value,
        tanggal: document.getElementById("form-j-tanggal").value,
        deskripsi: document.getElementById("form-j-deskripsi").value
    };
    try {
        let method = id ? "PUT" : "POST";
        let url = id ? `${API_URL}/jadwal-service/${id}` : `${API_URL}/jadwal-service`;
        const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if(res.ok) { bsJadwalFormModal.hide(); loadJadwal(); switchView('jadwal-list'); }
    } catch (err) { console.error(err); }
}

async function deleteJadwal(id) {
    if(confirm("Hapus jadwal service ini?")) {
        try {
            const res = await fetch(`${API_URL}/jadwal-service/${id}`, { method: "DELETE" });
            if(res.ok) loadJadwal();
        } catch (err) { console.error(err); }
    }
}