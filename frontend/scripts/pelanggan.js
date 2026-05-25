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
        switchView('pelanggan-detail');
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
        bsRiwayatModal.show();
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