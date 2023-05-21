import React, { useContext } from 'react'
import { useState } from 'react';
import { AppContext } from './appContext';



const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileMultiple, setSelectedFileMultiple] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');
    const {fetchFile, setFetchFile} = useContext(AppContext);



    const handleFileChange = (event) => {
      console.log("files target", event.target.files[0]);
      setSelectedFile(event.target.files[0]);
    };
    const handleFileChange2 = (event) => {
      console.log("files target", event.target.files);
      setSelectedFileMultiple(event.target.files);
    };
  
    const handleFormSubmit = async (event) => {
      event.preventDefault();
      
      if (!selectedFile) {
        setUploadStatus('Please select a file.');
        return;
      }
  
      const formData = new FormData();
      formData.append('file', selectedFile);
  
      try {
        const response = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          try {
          setUploadStatus('File uploaded successfully.');
          const response = await fetch('http://localhost:5000/api/files');
        const data = await response.json();
        setFetchFile(data);
      } catch (error) {
        console.error(error);
      }

        } else {
          setUploadStatus('Error uploading file.');
        }
      } catch (error) {
        setUploadStatus('An error occurred while uploading the file.');
        console.error(error);
      }
    };
    const handleFormSubmit2 = async (event) => {
      event.preventDefault();
      
      if (selectedFileMultiple.length === 0) {
        setUploadStatus('Please select a file.');
        return;
      }
  
      const formData = new FormData();
      for (let i = 0; i < selectedFileMultiple.length; i++) {
        formData.append('files', selectedFileMultiple[i]);
      }
      console.log(formData, "this is form data");
      try {
        const response = await fetch('http://localhost:5000/api/uploadMultiple', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          try {
          setUploadStatus('File uploaded successfully.');
          const response = await fetch('http://localhost:5000/api/files');
        const data = await response.json();
        setFetchFile(data);
      } catch (error) {
        console.error(error);
      }

        } else {
          setUploadStatus('Error uploading file.');
        }
      } catch (error) {
        setUploadStatus('An error occurred while uploading the file.');
        console.error(error);
      }
    };
    
    return (
      <div>
        <form onSubmit={handleFormSubmit}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
        <form onSubmit={handleFormSubmit2}>
          <input type="file" onChange={handleFileChange2} multiple />
          <button type="submit">Upload</button>
        </form>
        <p>{uploadStatus}</p>
      </div>
    );
}

export default FileUpload