// ==================== AREA 4: RIWAYAT SERVICE ====================
let currentActiveRiwayatId = null;

async function loadAllHistoryService() {
    try {
        const response = await fetch(`${API_URL}/riwayat-service/detail`);
        allHistoryService = await response.json();
        renderRiwayatTable(allHistoryService);
    } catch (err) { console.error("Gagal mengambil data semua riwayat service:", err); }
}

async function loadVehiclesForDropdown() {
    try {
        const response = await fetch(`${API_URL}/kendaraan`);
        allVehiclesDropdown = await response.json();
    } catch (err) { console.error(err); }
}

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

async function loadSparepartDigunakan(idNota) {
    try {
        const resSparepart = await fetch(`${API_URL}/sparepart-digunakan/riwayat/${idNota}`);
        const sparepartMasingMasing = await resSparepart.json();
        
        const spTbody = document.getElementById("det-full-r-sparepart-list");
        if (!spTbody) return;
        
        if (sparepartMasingMasing.length === 0) {
            spTbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4 bg-light">Nota ini bersih dari pergantian komponen onderdil.</td></tr>`;
            return;
        }
        
        spTbody.innerHTML = ""; 
            
        sparepartMasingMasing.forEach(sp => {
            const detailSparepart = sp.Sparepart || sp.sparepart;
            const namaBarang = detailSparepart ? (detailSparepart.nama_sparepart || detailSparepart.nama) : `Barang ID #${sp.id_sparepart}`;
            const merkBarang = detailSparepart && detailSparepart.merk ? `[${detailSparepart.merk}]` : "";

            const hargaSatuan = detailSparepart ? Number(detailSparepart.harga).toLocaleString("id-ID") : "0";
            const totalHarga = detailSparepart ? Number(detailSparepart.harga * sp.jumlah).toLocaleString("id-ID") : "0";

            spTbody.innerHTML += `
                <tr>
                    <td>
                        <span class="fw-bold text-dark">${namaBarang}</span>
                        <small class="text-muted d-block">${merkBarang}</small>
                    </td>
                    <td class="text-secondary">${hargaSatuan}</td>
                    <td><span class="badge bg-light text-dark border px-3 py-2">${sp.jumlah} Pcs</span></td>
                    <td class="fw-semibold text-dark">${totalHarga}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-outline-danger shadow-sm py-1" onclick="hapusSparepartTerpasang(${sp.id})">
                            Hapus
                        </button>
                    </td>
                </tr>`;
        });
    } catch (err) {
        console.error("Gagal memuat rincian sparepart ke dalam tabel:", err);
    }
}

async function goToFullRiwayatDetailPage(id) {
    currentActiveRiwayatId = id;
    try {
        const response = await fetch(`${API_URL}/riwayat-service/detail/${id}`);
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

        // Alihkan rendering tabel sparepart sepenuhnya ke fungsi load mandiri agar tidak bentrok/menumpuk
        await loadSparepartDigunakan(id);

        switchView('riwayat-detail');
    } catch (err) { 
        console.error(err);
        alert("Gagal memuat rincian mendalam nota service.");
    }
}

function openServiceModal() {
    document.getElementById("service-modal-title").innerText = "Catat Service Baru";
    document.getElementById("form-r-id").value = "";
    document.getElementById("form-data-service").reset();
    
    setupServiceDropdowns();
    bsServiceFormModal.show();
}

function openEditServiceModal(r) {
    document.getElementById("service-modal-title").innerText = "Edit Catatan Service";
    document.getElementById("form-r-id").value = r.id;
    
    setupServiceDropdowns();
    
    document.getElementById("form-r-kendaraan").value = r.id_kendaraan || "";
    document.getElementById("form-r-mekanik").value = r.id_mekanik || "";
    document.getElementById("form-r-keluhan").value = r.keluhan || "";
    document.getElementById("form-r-pelayanan").value = r.pelayanan || "";
    document.getElementById("form-r-status").value = r.status || "";
    bsServiceFormModal.show();
}

