ALTER DATABASE bookland CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Drop tables with foreign key dependencies first
DROP TABLE IF EXISTS ChiTietTheLoaiSach;
DROP TABLE IF EXISTS SachYeuThich;
DROP TABLE IF EXISTS LuotTim;
DROP TABLE IF EXISTS BinhLuan;
DROP TABLE IF EXISTS DanhGia;
DROP TABLE IF EXISTS ChiTietDonHang;
DROP TABLE IF EXISTS DonHang;
DROP TABLE IF EXISTS BaiViet;
DROP TABLE IF EXISTS Sach;
-- Drop tables without foreign key dependencies next
DROP TABLE IF EXISTS TheLoai;
DROP TABLE IF EXISTS TacGia;
DROP TABLE IF EXISTS Banner;
DROP TABLE IF EXISTS NguoiDung;
-- Create tables
CREATE TABLE NguoiDung (
    id_nguoidung VARCHAR(40) NOT NULL DEFAULT (UUID()),
    id_google VARCHAR(50) UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    matkhau VARCHAR(40) NOT NULL,
    ten VARCHAR(50) NOT NULL,
    sdt VARCHAR(20) unique,
    gioitinh ENUM('0', '1'),
    avt VARCHAR(255),
    ngaysinh DATE,
    resetToken varchar(100),
    resetTokenExpire bigint,
    ngaytao DATETIME DEFAULT CURRENT_TIMESTAMP,
    hienthi enum("0", "1") DEFAULT "1",
    loaitaikhoan ENUM('0', '1') DEFAULT "0" NOT NULL,
    PRIMARY KEY (id_nguoidung)
);
CREATE TABLE Banner (
    id_banner VARCHAR(40) NOT NULL DEFAULT (UUID()),
    link_to VARCHAR(255),
    img VARCHAR(255) not null,
    mobile_img VARCHAR(255),
    luotclick INTEGER DEFAULT 0,
    ngaybatdau DATETIME,
    ngayketthuc DATETIME,
    uutien INTEGER,
    hienthi enum("0", "1") DEFAULT "1",
    PRIMARY KEY (id_banner)
);
CREATE TABLE TheLoai (
    id_theloai VARCHAR(40) NOT NULL DEFAULT (UUID()),
    ten VARCHAR(100) NOT NULL,
    img VARCHAR(255),
    hienthi enum("0", "1") DEFAULT "1",
    PRIMARY KEY (id_theloai)
);
CREATE TABLE TacGia (
    id_tacgia VARCHAR(40) NOT NULL DEFAULT (UUID()),
    ten VARCHAR(100) NOT NULL,
    img VARCHAR(255),
    txt text,
    hienthi enum("0", "1") DEFAULT "1",
    PRIMARY KEY (id_tacgia)
);
CREATE TABLE Sach (
    id_sach VARCHAR(40) NOT NULL DEFAULT (UUID()),
    id_tacgia VARCHAR(40),
    nxb VARCHAR(100),
    ten VARCHAR(100) NOT NULL UNIQUE,
    img VARCHAR(255) not null,
    mota text not null,
    namxuatban DATE,
    ngaytao DATETIME DEFAULT CURRENT_TIMESTAMP,
    luotxem INTEGER DEFAULT 0,
    luottimkiem INTEGER DEFAULT 0,
    gia DOUBLE NOT NULL,
    giamgia DOUBLE,
    giacu DOUBLE,
    luotban INTEGER,
    ngonngu VARCHAR(50),
    hienthi enum("0", "1") DEFAULT "1",
    PRIMARY KEY (id_sach),
    FOREIGN KEY (id_tacgia) REFERENCES TacGia(id_tacgia) ON DELETE
    SET NULL ON UPDATE CASCADE
);
CREATE TABLE BaiViet (
    id_baiviet VARCHAR(40) NOT NULL DEFAULT (UUID()),
    id_author VARCHAR(40) not null,
    id_sach VARCHAR(40),
    img VARCHAR(255),
    ngaycapnhat DATETIME,
    ngaytao DATETIME DEFAULT CURRENT_TIMESTAMP,
    txt text not null,
    tieude VARCHAR(255),
    trangthai enum("0", "1") DEFAULT "1",
    PRIMARY KEY (id_baiviet),
    FOREIGN KEY (id_author) REFERENCES NguoiDung(id_nguoidung) ON DELETE NO ACTION ON UPDATE CASCADE,
    FOREIGN KEY (id_sach) REFERENCES Sach(id_sach) ON DELETE
    SET NULL ON UPDATE CASCADE
);
CREATE TABLE DonHang (
    id_donhang VARCHAR(40) NOT NULL,
    id_nguoidung VARCHAR(40) NOT NULL,
    mail VARCHAR(50) NOT NULL,
    diachi VARCHAR(255) NOT NULL,
    sdt VARCHAR(20) NOT NULL,
    nguoinhan VARCHAR(50),
    phuongthucthanhtoan ENUM('0', '1') NOT NULL DEFAULT "0",
    ghichu VARCHAR(255),
    ngaydathang DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngaygiaohang DATETIME,
    trangthai ENUM('0', '1', '2', '3', '4') not null default "0",
    thanhtoan ENUM('0', '1') not null default "0",
    PRIMARY KEY (id_donhang),
    FOREIGN KEY (id_nguoidung) REFERENCES NguoiDung(id_nguoidung) ON DELETE NO ACTION ON UPDATE CASCADE
);
CREATE TABLE ChiTietDonHang (
    id_chitietdonhang VARCHAR(40) NOT NULL DEFAULT (UUID()),
    id_donhang VARCHAR(40) NOT NULL,
    id_sach VARCHAR(40) NOT NULL,
    ten VARCHAR(50) NOT NULL,
    gia DOUBLE NOT NULL,
    soluong INTEGER NOT NULL,
    PRIMARY KEY (id_chitietdonhang),
    FOREIGN KEY (id_donhang) REFERENCES DonHang(id_donhang) ON DELETE NO ACTION ON UPDATE CASCADE,
    FOREIGN KEY (id_sach) REFERENCES Sach(id_sach) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE DanhGia (
    id_danhgia VARCHAR(40) NOT NULL DEFAULT (UUID()),
    id_nguoidung VARCHAR(40) NOT NULL,
    id_sach VARCHAR(40) NOT NULL,
    diem ENUM('1', '2', '3', '4', '5') NOT NULL,
    txt VARCHAR(255),
    ngaytao DATETIME DEFAULT CURRENT_TIMESTAMP,
    hienthi enum("0", "1") DEFAULT "1",
    PRIMARY KEY (id_danhgia),
    FOREIGN KEY (id_nguoidung) REFERENCES NguoiDung(id_nguoidung) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_sach) REFERENCES Sach(id_sach) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE BinhLuan (
    id_binhluan VARCHAR(40) NOT NULL DEFAULT (UUID()),
    id_nguoidung VARCHAR(40) NOT NULL,
    id_baiviet VARCHAR(40) not null,
    txt VARCHAR(255) NOT NULL,
    ngaytao DATETIME DEFAULT CURRENT_TIMESTAMP,
    hienthi enum("0", "1") DEFAULT "1",
    PRIMARY KEY (id_binhluan),
    FOREIGN KEY (id_nguoidung) REFERENCES NguoiDung(id_nguoidung) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_baiviet) REFERENCES BaiViet(id_baiviet) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE LuotTim (
    id_luottim VARCHAR(40) NOT NULL DEFAULT (UUID()),
    id_baiviet VARCHAR(40) NOT NULL,
    id_nguoidung VARCHAR(40) NOT NULL,
    ngaytao DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_luottim),
    FOREIGN KEY (id_baiviet) REFERENCES BaiViet(id_baiviet) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_nguoidung) REFERENCES NguoiDung(id_nguoidung) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE SachYeuThich (
    id_sachyeuthich VARCHAR(40) NOT NULL DEFAULT (UUID()),
    id_nguoidung VARCHAR(40) NOT NULL,
    id_sach VARCHAR(40) NOT NULL,
    ngaytao DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_sachyeuthich),
    FOREIGN KEY (id_nguoidung) REFERENCES NguoiDung(id_nguoidung) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_sach) REFERENCES Sach(id_sach) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE ChiTietTheLoaiSach (
    id_chitiettheloaisach VARCHAR(40) NOT NULL DEFAULT (UUID()),
    id_theloai VARCHAR(40) NOT NULL,
    id_sach VARCHAR(40) NOT NULL,
    PRIMARY KEY (id_chitiettheloaisach),
    FOREIGN KEY (id_theloai) REFERENCES TheLoai(id_theloai) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_sach) REFERENCES Sach(id_sach) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Insert data
