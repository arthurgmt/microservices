// src/components/FileUpload.js
import React, { useCallback, useEffect, useState } from 'react';
import {useDropzone} from 'react-dropzone';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './FileUpload.css';
import StatPanel from './StatPanel';

function FileUpload() {

  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState([]);

  const token = localStorage.getItem("token");

  const getAllDocs = async () => {
    const response = await fetch('http://localhost:8000/api/get-all-documents', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
      const docs = await response.json();
      setDocuments(docs);

      // Set unique tags
      const uniqueTags = [...new Set(docs.map(doc => doc.tag).filter(tag => tag !== undefined).filter(tag => tag !== ""))];
      console.log(uniqueTags);
      setTags(uniqueTags);

      console.log('Docs fetched');
    } else {
      console.error('Error while fetching docs');
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (token === null) {
      console.error('No authentication token');
      return;
    }

    acceptedFiles.forEach((file) => {
      const data = new FormData();
      data.append('files', file);

      fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data,
      }).then((response) => {
        // Handle the response from the server
        if (response.ok) {
          console.log('File uploaded successfully');
          getAllDocs();
        } else {
          console.error('Error uploading file');
        }
      });
    });
  }, []);

  
  const deleteDocument = async (id) => {
    const response = await fetch(`http://localhost:8000/api/delete-document/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      console.log('Document deleted successfully');
      getAllDocs();
    } else {
      console.error('Error deleting document');
    }
  };

  const updateDocumentTag = async (id, tag) => {
    const response = await fetch(`http://localhost:8000/api/update-tag/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ tag })
    });

    if (response.ok) {
      console.log('Tag updated successfully');
      getAllDocs();
    } else {
      console.error('Error updating tag');
    }
  };


  useEffect(() => {
    getAllDocs();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const { isAuthenticated, userRole } = useAuth();
  
  if (!isAuthenticated || (!userRole ==='admin')) {
    return <Navigate to="/" />;
  }

  return (
    <div className='container'>
      <div className='drop-part'>
        <div {...getRootProps()} className='dropzone' >
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p>Drop your file here...</p> :
              <p>Drag'n drop files here, or click to select</p>
          }
        </div>
        <div className='statpanel'>
          <StatPanel />
        </div>
      </div>
      <div className='all-documents'>
        <input
          className="search-input"
          type="text"
          placeholder="Search documents"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <div className='tags-container'>
          {tags.map(tag => (
            <div key={tag} className='tag' onClick={() => setSearchTerm(tag)}>
              {tag}
            </div>
          ))}
        </div>
        {documents.filter(doc => doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) || doc.tag === searchTerm).map(filteredDoc => (
        <div key={filteredDoc.id} className='document-item'>
          <div className='document-info'>
            <h2>{filteredDoc.filename}</h2>
            <div className='document-other-info'>
             <p>{filteredDoc.size} bytes</p>
             <p className='document-tag'>{filteredDoc.tag}</p>
            </div>
            <div className='document-buttons'>
              <button onClick={() => deleteDocument(filteredDoc.id)}>Delete</button>
              <a className='download' href={`http://localhost:8000/api/download/${filteredDoc.id}`} target="_blank" rel="noopener noreferrer">Download</a>
              <form onSubmit={e => {
                e.preventDefault();
                updateDocumentTag(filteredDoc.id, e.target.elements.tag.value);
              }}>
                <input name="tag" type="text" placeholder="Add a tag" />
                <button type="submit">Update Tag</button>
              </form>
            </div>
          </div>
          {filteredDoc.mimetype.startsWith('image/') && (
            <div className='document-preview'>
              <img src={`http://localhost:8000/api/download/${filteredDoc.id}`} alt={filteredDoc.filename} />
            </div>
          )}
        </div>
      ))}
      </div>
    </div>
  );
}

export default FileUpload;
