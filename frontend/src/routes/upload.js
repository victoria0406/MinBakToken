import { UploadFile } from "../components";

export default function Upload({uploadHandler, updateReciepts}) {
    return (
        <div className="content upload">
            <UploadFile uploadHandler = {uploadHandler} updateReciepts={updateReciepts}/>
            <div> preview </div>
        </div>
    )
}