import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import {Dapp} from './Dapp';

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond'
import { MemoPreview } from '../components/ReceiptPreview';

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
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

function leftPad(value) {
    if (value >= 10) {
        return value;
    }

    return `0${value}`;
}

function toStringByFormatting(source, delimiter = '-') {
    const year = source.getFullYear();
    const month = leftPad(source.getMonth() + 1);
    const day = leftPad(source.getDate());

    return [year, month, day].join(delimiter);
}

export default function Upload({uploadHandler, updateReciepts}) {
    const navigate = useNavigate();
    const date = Date.now();
    console.log('hihi')

    const [files, setFiles] = useState([]);
    const [title, setTitle] = useState('');
    const [club, setClub] = useState('');
    const [urls, setUrls] = useState([]);

    useEffect(() => {
        setUrls(files.map(({file}) => URL.createObjectURL(file)));
    }, [files]);

    const clickHandler = async () => {
        const tokenIds = await uploadHandler(files);
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
        <div className="content upload">
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
            <MemoPreview
                title={title}
                club={club}
                date={toStringByFormatting(new Date(date))}
                state="Progress"
                uris={urls}
            />
        </div>
    )
}