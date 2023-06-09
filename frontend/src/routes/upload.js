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
import { toStringByFormatting } from "../utils/dateParser";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);


export default function Upload({uploadHandler, updateReciepts, myAddr}) {
    const navigate = useNavigate();
    const date = Date.now();
    console.log('hihi')

    const [files, setFiles] = useState([]);
    const [title, setTitle] = useState();
    const [club, setClub] = useState();
    const [addr, setAddr] = useState();
    const [urls, setUrls] = useState([]);
    const [isMinting, setIsMinting] = useState(false);

    useEffect(() => {
        setUrls(files.map(({file}) => URL.createObjectURL(file)));
    }, [files]);

    const clickHandler = async () => {
        setIsMinting(true);
        try {
            let inputAddr = addr;
            if (!inputAddr) inputAddr = myAddr;
            const tokenIds = await uploadHandler(files, inputAddr);
            const reciept = {
              title, club, date, state: 'Progress', tokens:tokenIds
            };
            updateReciepts(reciept);
        } catch (e) {
            console.error(e.message);
        }
        setIsMinting(false);
        navigate('/');
        window.location.reload()
      }
        
      const handleTitleChange = (e) => {
        setTitle(e.target.value);
      };
    
      const handleClubChange = (e) => {
        setClub(e.target.value);
      };
      const handleAddrChange = (e) => {
        setAddr(e.target.value);
      };
    
    return (
        <div className="content upload">
            <div className="file-upload">
                <div className='text-inputs'>
                    <h3><label>Title: </label><input type="text" value={title} onChange={handleTitleChange} placeholder="Enter a title" /></h3>
                    <p><label>Club: </label><input type="text" value={club} onChange={handleClubChange} placeholder="Enter your club" /></p>
                    <p><label>Address: </label><input type="text" value={addr} onChange={handleAddrChange} placeholder="Enter the address" /></p>
                </div>
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
                >
                    Mint Your Reciepts
                </button>
            </div>
            <MemoPreview
                title={title}
                club={club}
                date={toStringByFormatting(new Date(date))}
                state="Progress"
                uris={urls}
            />
            {
                isMinting && <div className='screen-overlay'>Waiting For Finishing Minting</div>
            }
        </div>
    )
}