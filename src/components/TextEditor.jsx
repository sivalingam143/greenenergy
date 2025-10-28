// src/TextEditor.js
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Correct import
const TextEditor = () => {
  return (
    <div>
      <ReactQuill placeholder="Start typing..."/>
    </div>
  );
};

export default TextEditor;
