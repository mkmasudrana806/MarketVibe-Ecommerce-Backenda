import { CloudinaryStorage } from "multer-storage-cloudinary";

import multer from "multer";
import { cloudinaryConfig } from "../config/cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryConfig,
});

export const multerUploadVercel = multer({ storage });