INSERT INTO NguoiDung ( id_nguoidung, loaitaikhoan, id_google, matkhau, email, ten, gioitinh, avt, ngaysinh, sdt, hienthi)
VALUES ( 'user001', "0", 'googleid001', '$2a$10$flvDOgczDPfbPIku91fXGOeSRTOydzDRZ1uXSsdX1FujDNJXmXni6', 'anhpt2611@gmail.com', 'Nguyen Van A', "1", 'https://example.com/avatar1.jpg', '1990-01-01', '0123496789', TRUE),
    ( 'user002', "1", 'googleid002', '$2a$10$flvDOgczDPfbPIku91fXGOeSRTOydzDRZ1uXSsdX1FujDNJXmXni6', 'panh9151@gmail.com', 'Nguyen Van A', "1", 'https://example.com/avatar1.jpg', '1990-01-01', '0123456788', TRUE);

INSERT INTO `NguoiDung`(`id_nguoidung`, `loaitaikhoan`, `id_google`, `matkhau`, `email`, `ten`, `gioitinh`, `avt`, `ngaysinh`, `sdt`, `resetToken`, `resetTokenExpire`, `ngaytao`, `hienthi`) VALUES
('ND001', '0', NULL, '123456781', 'nguyenanhtuan@gmail.com', 'Nguyễn Anh Tuấn', '1', 'https://example.com/avatars/user1.jpg', '1990-01-01', '0123456789', 'iahd917kj1h382123k1j2yh3bfsa8d7f61bkadf', '2131513214141123', '2023-01-01 12:00:00', '1'),
('ND002', '0', 'ggid001', '122456789', 'phamtuanganh@gmail.com', 'Phạm Tuấn Anh', '1', 'https://example.com/avatars/user9.jpg', '1992-11-21', '0123456790', 'lakdfaf8a6d8', '91849028', '2023-01-10 12:00:00', '1'),
('ND003', '0', NULL, '123456782', 'phanquangdinh@gmail.com', 'Phan Quang Đính', '0', 'https://example.com/avatars/user2.jpg', '1985-02-15', '0987654321', 'token456', '1700000000', '2023-01-15 12:00:00', '0'),
('ND004', '0', NULL, '123456783', 'dophuongnam@gmail.com', 'Đỗ Phương Nam', '1', NULL, '1988-03-10', '0976543210', 'token789', '1700000000', '2023-02-01 12:00:00', '1'),
('ND005', '0', 'ggid002', '123456784', 'letienphat@gmail.com', 'Lê Tiến Phát', NULL, NULL, NULL, '0965432109', '9l123jhl12l3', '839817174174', '2023-03-01 12:00:00', '0'),
('ND006', '1', NULL, '123123121', 'dophuonganh@gmail.com', 'Đỗ Phương Anh', '1', 'https://example.com/avatars/user5.jpg', '1995-05-30', '0954321098', 'oiu4h53o4h5o3', '647372863925', '2023-04-01 12:00:00', '1'),
('ND007', '1', NULL, '123123122', 'daophuonghoa@gmail.com', 'Đào Phương Hoa', '0', 'https://example.com/avatars/user6.jpg', '1997-06-25', '0943210987', 'token678', '1700000000', '2023-05-01 12:00:00', '1'),
('ND008', '1', NULL, '123123123', 'lamkietque@gmail.com', 'Lâm Kiệt Quệ', '1', 'https://example.com/avatars/user7.jpg', '1999-07-15', '0932109876', 'token910', '1700000000', '2023-06-01 12:00:00', '0'),
('ND009', '1', NULL, '123123124', 'tranthingat@gmail.com', 'Trần Thị Ngát', '0', NULL, '2000-08-10', '0921098765', 'djfgd9f9gdfg8d', '213426513463547', '2023-07-01 12:00:00', '1');

