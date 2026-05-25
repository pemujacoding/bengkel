const API_URL = "http://localhost:3000/data";

// Inisialisasi Instance Modal Bootstrap secara global
let bsCustomerModal, bsMekanikModal, bsSparepartModal, bsRiwayatModal,bsServiceFormModal, bsTransaksiFormModal;

let allCustomers = [];
let allMechanics = [];
let allSpareparts = [];
let allHistoryService = []; 
let allVehiclesDropdown = [];
let allTransactions = [];

document.addEventListener("DOMContentLoaded", () => {
    // Daftarkan elemen modal ke engine Bootstrap 5
    bsCustomerModal = new bootstrap.Modal(document.getElementById('customerModal'));
    bsMekanikModal = new bootstrap.Modal(document.getElementById('mekanikModal'));
    bsSparepartModal = new bootstrap.Modal(document.getElementById('sparepartModal'));
    bsRiwayatModal = new bootstrap.Modal(document.getElementById('riwayatModal'));
    bsServiceFormModal = new bootstrap.Modal(document.getElementById('serviceFormModal'));
    bsTransaksiFormModal = new bootstrap.Modal(document.getElementById('transaksiFormModal'));

    loadPelanggan();
    loadMekanik();
    loadSparepart();
    loadAllHistoryService();
    loadVehiclesForDropdown();
    loadAllTransactions();

});

// ==================== GLOBAL ROUTER NAVIGASI (D-NONE UTILITY) ====================
function switchView(viewName) {
    // Sembunyikan semua panel (Bootstrap memakai d-none)
    document.querySelectorAll('.view-panel').forEach(panel => panel.classList.add('d-none'));
    
    // Reset status active link sidebar
    document.querySelectorAll('.sidebar-menu').forEach(menu => menu.classList.remove('active', 'bg-info', 'text-dark'));

    if (viewName === 'home') {
        document.getElementById('menu-home').classList.add('active');
        document.getElementById('view-home').classList.remove('d-none');
    }
    else if (viewName === 'pelanggan-list' || viewName === 'detail') {
        const menu = document.getElementById('menu-pelanggan');
        menu.classList.add('active');
        document.getElementById(viewName === 'pelanggan-list' ? 'view-pelanggan-list' : 'view-detail-page').classList.remove('d-none');
    } 
    else if (viewName === 'mekanik-list' || viewName === 'mekanik-detail') {
        const menu = document.getElementById('menu-mekanik');
        menu.classList.add('active');
        document.getElementById(viewName === 'mekanik-list' ? 'view-mekanik-list' : 'view-mekanik-detail').classList.remove('d-none');
    } 
    else if (viewName === 'sparepart-list' || viewName === 'sparepart-detail') {
        const menu = document.getElementById('menu-sparepart');
        menu.classList.add('active');
        document.getElementById(viewName === 'sparepart-list' ? 'view-sparepart-list' : 'view-sparepart-detail').classList.remove('d-none');
    }
    else if (viewName === 'riwayat-list' || viewName === 'riwayat-detail') {
        document.getElementById('menu-riwayat').classList.add('active');
        document.getElementById(viewName === 'riwayat-list' ? 'view-riwayat-list' : 'view-riwayat-detail').classList.remove('d-none');
    }
    else if (viewName === 'transaksi-list' || viewName === 'transaksi-detail') {
        const menu = document.getElementById('menu-transaksi');
        menu.classList.add('active');
        document.getElementById(viewName === 'transaksi-list' ? 'view-transaksi-list' : 'view-transaksi-detail').classList.remove('d-none');
    }

}


// ==================== AREA 1: DATA PELANGGAN ====================
async function loadPelanggan() {
    try {
        const response = await fetch(`${API_URL}/pelanggan`);
        allCustomers = await response.json();
        renderPelangganTable(allCustomers);
    } catch (err) { console.error(err); }
}

