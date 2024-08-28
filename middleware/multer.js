const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const multer = require('multer');

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

// Set up OAuth2 client
const CLIENT_ID = '606800435993-0d83upildcvn4u42u7fcg9s9loejl9fj.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://restraunt-api.onrender.com';
const REFRESH_TOKEN = '1//04p0VCZqZIaGfCgYIARAAGAQSNwF-L9Ir1XcGy7Lj2KBSWa18kIiO-Js-waNKNX0DsGBB-Y7gEogjMaWk7Be_wTKgJiXA0pYFlbQ';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

// Function to create or get a folder in Google Drive
async function getOrCreateFolder(folderName) {
  try {
    // Check if the folder already exists
    const folderList = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    });

    if (folderList.data.files.length > 0) {
      // Folder exists
      return folderList.data.files[0].id;
    } else {
      // Folder does not exist, create it
      const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      };

      const folder = await drive.files.create({
        resource: folderMetadata,
        fields: 'id',
      });

      return folder.data.id;
    }
  } catch (error) {
    console.error('Error in creating or finding folder:', error);
    throw new Error('Failed to create or find folder');
  }
}

// Middleware to handle file uploads to Google Drive
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

      // Get or create the folder in Google Drive
      const folderId = await getOrCreateFolder('MyPhotosFolder'); // Replace with desired folder name

      // Upload the file to Google Drive inside the folder
      const fileResponse = await drive.files.create({
        requestBody: {
          name: req.file.originalname,
          mimeType: req.file.mimetype,
          parents: [folderId], // Set the parent folder
        },
        media: {
          mimeType: req.file.mimetype,
          body: fs.createReadStream(filePath),
        },
      });

      fs.unlinkSync(filePath); // Remove local file after upload

      const fileId = fileResponse.data.id;
      if (!fileId) {
        throw new Error('Failed to retrieve file ID from Google Drive response');
      }

      // Make the file publicly accessible
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      // Generate the public URL for the file
      const publicUrl = `https://drive.google.com/uc?id=${fileId}`;
      req.file.publicUrl = publicUrl;

      console.log('Public URL:', publicUrl);

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Error uploading file to Google Drive:', error);
      res.status(500).send('Failed to upload file');
    }
  });
};

module.exports = uploadMiddleware;
