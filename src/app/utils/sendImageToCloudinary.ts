import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import config from "../config";

/**
 *  ------------------- send image to cloudinary -----------------------
 *
 * @param path file path to remove and upload to cloudinary
 * @param imageName image name
 * @returns return uploaded file object
 */
const sendImageToCloudinary = async (path: string, imageName: string) => {
  cloudinary.config({
    cloud_name: config.cloudinary_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_secret_key,
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(path, {
      public_id: imageName,
    })
    .catch((error) => {
      console.log(error);
    });

  // unlink the uploaded image to server
  fs.unlink(path, (err) => {
    if (err) {
      console.log(err);
    }
    console.log("file uploaded successfully");
  });

  return uploadResult;
};

export default sendImageToCloudinary;
