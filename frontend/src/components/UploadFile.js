import React, { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytes } from "firebase/storage";

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
export function UploadFile({}) {
  const [files, setFiles] = useState([])
  const uploadHandler = () => {
    files.forEach(({file}) => {
        console.log(file);
        const storageRef = ref(storage, file.name);
        console.log(storageRef);
        uploadBytes(storageRef, file).then((snapshot) => {
            console.log('Uploaded!');
          });
    })
  }
  return (
    <div className="App">
      <FilePond
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={true}
        maxFiles={3}
        name="files" /* sets the file input name, it's filepond by default */
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
        <button
            onClick={uploadHandler}
        >Upload</button>
    </div>
  )
}