INSERT INTO `TheLoai`(`id_theloai`, `ten`, `img`, `hienthi`) VALUES
('TL001', 'Tiểu Thuyết', 'https://example.com/genres/genre1.jpg', '1'),
('TL002', 'Khoa Học Viễn Tưởng', 'https://example.com/genres/genre2.jpg', '0'),
('TL003', 'Trinh Thám', 'https://example.com/genres/genre3.jpg', '1'),
('TL004', 'Kinh Dị', 'https://example.com/genres/genre4.jpg', '0'),
('TL005', 'Tình Cảm', 'https://example.com/genres/genre5.jpg', '1'),
('TL006', 'Lịch Sử', 'https://example.com/genres/genre6.jpg', '0'),
('TL007', 'Văn Học Nước Ngoài', 'https://example.com/genres/genre7.jpg', '1'),
('TL008', 'Tâm Lý Học', 'https://example.com/genres/genre8.jpg', '0'),
('TL009', 'Học Thuật', 'https://example.com/genres/genre9.jpg', '1'),
('TL010', 'Phát Triển Bản Thân', 'https://example.com/genres/genre10.jpg', '1');

INSERT INTO `TacGia`(`id_tacgia`, `ten`, `img`, `txt`, `hienthi`) VALUES
('TG001', 'Nguyễn Nhật Ánh', 'https://example.com/authors/author1.jpg', 'Tác giả nổi tiếng với những câu chuyện dành cho thiếu nhi.', '0'),
('TG002', 'Nguyễn Ngọc Thạch', 'https://example.com/authors/author2.jpg', 'Nhà văn trẻ với những tác phẩm hiện đại và sắc sảo.', '1'),
('TG003', 'Nguyễn Mạnh Tuấn', NULL, 'Tác giả chuyên viết về những câu chuyện xã hội.', '0'),
('TG004', 'Lê Văn Khải', 'https://example.com/authors/author4.jpg', NULL, '1'),
('TG005', 'Trần Thị Bích', NULL, NULL, '1'),
('TG006', 'Phạm Công Luận', 'https://example.com/authors/author6.jpg', 'Tác giả với những câu chuyện về cuộc sống đời thường.', '1'),
('TG007', 'Bùi Anh Tuấn', 'https://example.com/authors/author7.jpg', 'Nhà văn trẻ với phong cách viết hiện đại.', '1'),
('TG008', 'Lê Thanh Huyền', NULL, NULL, '0'),
('TG009', 'Võ Ngọc Hân', 'https://example.com/authors/author9.jpg', NULL, '1'),
('TG010', 'Trương Minh Quang', NULL, NULL, '1');

