const validator = require("validator");

class Checker {
  static checkPassword(matkhau) {
    if (!matkhau || (matkhau.length >= 6 && matkhau.length <= 40)) return "";
    return "Validation Failed";
    // return "Password must between 6 and 40";
  }

  static checkEmail(email) {
    if (validator.isEmail(email)) return "";
    return "Validation Failed";
    return "Invalid email format";
  }

  static checkPhoneNumber(sdt) {
    if (!sdt || /^\d{10,12}$/.test(sdt)) return "";
    return "Validation Failed";
    // return "Invalid phone format";
  }

  static checkGender(gioitinh) {
    if (gioitinh === undefined || gioitinh === 0 || gioitinh === 1) return "";
    return "Validation Failed";
    // return "Field must be 0 and 1";
  }

  static checkDate(ngaysinh) {
    if (!ngaysinh || validator.isISO8601(ngaysinh)) return "";
    return "Validation Failed";
    // return "Date must be ISO form";
  }

  static checkDisplayStatus(hienthi) {
    if (hienthi === undefined || typeof hienthi === "boolean") return "";
    return "Validation Failed";
    // return "Field must be boolean";
  }

  static checkBoolean(bol) {
    if (bol === undefined || typeof bol === "boolean") return "";
    return "Validation Failed";
    // return "Field must be boolean";
  }

  static isEmptyObject(obj) {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  }
}

module.exports = Checker;
