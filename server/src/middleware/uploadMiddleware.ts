import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  callback
) => {
  if (file.mimetype.startsWith("image/")) {
    callback(null, true);
  } else {
    callback(
      new Error("Only image files are allowed")
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});