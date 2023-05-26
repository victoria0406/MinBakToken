
import {
    ConnectWallet,
    MainVisual,
    RecieptList,
} from '../components'

export default function Main({_connectWallet, _dismissNetworkError, selectedAddress, networkError, reciepts}) {
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
                <h4>Your Reciepts</h4>
                <RecieptList reciepts={reciepts}/>
              </div>
          }
        </div>
    )
}