import { ConnectWallet } from "./ConnectWallet";
import { UploadFile } from "./UploadFile";
import { MainVisual } from "./MainVisual";
import { RecieptList } from "./RecieptList";
import React from "react";

const MemoRecieptList = React.memo(RecieptList);

export {
    ConnectWallet,
    UploadFile,
    MainVisual,
    RecieptList,
    MemoRecieptList,
}