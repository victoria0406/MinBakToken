import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import {Dapp} from './Dapp';

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import { Button } from 'bootstrap'

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

// Our app
export function UploadFile({uploadHandler, updateReciepts}) {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [club, setClub] = useState('');

  const clickHandler = async () => {
    const tokenIds = await uploadHandler(files);
    const date = Date.now();
    console.log(date);
    const reciept = {
      title, club, date, state: 'Progress', tokens:tokenIds
    };
    updateReciepts(reciept);
    navigate('/');
  }
    
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleClubChange = (e) => {
    setClub(e.target.value);
  };

  return (
    <div className="file-upload">
      <input type="text" value={title} onChange={handleTitleChange} placeholder="Enter a title" />
      <input type="text" value={club} onChange={handleClubChange} placeholder="Enter your club" />
      <FilePond
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={true}
        maxFiles={3}
        name="files" /* sets the file input name, it's filepond by default */
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
        <button
            onClick={clickHandler}
        >Mint Your Reciepts</button>
    </div>
  )
}