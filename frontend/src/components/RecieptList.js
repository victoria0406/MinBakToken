import React, { useEffect, useState } from 'react';

import { RecieptContainer } from "./RecieptContainer";
import { Offcanvas, Modal} from 'react-bootstrap';
import { MemoPreview } from './ReceiptPreview';

const statusIndex = {
    Reject: 0,
    Progress: 1,
    Done: 2
};
const statusSortFunc= (r1, r2) => {
    return statusIndex[r1.status] - statusIndex[r2.status]
}

export function RecieptList({reciepts, getMetaDataUrl}){
    const [show, setShow] = useState(false);
    const [reciept, setReciept] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [uris, setUris] = useState([]);
    console.log('reciept list');

    const updateUris = async (tokens)=> {
        if (tokens != null) {
            const uris = [];
            for (const token of tokens) {
                const uri = await getMetaDataUrl(token);
                uris.push(uri);
            }
            setUris(uris);
            console.log(uris);
        }
    }
    // 여기서 metadata에서 url 얻어오는 과정이 추가되야함.
    useEffect(() => {
        const tokens =  reciept?.tokens;
        console.log('tokens', tokens);
        updateUris(tokens);
    }, [reciept])
    return (
        <div className="reciept-list">
            {reciepts.sort(statusSortFunc).map((ele, i) => {
                return <RecieptContainer 
                    title={ele.title}
                    club={ele.club}
                    date={ele.date}
                    state={ele.state}
                    key={i} 
                    onClick = {() => setReciept(ele)}
                />;
            })}
            <Modal show={reciept?.title != null} onHide={() => setReciept(null)}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <MemoPreview
                        title={reciept?.title}
                        club={reciept?.club}
                        date={reciept?.date}
                        state={reciept?.state}
                        uris={uris}
                    />
                </Modal.Body>
                <Modal.Footer>
                <button variant="secondary" onClick={() => setReciept(null)}>
                    Close
                </button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}