INSERT INTO `Sach`(`id_sach`, `id_tacgia`, `ten`, `nxb`, `img`, mota,`namxuatban`, `ngaytao`, `luotxem`, `gia`, `giamgia`, `giacu`, `luotban`, `ngonngu`, `hienthi`) VALUES
('S001', 'TG001', 'Tiểu Thuyết Mới', 'NXB Kim Đồng', 'https://example.com/books/book1.jpg', 'Một câu chuyện hấp dẫn về tình yêu.', '2023-01-01', '2023-01-01 12:00:00', 100, 200000, NULL, 200000, 50, 'Tiếng Việt', '1'),
('S002', 'TG002', 'Hành Trình Kỳ Diệu', 'NXB Phụ Nữ', 'https://example.com/books/book2.jpg', 'Khám phá những điều kỳ diệu trong cuộc sống.', '2023-02-01', '2023-01-15 12:00:00', 150, 250000, NULL, 300000, 30, 'Tiếng Việt', '1'),
('S003', 'TG003', 'Trinh Thám Thú Vị', NULL, 'https://example.com/books/book3.jpg', 'Một vụ án khó giải quyết.', '2023-03-01', '2023-02-01 12:00:00', 200, 300000, 30, 300000, 20, NULL, '0'),
('S004', 'TG001', 'Khoa Học Viễn Tưởng', NULL, 'https://example.com/books/book4.jpg', 'Câu chuyện về tương lai.', '2023-04-01', '2023-03-01 12:00:00', 250, 150000, 20, 150000, 40, 'Tiếng Việt', '1'),
('S005', 'TG004', 'Chuyện Tình Cảm', 'NXB Thế Giới', 'https://example.com/books/book5.jpg', 'Một mối tình đẹp.', '2023-05-01', '2023-04-01 12:00:00', 300, 180000, NULL, 180000, 60, 'Tiếng Việt', '1'),
('S006', 'TG005', 'Lịch Sử Thế Giới', 'NXB Giáo Dục', 'https://example.com/books/book6.jpg', 'Một cuốn sách về lịch sử.', '2023-06-01', '2023-05-01 12:00:00', 350, 220000, NULL, NULL, 70, 'Tiếng Việt', '0'),
('S007', 'TG002', 'Tâm Lý Học', 'NXB Tâm Hồn', 'https://example.com/books/book7.jpg', 'Khám phá tâm lý con người.', '2023-07-01', '2023-06-01 12:00:00', 400, 260000, NULL, NULL, 80, 'Tiếng Việt', '1'),
('S008', 'TG003', 'Truyện Ngắn', 'NXB Hội Nhà Văn', 'https://example.com/books/book8.jpg', 'Một tập truyện ngắn hay.', '2023-08-01', '2023-07-01 12:00:00', 450, 230000, 0, 230000, 90, 'Tiếng Việt', '0'),
('S009', 'TG004', 'Phát Triển Bản Thân', 'NXB Sống', 'https://example.com/books/book9.jpg', 'Cuốn sách giúp bạn phát triển bản thân.', '2023-09-01', '2023-08-01 12:00:00', 500, 300000, NULL, NULL, 100, 'Tiếng Việt', '1'),
('S010', 'TG005', 'Thế Giới Tự Nhiên', 'NXB Khoa Học', 'https://example.com/books/book10.jpg', 'Khám phá thế giới tự nhiên.', '2023-10-01', '2023-09-01 12:00:00', 550, 280000, NULL, NULL, 110, 'Tiếng Việt', '1');

