import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from './appContext';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const {fetchFile, setFetchFile} = useContext(AppContext);
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/files');
        const data = await response.json();
        setFiles(data);
        setFetchFile(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFiles();
  }, []);

  const handleDownload = (fileId) => {
    window.open(`http://localhost:5000/api/files/${fileId}/download`, '_blank');
  };

  const handleDelete = async (fileId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/files/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
      } else {
        console.log('Error deleting file.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>File List</h2>
      <ul>
        {fetchFile.map((file,index) => (
          <li key={file._id}>
            <span>{index}  </span>
            <span>{file.filename}</span>
            <button onClick={() => handleDownload(file._id)}>Download</button>
            <button onClick={() => handleDelete(file._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
