class BookTypeFields {
  static user() {
    return ["id_theloai", "ten", "img"];
  }

  static admin() {
    return ["id_theloai", "ten", "img", "hienthi"];
  }
}

class UserFields {
  static user() {
    return [
      // "id_nguoidung",
      "id_google",
      "email",
      "ten",
      "gioitinh",
      "avt",
      "ngaysinh",
      "sdt",
      "ngaytao",
    ];
  }

  static admin() {
    return [
      "id_nguoidung",
      "loaitaikhoan",
      "id_google",
      "email",
      "ten",
      "gioitinh",
      "avt",
      "ngaysinh",
      "sdt",
      "ngaytao",
      "hienthi",
    ];
  }
}

class AuthorFields {
  static user() {
    return ["id_tacgia", "ten", "img", "txt"];
  }

  static admin() {
    return ["id_tacgia", "ten", "img", "txt", "hienthi"];
  }
}

class BookFields {
  static user() {
    return [
      "id_sach",
      "id_tacgia",
      "ten",
      "nxb",
      "img",
      "mota",
      "namxuatban",
      "ngaytao",
      "luotxem",
      "luottimkiem",
      "gia",
      "giamgia",
      "giacu",
      "luotban",
      "ngonngu",
    ];
  }

  static admin() {
    return [
      "id_sach",
      "id_tacgia",
      "ten",
      "nxb",
      "img",
      "mota",
      "namxuatban",
      "ngaytao",
      "luotxem",
      "luottimkiem",
      "gia",
      "giamgia",
      "giacu",
      "luotban",
      "ngonngu",
      "hienthi",
    ];
  }
}

class OrderFields {
  static user() {
    return [
      "id_donhang",
      "id_nguoidung",
      "mail",
      "diachi",
      "sdt",
      "nguoinhan",
      "phuongthucthanhtoan",
      "ghichu",
      "ngaydathang",
      "ngaygiaohang",
      "trangthai",
      "thanhtoan",
    ];
  }

  static admin() {
    return [
      "id_donhang",
      "id_nguoidung",
      "mail",
      "diachi",
      "sdt",
      "nguoinhan",
      "phuongthucthanhtoan",
      "ghichu",
      "ngaydathang",
      "ngaygiaohang",
      "trangthai",
      "thanhtoan",
    ];
  }
}

class CommentFields {
  static user() {
    return ["id_binhluan", "id_nguoidung", "id_baiviet", "txt", "ngaytao"];
  }

  static admin() {
    return [
      "id_binhluan",
      "id_nguoidung",
      "id_baiviet",
      "txt",
      "ngaytao",
      "hienthi",
    ];
  }
}

class PostFields {
  static user() {
    return [
      "id_baiviet",
      "id_author",
      "id_sach",
      "img",
      "ngaycapnhat",
      "ngaytao",
      "txt",
      "tieude",
    ];
  }

  static admin() {
    return [
      "id_baiviet",
      "id_author",
      "id_sach",
      "img",
      "ngaycapnhat",
      "ngaytao",
      "txt",
      "tieude",
      "trangthai",
    ];
  }
}

class RatingFields {
  static user() {
    return ["id_danhgia", "id_nguoidung", "id_sach", "diem", "txt", "ngaytao"];
  }

  static admin() {
    return [
      "id_danhgia",
      "id_nguoidung",
      "id_sach",
      "diem",
      "txt",
      "ngaytao",
      "hienthi",
    ];
  }
}

class BannerFields {
  static user() {
    return ["id_banner", "link_to", "img", "mobile_img", "luotclick", "uutien"];
  }

  static admin() {
    return [
      "id_banner",
      "link_to",
      "img",
      "mobile_img",
      "luotclick",
      "ngaybatdau",
      "ngayketthuc",
      "uutien",
      "hienthi",
    ];
  }
}

class Fields {
  static user(role) {
    if (role === "0") {
      return UserFields.user();
    } else if (role === "1") {
      return UserFields.admin();
    }
    return [];
  }

  static author(role) {
    if (role === "0") {
      return AuthorFields.user();
    } else if (role === "1") {
      return AuthorFields.admin();
    }
  }

  static book(role) {
    if (role === "0") {
      return BookFields.user();
    } else if (role === "1") {
      return BookFields.admin();
    }
  }

  static order(role) {
    if (role === "0") {
      return OrderFields.user();
    } else if (role === "1") {
      return OrderFields.admin();
    }
  }

  static comment(role) {
    if (role === "0") {
      return CommentFields.user();
    } else if (role === "1") {
      return CommentFields.admin();
    }
  }

  static post(role) {
    if (role === "0") {
      return PostFields.user();
    } else if (role === "1") {
      return PostFields.admin();
    }
  }

  static rating(role) {
    if (role === "0") {
      return RatingFields.user();
    } else if (role === "1") {
      return RatingFields.admin();
    }
  }

  static banner(role) {
    if (role === "0") {
      return BannerFields.user();
    } else if (role === "1") {
      return BannerFields.admin();
    }
  }

  static type(role) {
    if (role === "0") {
      return BookTypeFields.user();
    } else if (role === "1") {
      return BookTypeFields.admin();
    }
  }
}

module.exports = Fields;