function setupServiceDropdowns() {
    const selectKendaraan = document.getElementById("form-r-kendaraan");
    const selectMekanik = document.getElementById("form-r-mekanik");

    selectKendaraan.innerHTML = `<option value="">-- Pilih Kendaraan (Plat Nomor) --</option>`;
    allVehiclesDropdown.forEach(k => {
        selectKendaraan.innerHTML += `<option value="${k.id}">${k.merk} - ${k.plat}</option>`;
    });

    selectMekanik.innerHTML = `<option value="">-- Pilih Mekanik --</option>`;
    allMechanics.forEach(m => {
        selectMekanik.innerHTML += `<option value="${m.id}">${m.nama}</option>`;
    });
}

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
            loadAllHistoryService();
            switchView('riwayat-list');
        } else {
            alert("Gagal menyimpan data, periksa kembali inputan Anda.");
        }
    } catch (err) { console.error(err); }
}

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

function openTambahSparepartModal() {
    document.getElementById("form-sd-sparepart").value = "";
    document.getElementById("form-sparepart-service").reset();
    document.getElementById("dropdownSdBtn").querySelector("span").innerText = "-- Cari Nama / Merk Sparepart --";

    const listContainer = document.getElementById("list-sd-options");
    const searchInput = document.getElementById("searchSdInput");
    
    listContainer.innerHTML = "";
    searchInput.value = "";
    
    allSpareparts.forEach(s => {
        const li = document.createElement("li");
        const formatHarga = Number(s.harga).toLocaleString("id-ID");
        li.innerHTML = `
            <a class="dropdown-item d-flex justify-content-between align-items-center py-2" href="#" data-id="${s.id}">
                <div>
                    <span class="fw-bold text-dark class-nama-sp">${s.nama_sparepart || s.nama}</span>
                    <small class="text-muted d-block">Stok: ${s.stok} unit</small>
                </div>
                <span class="badge bg-secondary-subtle text-secondary px-2 py-1">Rp ${formatHarga}</span>
            </a>`;
        listContainer.appendChild(li);
    });

    searchInput.oninput = function() {
        const filter = searchInput.value.toLowerCase();
        const items = listContainer.getElementsByTagName("li");
        for (let i = 0; i < items.length; i++) {
            const text = items[i].textContent.toLowerCase();
            items[i].classList.toggle("d-none", !text.includes(filter));
        }
    };

    listContainer.onclick = function(e) {
        e.preventDefault();
        const item = e.target.closest(".dropdown-item");
        if (!item) return;

        document.getElementById("form-sd-sparepart").value = item.getAttribute("data-id");
        const namaSaja = item.querySelector(".class-nama-sp").innerText;
        document.getElementById("dropdownSdBtn").querySelector("span").innerText = namaSaja;
    };

    if (!bsSparepartServiceModal) {
        bsSparepartServiceModal = new bootstrap.Modal(document.getElementById('sparepartServiceModal'));
    }
    bsSparepartServiceModal.show();
}

async function saveSparepartKeRiwayat(e) {
    e.preventDefault();
    const idSparepart = document.getElementById("form-sd-sparepart").value;
    const jumlah = document.getElementById("form-sd-jumlah").value;

    if (!idSparepart) {
        alert("Pilih jenis sparepart terlebih dahulu dari daftar!");
        return;
    }

    const payload = {
        id_riwayat: Number(currentActiveRiwayatId), 
        id_sparepart: Number(idSparepart),
        jumlah: Number(jumlah)
    };

    try {
        const res = await fetch(`${API_URL}/sparepart-digunakan`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            bsSparepartServiceModal.hide();
            // Memberi jeda aman 300ms agar database lokal selesai menulis, data langsung sinkron tanpa delay
            setTimeout(() => {
                loadSparepartDigunakan(currentActiveRiwayatId);
            }, 300);
        } else {
            alert("Gagal menambahkan sparepart. Periksa kembali ketersediaan stok katalog.");
        }
    } catch (err) { console.error(err); }
}

async function hapusSparepartTerpasang(id) {
    if (confirm("Batalkan penggunaan sparepart ini dari unit motor pelanggan?")) {
        try {
            const res = await fetch(`${API_URL}/sparepart-digunakan/${id}`, { method: "DELETE" });
            if (res.ok) {
                setTimeout(() => {
                    loadSparepartDigunakan(currentActiveRiwayatId);
                }, 300);
            }
        } catch (err) { console.error(err); }
    }
}