INSERT INTO `ChiTietTheLoaiSach`(`id_chitiettheloaisach`, `id_theloai`, `id_sach`) VALUES
('CTS001', 'TL001', 'S001'),
('CTS002', 'TL001', 'S002'),
('CTS003', 'TL001', 'S003'),
('CTS004', 'TL001', 'S004'),
('CTS005', 'TL002', 'S002'),
('CTS006', 'TL002', 'S005'),
('CTS007', 'TL002', 'S006'),
('CTS008', 'TL003', 'S003'),
('CTS009', 'TL003', 'S007'),
('CTS010', 'TL003', 'S008'),
('CTS011', 'TL004', 'S009'),
('CTS012', 'TL004', 'S001'),
('CTS013', 'TL005', 'S006'),
('CTS014', 'TL005', 'S007'),
('CTS015', 'TL006', 'S005'),
('CTS016', 'TL006', 'S008'),
('CTS017', 'TL007', 'S001'),
('CTS018', 'TL007', 'S009'),
('CTS019', 'TL008', 'S004'),
('CTS020', 'TL009', 'S002'),
('CTS021', 'TL010', 'S006');

INSERT INTO `Banner`(`id_banner`, `link_to`, `img`, `mobile_img`, `luotclick`, `ngaybatdau`, `ngayketthuc`, `uutien`, `hienthi`) VALUES
('BN001', 'https://example.com/banner1', 'https://example.com/images/banner1.jpg', 'https://example.com/images/banner1_mobile.jpg', 100, NULL, NULL, 1, 1),
('BN002', 'https://example.com/banner2', 'https://example.com/images/banner2.jpg', 'https://example.com/images/banner2_mobile.jpg', 200, '2023-02-01', '2023-12-31', 2, 1),
('BN003', 'https://example.com/banner3', 'https://example.com/images/banner3.jpg', 'https://example.com/images/banner3_mobile.jpg', 150, NULL, NULL, 3, 0),
('BN004', 'https://example.com/banner4', 'https://example.com/images/banner4.jpg', 'https://example.com/images/banner4_mobile.jpg', 300, '2023-03-01', '2024-03-01', 4, 1),
('BN005', 'https://example.com/banner5', 'https://example.com/images/banner5.jpg', 'https://example.com/images/banner5_mobile.jpg', 50, NULL, NULL, 5, 0),
('BN006', 'https://example.com/banner6', 'https://example.com/images/banner6.jpg', 'https://example.com/images/banner6_mobile.jpg', 75, '2023-05-01', '2023-05-31', 6, 1),
('BN007', 'https://example.com/banner7', 'https://example.com/images/banner7.jpg', 'https://example.com/images/banner7_mobile.jpg', 90, NULL, NULL, 7, 0);

