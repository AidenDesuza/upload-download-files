const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Set storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);  // Create uploads directory if it doesn't exist
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);  // Save the file with the original name
  }
});

const upload = multer({ storage });

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.redirect('/');  // Redirect to home after successful upload
});

// Route to list all files in the uploads folder
app.get('/files', (req, res) => {
  const uploadPath = path.join(__dirname, '../uploads');
  fs.readdir(uploadPath, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan directory');
    }
    res.json(files);  // Return the list of files as a JSON response
  });
});

// Route to handle file download
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send('File not found.');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
