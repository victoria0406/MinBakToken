import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

export function ReceiptPreview({title, club, date, state, uris=[]}) {
    const docs = uris.map((uri) => {return {uri}});
    return (
        <div>
            <h3>{title}</h3>
            <p>Club: {club}</p>
            <p>Date: {date}</p>
            <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} sandbox="allow-scripts"/>
        </div>
    )
}
export const MemoPreview = React.memo(ReceiptPreview);