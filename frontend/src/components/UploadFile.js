import React, { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
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

// const dapp = new Dapp();

// Our app
export function UploadFile({}) {
  
  const [files, setFiles] = useState([]);

  const uploadHandler = async () => {
    const { Dapp } = await import('./Dapp');
    const dapp = new Dapp();
    const fileUploadPromises = files.map(async ({ file }) => {
      const fileName = uuidv4();
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, file);

      const downloadUrl = await getDownloadURL(storageRef);

      // 파일 업로드 완료 후 토큰 민팅
      const tokenId = fileName;
      const tokenMetadata = {
        name: file.name,
        // size: file.size,
        fileType: file.type,
        url: downloadUrl,
      };

      // Dapp.js에서 생성한 token 인스턴스 가져오기
      const tokenContract = await dapp._initializeEthers(); // Dapp.js에서 _initializeEthers 함수를 호출하여 token 인스턴스를 생성하는 코드
      console.log("Token Contract Instance:", tokenContract);
      // 토큰 민팅을 위한 mint 함수 호출
      const transaction = await tokenContract.mintNFT(tokenMetadata);
      await transaction.wait();

      console.log('File uploaded and token minted successfully!');
    });

    await Promise.all(fileUploadPromises);

    console.log('All files uploaded and tokens minted!');
  };


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