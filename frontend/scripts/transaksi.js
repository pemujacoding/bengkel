// ==================== AREA 5: MANAJEMEN TRANSAKSI KASIR ====================
async function loadAllTransactions() {
    try {
        const response = await fetch(`${API_URL}/transaksi`);
        allTransactions = await response.json();
        renderTransaksiTable(allTransactions);
    } catch (err) { console.error("Gagal mengambil data transaksi:", err); }
}

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
        
        const statusEl = document.getElementById("det-t-status");
        statusEl.innerText = t.status;
        statusEl.className = `badge p-2 mt-1 fs-6 w-100 ${(t.status === 'Lunas') ? 'bg-success' : 'bg-warning text-dark'}`;
        
        document.getElementById("btn-lihat-service-terkait").onclick = () => {
            goToFullRiwayatDetailPage(t.id_riwayat);
        };

        switchView('transaksi-detail');
    } catch (err) { alert("Gagal mengambil lembar invoice."); }
}

function openTransaksiModal() {
    document.getElementById("transaksi-modal-title").innerText = "Buat Invoice Kasir Baru";
    document.getElementById("form-t-id").value = "";
    document.getElementById("form-data-transaksi").reset();
    
    const selectRiwayat = document.getElementById("form-t-riwayat");
    selectRiwayat.innerHTML = `<option value="">-- Pilih ID Riwayat Service --</option>`;
    allHistoryService.forEach(r => {
        const unit = r.kendaraan ? ` - ${r.kendaraan.merk} (${r.kendaraan.plat})` : "";
        selectRiwayat.innerHTML += `<option value="${r.id}">Nota #${r.id}${unit}</option>`;
    });
    bsTransaksiFormModal.show();
}

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

async function saveTransaksi(e) {
    e.preventDefault();
    const id = document.getElementById("form-t-id").value;
    const payload = {
        id_riwayat: Number(document.getElementById("form-t-riwayat").value),
        nominal: Number(document.getElementById("form-t-total").value),
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

async function deleteTransaksi(id) {
    if (confirm("Peringatan! Hapus data rekaman invoice keuangan ini secara permanen?")) {
        try {
            const res = await fetch(`${API_URL}/transaksi/${id}`, { method: "DELETE" });
            if (res.ok) loadAllTransactions();
        } catch (err) { console.error(err); }
    }
}