function renderPelangganTable(data) {
    const tbody = document.getElementById("list-pelanggan-body");
    tbody.innerHTML = data.length === 0 ? `<tr><td colspan="3" class="text-center text-muted py-3">Tidak ada data pelanggan.</td></tr>` : "";
    data.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td><span class="badge bg-light text-dark border">#${p.id}</span></td>
                <td><a href="#" class="fw-semibold text-decoration-none text-primary" onclick="goToPelangganDetailPage(${p.id})">${p.nama}</a></td>
                <td class="text-center">
                    <button class="btn btn-sm btn-warning text-white me-1" onclick="openEditModal(${JSON.stringify(p).replace(/"/g, '&quot;')})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deletePelanggan(${p.id})">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function handleSearch() {
    const query = document.getElementById("search-input").value.toLowerCase().trim();
    if(!query) { renderPelangganTable(allCustomers); return; }
    const filtered = allCustomers.filter(p => p.id.toString() == query || p.nama.toLowerCase().includes(query));
    renderPelangganTable(filtered);
}

async function goToPelangganDetailPage(id) {
    try {
        const resPelanggan = await fetch(`${API_URL}/pelanggan/${id}`);
        const p = await resPelanggan.json();

        document.getElementById("det-p-id").innerText = p.id;
        document.getElementById("det-p-nama").innerText = p.nama;
        document.getElementById("det-p-telp").innerText = p.no_telp;
        document.getElementById("det-p-alamat").innerText = p.alamat;
        document.getElementById("det-page-title").innerText = `Profil: ${p.nama}`;

        const resKendaraan = await fetch(`${API_URL}/kendaraan/pelanggan/${id}`);
        const kList = await resKendaraan.json();
        const kUl = document.getElementById("det-p-kendaraan-list");
        kUl.innerHTML = kList.length === 0 ? "<li class='list-group-item text-muted'>Belum ada kendaraan terdaftar.</li>" : "";
        document.getElementById("sub-riwayat-area").classList.add("d-none");

        kList.forEach(k => {
            kUl.innerHTML += `<li class="list-group-item list-group-item-action" onclick="loadRiwayatKendaraan(this, ${k.id}, '${k.merk}')">🚗 <strong>${k.merk}</strong> (${k.jenis}) - <span class="font-monospace">${k.plat}</span></li>`;
        });
        switchView('detail');
    } catch (err) { alert("Gagal memuat detail pelanggan."); }
}

async function loadRiwayatKendaraan(element, idKendaraan, merk) {
    document.querySelectorAll("#det-p-kendaraan-list li").forEach(li => li.classList.remove("active"));
    element.classList.add("active");
    try {
        const response = await fetch(`${API_URL}/riwayat-service/kendaraan/${idKendaraan}`);
        const riwayatList = await response.json();
        const rUl = document.getElementById("det-k-riwayat-list");
        rUl.innerHTML = riwayatList.length === 0 ? "<div class='p-3 text-muted bg-light rounded text-center'>Belum ada catatan servis.</div>" : "";
        document.getElementById("sub-riwayat-title").innerText = `Riwayat Service: ${merk}`;

        riwayatList.forEach(r => {
            const tgl = new Date(r.tanggal).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
            rUl.innerHTML += `<button class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" onclick="openNotaPopUp(${r.id})"><span>🛠️ Nota Transaksi #${r.id}</span> <span class="badge text-secondary bg-light fw-normal">${tgl}</span></button>`;
        });
        
        
        document.getElementById("sub-riwayat-area").classList.remove("d-none");
    } catch (err) { alert("Gagal memuat riwayat service."); }
}

