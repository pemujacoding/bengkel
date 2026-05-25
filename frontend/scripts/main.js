const API_URL = "http://localhost:3000/data";


let bsCustomerModal, bsMekanikModal, bsSparepartModal, bsRiwayatModal, bsServiceFormModal, bsTransaksiFormModal,bsSparepartServiceModal;

let allCustomers = [];
let allMechanics = [];
let allSpareparts = [];
let allHistoryService = []; 
let allVehiclesDropdown = [];
let allTransactions = [];

function initBengkelApp() {
    console.log("Menginisialisasi komponen modal dan memuat data API...");
    
    bsCustomerModal = new bootstrap.Modal(document.getElementById('customerModal'));
    bsMekanikModal = new bootstrap.Modal(document.getElementById('mekanikModal'));
    bsSparepartModal = new bootstrap.Modal(document.getElementById('sparepartModal'));
    bsRiwayatModal = new bootstrap.Modal(document.getElementById('riwayatModal'));
    bsServiceFormModal = new bootstrap.Modal(document.getElementById('serviceFormModal'));
    bsTransaksiFormModal = new bootstrap.Modal(document.getElementById('transaksiFormModal'));
    bsSparepartServiceModal = new bootstrap.Modal(document.getElementById('sparepartServiceModal'));
    bsJadwalFormModal = new bootstrap.Modal(document.getElementById('jadwalFormModal'));

    loadPelanggan();
    loadMekanik();
    loadSparepart();
    loadAllHistoryService();
    loadVehiclesForDropdown();
    loadAllTransactions();
    loadJadwal();
}

// ==================== GLOBAL ROUTER NAVIGASI (D-NONE UTILITY) ====================
function switchView(viewName) {
    document.querySelectorAll('.view-panel').forEach(panel => panel.classList.add('d-none'));
    document.querySelectorAll('.sidebar-menu').forEach(menu => menu.classList.remove('active', 'bg-info', 'text-dark'));

    if (viewName === 'home') {
        document.getElementById('menu-home').classList.add('active');
        document.getElementById('view-home').classList.remove('d-none');
    }
    else if (viewName === 'pelanggan-list' || viewName === 'pelanggan-detail') {
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
    else if (viewName === 'jadwal-list' || viewName === 'jadwal-detail') {
        const menu = document.getElementById('menu-jadwal');
        menu.classList.add('active');
        document.getElementById(viewName === 'jadwal-list' ? 'view-jadwal-list' : 'view-jadwal-detail').classList.remove('d-none');
    }
}