-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 25, 2026 at 05:30 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bengkel`
--

-- --------------------------------------------------------

--
-- Table structure for table `jadwal_service`
--

CREATE TABLE `jadwal_service` (
  `id` int(11) NOT NULL,
  `id_kendaraan` int(11) NOT NULL,
  `judul` varchar(50) NOT NULL,
  `tanggal` date NOT NULL,
  `deskripsi` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jadwal_service`
--

INSERT INTO `jadwal_service` (`id`, `id_kendaraan`, `judul`, `tanggal`, `deskripsi`) VALUES
(1, 1, 'Ganti Oli', '2026-05-30', 'Ganti oli setiap 3 bulan'),
(2, 1, 'Ganti Ban', '2026-08-01', 'Kemarin ban sudah mulai tipis, dan perlu diganti biar tidak mudah gembos, katanya mau diganti 3 bulan setelah cek'),
(4, 2, 'Ganti Oli', '2026-05-28', 'Ganti oli setiap 3 bulan'),
(5, 2, 'Service Rutin', '2026-07-30', 'Cek rem. cek sparepart');

-- --------------------------------------------------------

--
-- Table structure for table `kendaraan`
--

CREATE TABLE `kendaraan` (
  `id` int(11) NOT NULL,
  `id_pelanggan` int(11) NOT NULL,
  `jenis` varchar(50) NOT NULL,
  `merk` varchar(100) NOT NULL,
  `plat` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kendaraan`
--

INSERT INTO `kendaraan` (`id`, `id_pelanggan`, `jenis`, `merk`, `plat`) VALUES
(1, 1, 'motor', 'Honda Beat', 'ADXXXXXX'),
(2, 1, 'motor', 'Nmax Yamaha', 'ABYYYYYY');

-- --------------------------------------------------------

--
-- Table structure for table `mekanik`
--

CREATE TABLE `mekanik` (
  `id` int(11) NOT NULL,
  `nama` varchar(200) NOT NULL,
  `no_telp` varchar(20) NOT NULL,
  `alamat` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mekanik`
--

INSERT INTO `mekanik` (`id`, `nama`, `no_telp`, `alamat`) VALUES
(1, 'Aji Pemungkas', '089999999999', ' Jl Setia Kawan III 41-42, Dki Jakarta, Jakarta'),
(2, 'Baharuddin Anthony', '087777777777', 'Jl KH Ahmad Dahlan 23, Semarang, Jawa Tengah');

-- --------------------------------------------------------

--
-- Table structure for table `pelanggan`
--

CREATE TABLE `pelanggan` (
  `id` int(11) NOT NULL,
  `nama` varchar(200) NOT NULL,
  `no_telp` varchar(20) NOT NULL,
  `alamat` text NOT NULL,
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pelanggan`
--

INSERT INTO `pelanggan` (`id`, `nama`, `no_telp`, `alamat`, `username`, `password`) VALUES
(1, 'Sarah Aryandi Nugrahaeni', '083866729293', 'Jl Amarta II no.d9 Depok, Sleman, Yogyakarta', 'sarah', 'f1d2d2f924e986ac86fdf7b36c47bf7c237887355ca370597397738f385155df'),
(2, 'Bambang Sujoyo', '08888888888', 'Jl Babarsari no.100 Tambakbayan, Depok, Sleman, Yogyakarta', 'bambang', 'f1d2d2f924e986ac86fdf7b36c47bf7c237887355ca370597397738f385155df');

-- --------------------------------------------------------

--
-- Table structure for table `riwayat_service`
--

CREATE TABLE `riwayat_service` (
  `id` int(11) NOT NULL,
  `id_kendaraan` int(11) NOT NULL,
  `id_mekanik` int(11) NOT NULL,
  `tanggal` datetime NOT NULL DEFAULT current_timestamp(),
  `keluhan` text NOT NULL,
  `pelayanan` text DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'proses'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `riwayat_service`
--

INSERT INTO `riwayat_service` (`id`, `id_kendaraan`, `id_mekanik`, `tanggal`, `keluhan`, `pelayanan`, `status`) VALUES
(1, 2, 2, '2026-05-24 03:38:47', 'Kampas rem sudah gak enak perlu diganti sama sekalian cek rutin', 'Ganti rem, cek rutin, ganti oli', 'selesai'),
(2, 2, 1, '2026-05-25 08:42:26', 'Balik service karena ban udah tipis, minta diganti dua-duanya', 'Ganti ban', 'selesai'),
(4, 1, 1, '2026-05-24 08:22:34', 'Ganti lampu sama ganti oli', 'Ganti lampu dan oli', 'proses');

-- --------------------------------------------------------

--
-- Table structure for table `sparepart`
--

CREATE TABLE `sparepart` (
  `id` int(11) NOT NULL,
  `nama` varchar(200) NOT NULL,
  `harga` decimal(12,2) NOT NULL,
  `kategori` varchar(100) NOT NULL,
  `merk` varchar(200) NOT NULL,
  `stok` int(11) NOT NULL DEFAULT 0,
  `deskripsi` text DEFAULT NULL,
  `gambar` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sparepart`
--

INSERT INTO `sparepart` (`id`, `nama`, `harga`, `kategori`, `merk`, `stok`, `deskripsi`, `gambar`) VALUES
(1, 'Oli Mesin 10W-40', 85000.00, 'Pelumas', 'Pertamina', 25, 'Oli mesin untuk motor matic dan manual', 'https://www.mobil.co.id/-/media/project/wep/mobil/mobil-id/images/friction-fighter/friction-fighter-fs-square-md.jpg'),
(2, 'Filter Udara Honda Beat', 35000.00, 'Filter', 'Honda', 18, 'Filter udara original Honda Beat', 'https://www.hondacengkareng.com/wp-content/uploads/2016/04/Saringan-Udara-Honda-BeAT-FI-BeAT-eSP-BeAT-POP-eSP.jpg'),
(3, 'Kampas Rem Depan', 45000.00, 'Rem', 'Yamaha', 20, 'Kampas rem depan untuk motor sport', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXE5S9CEp_kUb078d-K89b6F1eNywxxhSAsw&s'),
(4, 'Busi NGK CPR6EA', 28000.00, 'Kelistrikan', 'NGK', 40, 'Busi standar untuk motor 150cc', 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//93/MTA-5022695/ngk_ngk_cpr6ea-9_busi_motor_for_honda_supra_x_125_-_byson_-_blade_-_revo_110_fi_full02_sh1jkite.jpg'),
(5, 'Aki GS Astra GTZ5S', 275000.00, 'Kelistrikan', 'GS Astra', 10, 'Aki kering untuk motor matic', 'https://syailendrateknik.com/wp-content/uploads/2024/08/GTZ-5S.jpg'),
(6, 'Rantai Motor SSS 428', 120000.00, 'Rantai', 'SSS', 12, 'Rantai motor tahan karat', 'https://media.monotaro.id/mid01/big/Otomotif%2C%20Truk%20%26%20Sepeda%20Motor/Aksesoris%20Sepeda/Perkakas%20Perawatan%20Sepeda/Chain%20Related%20Tools/SSS%20Rantai%20SB/SSS%20Rantai%20SB%20GR%20428%20Link%20130%20Gold%201pc/S003558232-2.jpg'),
(7, 'Gear Set Supra X', 185000.00, 'Transmisi', 'Federal', 8, 'Gear set lengkap untuk Honda Supra X', 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//96/MTA-3779042/ahm_ahm-drive-chain-kit---rantai-roda-for-supra-x-125-fi--06401k41n01-_full02.jpg'),
(8, 'Ban Tubeless 90/80-14', 245000.00, 'Ban', 'IRC', 15, 'Ban tubeless untuk motor matic', 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//76/MTA-10412002/irc_ban_motor_luar_irc_80-90-14_ss_530_r_tubeless_full01_oiq1tuop.jpg'),
(9, 'Lampu LED Motor H6', 95000.00, 'Lampu', 'Philips', 30, 'Lampu LED putih terang hemat daya', 'https://down-id.img.susercontent.com/file/73d9ba56b301c9da50a494d9a38ec3ee'),
(10, 'Shockbreaker Belakang', 320000.00, 'Suspensi', 'YSS', 6, 'Shockbreaker belakang motor matic', 'https://www.shop.mydigioto.com/wp-content/uploads/2025/09/GPLUS-STYLO-160.png'),
(11, 'Radiator Coolant', 55000.00, 'Pendingin', 'Prestone', 14, 'Cairan pendingin radiator motor', 'https://cdn.ruparupa.io/fit-in/850x850/filters:format(webp)/filters:watermark(content.ruparupa.io,products/wm/rr.png,0,-0,0,100,100)/ruparupa-com/image/upload/Products/111626_1.jpg'),
(12, 'Filter Oli Yamaha NMAX', 40000.00, 'Filter', 'Yamaha', 17, 'Filter oli original Yamaha NMAX', 'https://down-id.img.susercontent.com/file/id-11134207-7r98u-lr47qzpt9wz8fd'),
(13, 'Kabel Kopling', 38000.00, 'Transmisi', 'Aspira', 22, 'Kabel kopling fleksibel dan kuat', 'https://id-live-01.slatic.net/p/7b5be02a176b1cf37100c58a518e1208.png'),
(14, 'Spion Motor Universal', 65000.00, 'Body', 'Raja Motor', 19, 'Spion universal model sporty', 'https://sc04.alicdn.com/kf/H3b26a64a9cf94efaba62d86ff934dea3u.jpg'),
(15, 'Velg Racing 14 Inch', 850000.00, 'Velg', 'TDR', 4, 'Velg racing ringan untuk motor matic', 'https://down-id.img.susercontent.com/file/73e2c11e771615ed3104bd7dacab2d4b'),
(16, 'Bohlam Lampu Depan 25 Watt', 5500.00, 'Lampu', 'Yamaha', 30, 'Lampu Ori Watt kecil', 'https://down-id.img.susercontent.com/file/id-11134207-7ra0q-mbem0oi5412wff');

-- --------------------------------------------------------

--
-- Table structure for table `sparepart_digunakan`
--

CREATE TABLE `sparepart_digunakan` (
  `id` int(11) NOT NULL,
  `id_riwayat` int(11) NOT NULL,
  `id_sparepart` int(11) NOT NULL,
  `jumlah` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sparepart_digunakan`
--

INSERT INTO `sparepart_digunakan` (`id`, `id_riwayat`, `id_sparepart`, `jumlah`) VALUES
(1, 1, 3, 1),
(2, 2, 8, 2),
(3, 1, 1, 1),
(4, 4, 1, 1),
(7, 4, 16, 2);

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `id` int(11) NOT NULL,
  `id_riwayat` int(11) NOT NULL,
  `nominal` decimal(12,2) NOT NULL,
  `metode` varchar(200) NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaksi`
--

INSERT INTO `transaksi` (`id`, `id_riwayat`, `nominal`, `metode`, `status`) VALUES
(1, 1, 210000.00, 'Debit Card', 'Lunas'),
(2, 2, 290000.00, 'QRIS', 'Lunas');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `jadwal_service`
--
ALTER TABLE `jadwal_service`
  ADD PRIMARY KEY (`id`),
  ADD KEY `JADWAL_KENDARAAN` (`id_kendaraan`);

--
-- Indexes for table `kendaraan`
--
ALTER TABLE `kendaraan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `KENDARAAN_PELANGGAN` (`id_pelanggan`);

--
-- Indexes for table `mekanik`
--
ALTER TABLE `mekanik`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pelanggan`
--
ALTER TABLE `pelanggan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `riwayat_service`
--
ALTER TABLE `riwayat_service`
  ADD PRIMARY KEY (`id`),
  ADD KEY `RIWAYAT_KENDARAAN` (`id_kendaraan`),
  ADD KEY `RIWAYAT_MEKANIK` (`id_mekanik`);

--
-- Indexes for table `sparepart`
--
ALTER TABLE `sparepart`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sparepart_digunakan`
--
ALTER TABLE `sparepart_digunakan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `LIST_RIWAYAT` (`id_riwayat`),
  ADD KEY `LIST_SPAREPART` (`id_sparepart`);

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `TRANSAKSI_RIWAYAT` (`id_riwayat`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `jadwal_service`
--
ALTER TABLE `jadwal_service`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `kendaraan`
--
ALTER TABLE `kendaraan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mekanik`
--
ALTER TABLE `mekanik`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pelanggan`
--
ALTER TABLE `pelanggan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `riwayat_service`
--
ALTER TABLE `riwayat_service`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `sparepart`
--
ALTER TABLE `sparepart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `sparepart_digunakan`
--
ALTER TABLE `sparepart_digunakan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `jadwal_service`
--
ALTER TABLE `jadwal_service`
  ADD CONSTRAINT `JADWAL_KENDARAAN` FOREIGN KEY (`id_kendaraan`) REFERENCES `kendaraan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `kendaraan`
--
ALTER TABLE `kendaraan`
  ADD CONSTRAINT `KENDARAAN_PELANGGAN` FOREIGN KEY (`id_pelanggan`) REFERENCES `pelanggan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `riwayat_service`
--
ALTER TABLE `riwayat_service`
  ADD CONSTRAINT `RIWAYAT_KENDARAAN` FOREIGN KEY (`id_kendaraan`) REFERENCES `kendaraan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `RIWAYAT_MEKANIK` FOREIGN KEY (`id_mekanik`) REFERENCES `mekanik` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sparepart_digunakan`
--
ALTER TABLE `sparepart_digunakan`
  ADD CONSTRAINT `LIST_RIWAYAT` FOREIGN KEY (`id_riwayat`) REFERENCES `riwayat_service` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `LIST_SPAREPART` FOREIGN KEY (`id_sparepart`) REFERENCES `sparepart` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `TRANSAKSI_RIWAYAT` FOREIGN KEY (`id_riwayat`) REFERENCES `riwayat_service` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
