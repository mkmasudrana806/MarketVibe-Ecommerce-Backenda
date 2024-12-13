import httpStatus from "http-status";
import { User } from "../modules/user/user.model";
import AppError from "../utils/AppError";

const adminData = {
  name: "Masud Rana",
  email: "admin@gmail.com",
  password: "admin",
  role: "admin",
  age: 20,
  contact: "017234324324",
  address: "Sirajganj",
  gender: "male",
};

// ---------  seed admin data to database at database connection ----------
const seedAdmin = async () => {
  const user = await User.findOne({ role: "admin" });
  if (!user) {
    try {
      await User.create(adminData);
    } catch (error) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Faild to seed admin data"
      );
    }
  }
};

export default seedAdmin;
