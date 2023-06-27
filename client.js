const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

async function uploadFile() {
  const fileStream = fs.createReadStream('./.componly/scan.json');

  const form = new FormData();
  form.append('file', fileStream);

  try {
    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: form,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const data = await response.json();
    console.log('File uploaded successfully:', data);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}

uploadFile();
