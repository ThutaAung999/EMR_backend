import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface UploadedFile {
  file: string;
}

const ImageUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setMessage('No file selected');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('http://localhost:5000/api/emrs/create/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { file, msg } = res.data;

      setUploadedFile({ file });
      setMessage(msg);
    } catch (err: any) {
      if (err.response && err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else if (err.response && err.response.data && err.response.data.msg) {
        setMessage(err.response.data.msg);
      } else {
        setMessage('An unknown error occurred');
      }
    }
  };

  return (
    <div>
      <h2>Image Upload</h2>
      {message && <p>{message}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <input type="file" onChange={onFileChange} />
        </div>
        <button type="submit">Upload</button>
      </form>
      {uploadedFile && (
        <div>
          <h3>{uploadedFile.file}</h3>
          <img src={`http://localhost:5000/${uploadedFile.file}`} alt="" style={{ width: '300px' }} />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
