
import React from 'react'
import {
    ConnectWallet,
    MainVisual,
    MemoRecieptList,
} from '../components'

export default function Main({_connectWallet, _dismissNetworkError, selectedAddress, networkError, reciepts, getMetaDataUrl, isLoading}) {
    return (
        <div className="content">
          {
            !selectedAddress &&
            <ConnectWallet 
              connectWallet={() => _connectWallet()} 
              networkError={networkError}
              dismiss={() => _dismissNetworkError()}
            />
          }
          {
            selectedAddress && 
              <MainVisual />
          }
          {
            selectedAddress &&
              <div className="main-content">
                <h4>Your Receipts</h4>
                <MemoRecieptList reciepts={reciepts} getMetaDataUrl = {getMetaDataUrl} isLoading = {isLoading}/>
              </div>
          }
        </div>
    )
}