INSERT INTO `SachYeuThich`(`id_sachyeuthich`, `id_nguoidung`, `id_sach`, `ngaytao`) VALUES
('SYT001', 'ND001', 'S001', '2023-06-01 12:00:00'),
('SYT002', 'ND001', 'S002', '2023-06-02 12:00:00'),
('SYT003', 'ND002', 'S003', '2023-06-03 12:00:00'),
('SYT004', 'ND002', 'S004', '2023-06-04 12:00:00'),
('SYT005', 'ND003', 'S001', '2023-06-05 12:00:00'),
('SYT006', 'ND003', 'S002', '2023-06-06 12:00:00'),
('SYT007', 'ND004', 'S005', '2023-06-07 12:00:00'),
('SYT008', 'ND005', 'S006', '2023-06-08 12:00:00'),
('SYT009', 'ND005', 'S007', '2023-06-09 12:00:00'),
('SYT010', 'ND006', 'S008', '2023-06-10 12:00:00');

INSERT INTO `DonHang`(`id_donhang`, `id_nguoidung`, `mail`, `diachi`, `sdt`, `nguoinhan`, `phuongthucthanhtoan`, `ghichu`, `ngaydathang`, `ngaygiaohang`, `trangthai`, `thanhtoan`) VALUES
('DH001', 'ND001', 'dophuonganh@gmail.com', '123 Đường A, Quận 1', '0954321098', NULL, 0, NULL, '2024-07-01 10:00:00', NULL, 0, 0),
('DH002', 'ND001', 'daophuonghoa@gmail.com', '456 Đường B, Quận 2', '0943210987', NULL, 1, 'Ghi chú đơn hàng 2', '2024-07-02 11:00:00', '2024-07-03 15:00:00', 1, 1),
('DH003', 'ND002', 'lamkietque@gmail.com', '789 Đường C, Quận Cam', '0932109876', 'Lâm Kiệt Quệ', 0, NULL, '2024-07-03 09:30:00', NULL, 2, 0),
('DH004', 'ND003', 'tranthingat@gmail.com', '321 Đường D, Quận 4', '0921098765', 'Trần Thị Ngát', 1, 'Ghi chú đơn hàng 4', '2024-07-04 14:00:00', '2024-07-05 16:00:00', 3, 1),
('DH005', 'ND005', 'phamtuanganh@gmail.com', '654 Đường E, Quận 5', '0123456790', 'Phạm Tuấn Anh', 0, 'Ghi chú đơn hàng 5', '2024-07-05 08:00:00', NULL, 4, 0);

