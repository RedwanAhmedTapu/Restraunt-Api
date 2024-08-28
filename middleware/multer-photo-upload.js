const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dcyrlxyuk',
  api_key: '668925119493549',
  api_secret: 'pp78JnYCAYbniPg0bpKQBYUlVOw',
});

// Set up multer for file upload with correct storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/')); // Set the destination for file uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Set the file name
  }
});

const upload = multer({ storage });

// Middleware to handle file uploads to Cloudinary
const uploadMiddleware = (req, res, next) => {
  const uploadSingle = upload.single('file');

  uploadSingle(req, res, async (err) => {
    if (err) {
      return res.status(400).send('File upload failed');
    }

    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    try {
      const filePath = req.file.path;

      // Upload the file to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
        folder: 'MyPhotosFolder', // Replace with desired folder name
      });

      fs.unlinkSync(filePath); // Remove local file after upload

      // Get the public URL from Cloudinary response
      const publicUrl = cloudinaryResponse.secure_url;
      req.file.publicUrl = publicUrl;

      console.log('Public URL:', publicUrl);

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
      res.status(500).send('Failed to upload file');
    }
  });
};

module.exports = uploadMiddleware;
