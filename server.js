const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/upload') {
    // Handle the file upload
    handleFileUpload(req, res);
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

function handleFileUpload(req, res) {
  // Generate a unique filename
  const fileName = generateUniqueFileName();

  // File path to save the uploaded file
  const uploadPath = path.join(__dirname, 'uploads', fileName);

  // Create a write stream to save the file
  const writeStream = fs.createWriteStream(uploadPath);

  // Pipe the request stream to the write stream
  req.pipe(writeStream);

  // When the file has been fully written
  writeStream.on('finish', () => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'File uploaded successfully' }));
  });

  // Handle any errors during the file upload
  writeStream.on('error', (error) => {
    console.error('Error uploading file:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Error uploading file' }));
  });
}

function generateUniqueFileName() {
  // Generate a timestamp-based unique filename
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${timestamp}_${random}.txt`;
}

// Create the "uploads" directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