INSERT INTO `ChiTietDonHang`(`id_chitietdonhang`, `id_donhang`, `id_sach`, `ten`, `gia`, `soluong`) VALUES
('CTDH001', 'DH001', 'S001', 'Tiểu Thuyết Mới', 200000, 2),
('CTDH002', 'DH001', 'S003', 'Trinh Thám Thú Vị', 300000, 1),
('CTDH003', 'DH002', 'S002', 'Hành Trình Kỳ Diệu', 250000, 1),
('CTDH004', 'DH002', 'S005', 'Chuyện Tình Cảm', 180000, 3),
('CTDH005', 'DH003', 'S004', 'Khoa Học Viễn Tưởng', 150000, 1),
('CTDH006', 'DH003', 'S007', 'Tâm Lý Học', 260000, 2);

INSERT INTO `BaiViet` (`id_baiviet`, `id_author`, `id_sach`, `img`, `ngaycapnhat`, `ngaytao`, `txt`, `tieude`, `trangthai`) 
VALUES 
('BV001', 'ND006', 'S001', 'https://example.com/articles/article1.jpg', '2023-01-15 12:00:00', '2023-01-10 12:00:00', 'Bài viết về tiểu thuyết mới.', 'Khám Phá Tiểu Thuyết Mới', '1'),
('BV002', 'ND007', 'S002', 'https://example.com/articles/article2.jpg', '2023-02-15 12:00:00', '2023-02-10 12:00:00', 'Những điều kỳ diệu trong cuộc sống.', 'Hành Trình Kỳ Diệu', '0'),
('BV003', 'ND008', 'S003', 'https://example.com/articles/article3.jpg', '2023-03-15 12:00:00', '2023-03-10 12:00:00', 'Một vụ án khó giải quyết.', 'Trinh Thám Thú Vị', '1'),
('BV004', 'ND009', 'S004', 'https://example.com/articles/article4.jpg', '2023-04-15 12:00:00', '2023-04-10 12:00:00', 'Câu chuyện về tương lai.', 'Khoa Học Viễn Tưởng', '0'),
('BV005', 'ND006', 'S005', 'https://example.com/articles/article5.jpg', '2023-05-15 12:00:00', '2023-05-10 12:00:00', 'Một mối tình đẹp.', 'Chuyện Tình Cảm', '1');

INSERT INTO `BinhLuan`(`id_binhluan`, `id_nguoidung`, `id_baiviet`, `txt`, `ngaytao`, `hienthi`) VALUES
('BL001', 'ND006', 'BV001', 'Bài viết rất hay!', '2023-08-01 10:00:00', '1'),
('BL002', 'ND007', 'BV001', 'Cảm ơn tác giả đã chia sẻ!', '2023-08-02 11:30:00', '0'),
('BL003', 'ND008', 'BV002', 'Một góc nhìn thú vị!', '2023-08-03 14:45:00', '1'),
('BL004', 'ND009', 'BV003', 'Hy vọng sẽ có thêm nhiều bài viết như vậy!', '2023-08-04 09:15:00', '1'),
('BL005', 'ND006', 'BV004', 'Rất ấn tượng với nội dung!', '2023-08-05 16:20:00', '0');

INSERT INTO `DanhGia`(`id_danhgia`, `id_nguoidung`, `id_sach`, `diem`, `txt`, `ngaytao`, `hienthi`) VALUES
('DG001', 'ND001', 'S001', 5, 'Cuốn sách tuyệt vời!', '2024-07-01 10:00:00', 1),
('DG002', 'ND002', 'S002', 4, 'Sách này khá hay.', '2024-07-02 11:00:00', 1),
('DG003', 'ND003', 'S003', 3, 'Nội dung trung bình.', '2024-07-03 09:30:00', 0),
('DG004', 'ND004', 'S004', 5, 'Rất thích cuốn sách này!', '2024-07-04 14:00:00', 1);

INSERT INTO `LuotTim`(`id_luottim`, `id_baiviet`, `id_nguoidung`) VALUES
('LT001', 'BV001', 'ND001'),
('LT002', 'BV002', 'ND002'),
('LT003', 'BV001', 'ND003'),
('LT004', 'BV002', 'ND004'),
('LT005', 'BV001', 'ND005');