async function openNotaPopUp(idRiwayat) {
    try {
        const response = await fetch(`${API_URL}/riwayat-service/detail/${idRiwayat}`);
        const r = await response.json();
        document.getElementById("info-riwayat-data").innerHTML = `
            <div class="p-3 bg-light rounded border border-light-subtle mb-3" style="line-height: 1.8;">
                <p class="m-0"><strong>Keluhan Utama:</strong> <span class="text-danger">${r.keluhan || '-'}</span></p>
                <p class="m-0"><strong>Tindakan Pelayanan:</strong> ${r.pelayanan || '-'}</p>
                <hr class="my-2 opacity-50">
                <p class="m-0 fs-7"><strong>Unit Kendaraan:</strong> ${r.kendaraan ? r.kendaraan.merk + ' ('+r.kendaraan.plat+')' : '-'}</p>
                <p class="m-0 fs-7"><strong>Mekanik:</strong> ${r.mekanik ? r.mekanik.nama : '-'}</p>
            </div>
        `;
        const resSparepart = await fetch(`${API_URL}/sparepart-digunakan/riwayat/${idRiwayat}`); 
        const sparepartMasingMasing = await resSparepart.json();
        const spUl = document.getElementById("det-r-sparepart-list");
        spUl.innerHTML = sparepartMasingMasing.length === 0 ? "<li class='list-group-item text-muted text-center py-2'>Tidak ada pergantian sparepart.</li>" : "";
        
        sparepartMasingMasing.forEach(sp => {
            const detailSparepart = sp.Sparepart || sp.sparepart;
            const namaBarang = detailSparepart ? (detailSparepart.nama_sparepart || detailSparepart.nama) : `ID #${sp.id_sparepart}`;
            spUl.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">${namaBarang} <span class="badge bg-primary rounded-pill">${sp.jumlah} Pcs</span></li>`;
        });
        
        bsRiwayatModal.show(); // Buka modal Bootstrap
    } catch (err) { alert("Gagal membuka rincian nota."); }
}

function openAddModal() {
    document.getElementById("modal-title").innerText = "Tambah Pelanggan Baru";
    document.getElementById("form-id").value = "";
    document.getElementById("form-pelanggan").reset();
    bsCustomerModal.show();
}

function openEditModal(p) {
    document.getElementById("modal-title").innerText = "Edit Data Pelanggan";
    document.getElementById("form-id").value = p.id;
    document.getElementById("form-nama").value = p.nama;
    document.getElementById("form-telp").value = p.no_telp;
    document.getElementById("form-alamat").value = p.alamat;
    bsCustomerModal.show();
}

async function savePelanggan(e) {
    e.preventDefault();
    const id = document.getElementById("form-id").value;
    const payload = {
        nama: document.getElementById("form-nama").value,
        no_telp: document.getElementById("form-telp").value,
        alamat: document.getElementById("form-alamat").value
    };
    try {
        let method = id ? "PUT" : "POST";
        let url = id ? `${API_URL}/pelanggan/${id}` : `${API_URL}/pelanggan`;
        const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if(res.ok) { bsCustomerModal.hide(); loadPelanggan(); switchView('pelanggan-list'); }
    } catch (err) { console.error(err); }
}

async function deletePelanggan(id) {
    if(confirm("Hapus data pelanggan ini?")) {
        try {
            const res = await fetch(`${API_URL}/pelanggan/${id}`, { method: "DELETE" });
            if(res.ok) loadPelanggan();
        } catch (err) { console.error(err); }
    }
}


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
    document.getElementById("form-s-nama").value = s.nama_sparepart || s.nama || "";
    document.getElementById("form-s-merk").value = s.merk || "";
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
        nama_sparepart: document.getElementById("form-s-nama").value,
        merk: document.getElementById("form-s-merk").value,
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
    } catch (err) { console.error(err); }
}

// ==================== AREA 4: SEMUA RIWAYAT SERVICE (CRUD + DRILLDOWN) ====================

// 1. Muat data semua riwayat dari backend
async function loadAllHistoryService() {
    try {
        const response = await fetch(`${API_URL}/riwayat-service/detail`);
        allHistoryService = await response.json();
        renderRiwayatTable(allHistoryService);
    } catch (err) { console.error("Gagal mengambil data semua riwayat service:", err); }
}

// Helper untuk fetch master kendaraan buat drop-down form entri
async function loadVehiclesForDropdown() {
    try {
        const response = await fetch(`${API_URL}/kendaraan`); // Endpoint get all kendaraan
        allVehiclesDropdown = await response.json();
    } catch (err) { console.error(err); }
}

