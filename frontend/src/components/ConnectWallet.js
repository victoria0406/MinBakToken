import React from "react";

import { NetworkErrorMessage } from "./NetworkErrorMessage";


export function ConnectWallet({ connectWallet, networkError, dismiss }) {
  return (
    <div className="container">
      {/* Wallet network should be set to Localhost:8545. */}
      {networkError && (
        <NetworkErrorMessage 
          message={networkError} 
          dismiss={dismiss} 
        />
      )}
      <div className="main-visual">
        <p>Please connect to your wallet!</p>
        <button
          type="button"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
}
