import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image/'))
      cb(null, './uploads/images');
    else if(file.mimetype.startsWith('video/'))
      cb(null, './uploads/videos');
    else
      cb(null, './uploads/files');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
})

const filter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: filter
});

export default upload;