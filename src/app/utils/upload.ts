import multer from "multer";

// storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// filter out allowed file types
// const fileFilter = function fileFilter(req, file, cb) {
//   const acceptableFiles = /.png|.jpg|.jpeg/;
//   // The function should call `cb` with a boolean
//   // to indicate if the file should be accepted

//   // To reject this file pass `false`, like so:
//   cb(null, false);

//   // To accept the file pass `true`, like so:
//   cb(null, true);

//   // You can always pass an error if something goes wrong:
//   cb(new Error("I don't have a clue!"));
// };

// multer take options object as parameter, which contains storage, fileFilter, limits
export const upload = multer({ storage: storage });