// 2. Render ke dalam komponen tabel Bootstrap
function renderRiwayatTable(data) {
    const tbody = document.getElementById("list-riwayat-body");
    tbody.innerHTML = data.length === 0 ? `<tr><td colspan="6" class="text-center text-muted py-3">Tidak ada riwayat aktivitas service.</td></tr>` : "";
    
    data.forEach(r => {
        const namaMekanik = r.mekanik ? r.mekanik.nama : `<span class="text-muted small"><em>Belum diset</em></span>`;
        const spekKendaraan = r.kendaraan ? `${r.kendaraan.merk} (${r.kendaraan.plat})` : `<span class="text-danger small">Unit Terhapus</span>`;
        const tglService = new Date(r.tanggal).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' });
        const badgeStatus = (r.status === 'selesai') ? 'bg-success' : 'bg-warning text-dark';
        tbody.innerHTML += `
            <tr>
                <td><span class="badge bg-dark border">#NOT-${r.id}</span></td>
                <td class="fw-semibold text-secondary">${spekKendaraan}</td>
                <td>👤 ${namaMekanik}</td>
                <td><span class="badge ${badgeStatus}">${r.status}</span></td>
                <td><small>${tglService}</small></td>
                <td class="text-center">
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-info text-white" onclick="goToFullRiwayatDetailPage(${r.id})">Detail</button>
                        <button class="btn btn-sm btn-warning text-white" onclick="openEditServiceModal(${JSON.stringify(r).replace(/"/g, '&quot;')})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteService(${r.id})">Hapus</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

// 3. Sistem Pencarian / Filter Riwayat Global
function handleSearchRiwayat() {
    const query = document.getElementById("search-riwayat").value.toLowerCase().trim();
    if(!query) { renderRiwayatTable(allHistoryService); return; }
    
    const filtered = allHistoryService.filter(r => {
        const idNota = r.id.toString();
        const keluhan = (r.keluhan || "").toLowerCase();
        const namaMekanik = r.mekanik ? r.mekanik.nama.toLowerCase() : "";
        const platMobil = r.kendaraan ? r.kendaraan.plat.toLowerCase() : "";
        const pemilik = r.kendaraan && r.kendaraan.pelanggan ? r.kendaraan.pelanggan.nama.toLowerCase() : "";

        return idNota === query || keluhan.includes(query) || namaMekanik.includes(query) || platMobil.includes(query) || pemilik.includes(query);
    });
    renderRiwayatTable(filtered);
}

// 4. Halaman Detail Kategori Utama (Drill down penuh)
async function goToFullRiwayatDetailPage(idNota) {
    try {
        const response = await fetch(`${API_URL}/riwayat-service/detail/${idNota}`);
        const r = await response.json();
        
        const tgl = new Date(r.tanggal).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' });
        
        document.getElementById("det-full-r-id").innerText = `#NOT-${r.id}`;
        document.getElementById("det-full-r-tgl").innerText = tgl;
        document.getElementById("det-full-r-pelanggan").innerText = r.kendaraan && r.kendaraan.pelanggan ? r.kendaraan.pelanggan.nama : "-";
        document.getElementById("det-full-r-kendaraan").innerText = r.kendaraan ? `${r.kendaraan.merk} [${r.kendaraan.jenis}] (${r.kendaraan.plat})` : "-";
        document.getElementById("det-full-r-mekanik").innerText = r.mekanik ? r.mekanik.nama : "Tidak Diketahui";
        document.getElementById("det-full-r-keluhan").innerText = r.keluhan || "Tidak ada keluhan tertulis.";
        document.getElementById("det-full-r-pelayanan").innerText = r.pelayanan || "Belum ada tindakan perbaikan.";
        document.getElementById("det-full-r-status").innerText = r.status || "None";
        document.getElementById("det-r-page-title").innerText = `Nota Layanan #${r.id}`;

        // Load list sparepart terpakai untuk nota ini
        const resSparepart = await fetch(`${API_URL}/sparepart-digunakan/riwayat/${idNota}`); 
        const sparepartMasingMasing = await resSparepart.json();
        const spUl = document.getElementById("det-full-r-sparepart-list");
        spUl.innerHTML = sparepartMasingMasing.length === 0 ? "<li class='list-group-item text-muted text-center py-3 bg-light'>Nota ini bersih dari pergantian komponen onderdil.</li>" : "";
        
        sparepartMasingMasing.forEach(sp => {
            const detailSparepart = sp.Sparepart || sp.sparepart;
            const namaBarang = detailSparepart ? (detailSparepart.nama_sparepart || detailSparepart.nama) : `Barang ID #${sp.id_sparepart}`;
            const merkBarang = detailSparepart && detailSparepart.merk ? `[${detailSparepart.merk}]` : "";
            
            spUl.innerHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-light">
                    <div>
                        <span class="fw-bold text-dark">${namaBarang}</span> 
                        <small class="text-muted ms-1">${merkBarang}</small>
                    </div>
                    <span class="badge bg-primary px-3 py-2 rounded-pill">${sp.jumlah} Pcs</span>
                </li>`;
        });

        switchView('riwayat-detail');
    } catch (err) { 
        console.error(err);
        alert("Gagal memuat rincian mendalam nota service."); 
    }
}

// 5. Setup & Buka Modal Form Tambah
function openServiceModal() {
    document.getElementById("service-modal-title").innerText = "Catat Service Baru";
    document.getElementById("form-r-id").value = "";
    document.getElementById("form-data-service").reset();
    
    // Sinkronisasi opsi dropdown kendaraan secara dinamis
    setupServiceDropdowns();
    bsServiceFormModal.show();
}

// 6. Setup & Buka Modal Form Edit
function openEditServiceModal(r) {
    document.getElementById("service-modal-title").innerText = "Edit Catatan Service";
    document.getElementById("form-r-id").value = r.id;
    
    setupServiceDropdowns();
    
    // Pasang data lama ke dalam form input
    document.getElementById("form-r-kendaraan").value = r.id_kendaraan || "";
    document.getElementById("form-r-mekanik").value = r.id_mekanik || "";
    document.getElementById("form-r-keluhan").value = r.keluhan || "";
    document.getElementById("form-r-pelayanan").value = r.pelayanan || "";
    document.getElementById("form-r-status").value = r.status || "";
    
    bsServiceFormModal.show();
}

// Helper untuk membangun isi select option kendaraan & mekanik
function setupServiceDropdowns() {
    const selectKendaraan = document.getElementById("form-r-kendaraan");
    const selectMekanik = document.getElementById("form-r-mekanik");

    // Isi dropdown kendaraan
    selectKendaraan.innerHTML = `<option value="">-- Pilih Kendaraan (Plat Nomor) --</option>`;
    allVehiclesDropdown.forEach(k => {
        selectKendaraan.innerHTML += `<option value="${k.id}">${k.merk} - ${k.plat}</option>`;
    });

    // Isi dropdown mekanik dari master data allMechanics (Fitur 2)
    selectMekanik.innerHTML = `<option value="">-- Pilih Mekanik --</option>`;
    allMechanics.forEach(m => {
        selectMekanik.innerHTML += `<option value="${m.id}">${m.nama}</option>`;
    });
}

// 7. Simpan Aksi (POST / PUT) ke API Backend
async function saveService(e) {
    e.preventDefault();
    const id = document.getElementById("form-r-id").value;
    const payload = {
        id_kendaraan: Number(document.getElementById("form-r-kendaraan").value),
        id_mekanik: Number(document.getElementById("form-r-mekanik").value),
        keluhan: document.getElementById("form-r-keluhan").value,
        pelayanan: document.getElementById("form-r-pelayanan").value,
        status: document.getElementById("form-r-status").value
    };
    
    try {
        let method = id ? "PUT" : "POST";
        let url = id ? `${API_URL}/riwayat-service/${id}` : `${API_URL}/riwayat-service`;
        
        const res = await fetch(url, { 
            method, 
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify(payload) 
        });
        
        if(res.ok) { 
            bsServiceFormModal.hide(); 
            loadAllHistoryService(); // Segarkan data tabel
            switchView('riwayat-list'); 
        } else {
            alert("Gagal menyimpan data, periksa kembali inputan Anda.");
        }
    } catch (err) { console.error(err); }
}

// 8. Hapus Record Aktivitas Service
async function deleteService(id) {
    if(confirm("Apakah Anda yakin ingin menghapus permanen catatan service nota ini?")) {
        try {
            const res = await fetch(`${API_URL}/riwayat-service/${id}`, { method: "DELETE" });
            if(res.ok) {
                loadAllHistoryService();
            } else {
                alert("Gagal menghapus data dari server.");
            }
        } catch (err) { console.error(err); }
    }
}

async function deleteSparepart(id) {
    if(confirm("Hapus produk sparepart ini dari katalog?")) {
        try {
            const res = await fetch(`${API_URL}/sparepart/${id}`, { method: "DELETE" });
            if(res.ok) loadSparepart();
        } catch (err) { console.error(err); }
    }
}

// ==================== AREA 5: MANAJEMEN TRANSAKSI KASIR ====================

// 1. Ambil data dari route controller getAll
async function loadAllTransactions() {
    try {
        const response = await fetch(`${API_URL}/transaksi`); 
        allTransactions = await response.json();
        renderTransaksiTable(allTransactions);
    } catch (err) { console.error("Gagal mengambil data transaksi:", err); }
}

// 2. Render data array ke tabel list
function renderTransaksiTable(data) {
    const tbody = document.getElementById("list-transaksi-body");
    tbody.innerHTML = data.length === 0 ? `<tr><td colspan="6" class="text-center text-muted py-3">Belum ada invoice transaksi kasir masuk.</td></tr>` : "";
    
    data.forEach(t => {
        const rupiahFormat = Number(t.nominal || 0).toLocaleString("id-ID");
        const badgeStatus = (t.status === 'Lunas') ? 'bg-success' : 'bg-warning text-dark';
        
        tbody.innerHTML += `
            <tr>
                <td><span class="badge bg-light text-dark border fw-mono">#INV-${t.id}</span></td>
                <td><span class="text-secondary fw-semibold">Nota Service #${t.id_riwayat}</span></td>
                <td class="fw-bold text-dark">Rp ${rupiahFormat}</td>
                <td><small class="text-muted">${t.metode || 'Tunai'}</small></td>
                <td><span class="badge ${badgeStatus}">${t.status}</span></td>
                <td class="text-center">
                    <div class="btn-group">
                        <button class="btn btn-sm btn-info text-white" onclick="goToTransaksiDetailPage(${t.id})">Detail</button>
                        <button class="btn btn-sm btn-warning text-white" onclick="openEditTransaksiModal(${JSON.stringify(t).replace(/"/g, '&quot;')})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteTransaksi(${t.id})">Hapus</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

// 3. Kolom Pencarian Transaksi
function handleSearchTransaksi() {
    const query = document.getElementById("search-transaksi").value.toLowerCase().trim();
    if(!query) { renderTransaksiTable(allTransactions); return; }
    
    const filtered = allTransactions.filter(t => {
        return t.id.toString() === query || 
               t.id_riwayat.toString() === query || 
               (t.status || "").toLowerCase().includes(query) ||
               (t.metode_pembayaran || t.metode || "").toLowerCase().includes(query);
    });
    renderTransaksiTable(filtered);
}

// 4. Lihat Rincian Invoice Tunggal (Controller getById)
async function goToTransaksiDetailPage(id) {
    try {
        const response = await fetch(`${API_URL}/transaksi/${id}`);
        const t = await response.json();
        
        const tglText = t.tanggal ? new Date(t.tanggal).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "-";
        const totalUang = Number(t.nominal || 0).toLocaleString("id-ID");
        
        document.getElementById("det-t-invoice-id").innerText = `#INV-${t.id}`;
        document.getElementById("det-t-riwayat-id").innerText = t.id_riwayat;
        document.getElementById("det-t-tanggal").innerText = tglText;
        document.getElementById("det-t-total").innerText = `Rp ${totalUang}`;
        document.getElementById("det-t-metode").innerText = t.metode_pembayaran || t.metode || "Tunai";
        document.getElementById("det-t-page-title").innerText = `Invoice Tagihan #${t.id}`;
        
        // Atur badge status dinamis di halaman detail
        const statusEl = document.getElementById("det-t-status");
        statusEl.innerText = t.status;
        statusEl.className = `badge p-2 mt-1 fs-6 w-100 ${(t.status === 'Lunas') ? 'bg-success' : 'bg-warning text-dark'}`;
        
        // Hubungkan tombol di footer invoice agar bisa melompat langsung ke detail kerusakan mekaniknya di Fitur 4
        document.getElementById("btn-lihat-service-terkait").onclick = () => {
            goToFullRiwayatDetailPage(t.id_riwayat);
        };

        switchView('transaksi-detail');
    } catch (err) { alert("Gagal mengambil lembar invoice."); }
}

// 5. Buka Modal Form Catat Baru (Menghubungkan Dropdown ke ID Riwayat Service yang sudah ada)
function openTransaksiModal() {
    document.getElementById("transaksi-modal-title").innerText = "Buat Invoice Kasir Baru";
    document.getElementById("form-t-id").value = "";
    document.getElementById("form-data-transaksi").reset();
    
    // Tarik id dari master list allHistoryService (Fitur 4) agar kasir tidak salah input manual nomor service-nya
    const selectRiwayat = document.getElementById("form-t-riwayat");
    selectRiwayat.innerHTML = `<option value="">-- Pilih ID Riwayat Service --</option>`;
    allHistoryService.forEach(r => {
        const unit = r.kendaraan ? ` - ${r.kendaraan.merk} (${r.kendaraan.plat})` : "";
        selectRiwayat.innerHTML += `<option value="${r.id}">Nota #${r.id}${unit}</option>`;
    });

    bsTransaksiFormModal.show();
}

// 6. Buka Modal Form Edit Data Transaksi (Update)
function openEditTransaksiModal(t) {
    document.getElementById("transaksi-modal-title").innerText = "Perbarui Data Pembayaran Invoice";
    document.getElementById("form-t-id").value = t.id;
    
    const selectRiwayat = document.getElementById("form-t-riwayat");
    selectRiwayat.innerHTML = `<option value="${t.id_riwayat}">Nota #${t.id_riwayat}</option>`;
    
    document.getElementById("form-t-riwayat").value = t.id_riwayat;
    document.getElementById("form-t-total").value = t.nominal || 0;
    document.getElementById("form-t-metode").value = t.metode || "Tunai";
    document.getElementById("form-t-status").value = t.status || "Lunas";

    bsTransaksiFormModal.show();
}

// 7. Simpan Aksi Create & Update menuju API Express
async function saveTransaksi(e) {
    e.preventDefault();
    const id = document.getElementById("form-t-id").value;
    const payload = {
        id_riwayat: Number(document.getElementById("form-t-riwayat").value),
        nominal: Number(document.getElementById("form-t-total").value), // sesuaikan field 'total' atau 'total_biaya' sesuai model database-mu
        metode: document.getElementById("form-t-metode").value,
        status: document.getElementById("form-t-status").value
    };
    
    try {
        let method = id ? "PUT" : "POST";
        let url = id ? `${API_URL}/transaksi/${id}` : `${API_URL}/transaksi`;
        
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        if (res.ok) {
            bsTransaksiFormModal.hide();
            loadAllTransactions();
            switchView('transaksi-list');
        } else {
            alert("Terjadi kekeliruan saat memproses data invoice.");
        }
    } catch (err) { console.error(err); }
}

// 8. Hapus Lembar Transaksi Kasir (Remove)
async function deleteTransaksi(id) {
    if (confirm("Peringatan! Hapus data rekaman invoice keuangan ini secara permanen?")) {
        try {
            const res = await fetch(`${API_URL}/transaksi/${id}`, { method: "DELETE" });
            if (res.ok) loadAllTransactions();
        } catch (err) { console.error(err); }
    }
}