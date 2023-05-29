import React from "react";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import TokenArtifact from "../contracts/Token.json";
import contractAddress from "../contracts/contract-address.json";

// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.

// bootstrap
import { Button } from "react-bootstrap";

// icons
import { Bell, Person } from 'react-bootstrap-icons';

// upload
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from "firebase/firestore";

// router
import { Routes, Route } from "react-router-dom";
import {
  ConnectWallet,
  Main,
  Upload,
} from '../routes'


// This is the default id used by the Hardhat Network
const HARDHAT_NETWORK_ID = '31337';

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

// This component is in charge of doing these things:
//   1. It connects to the user's wallet
//   2. Initializes ethers and the Token contract
//   3. Polls the user balance to keep it updated.
//   4. Transfers tokens by sending transactions
//   5. Renders the whole application
//
// Note that (3) and (4) are specific of this sample application, but they show
// you how to keep your Dapp and contract's state in sync,  and how to send a
// transaction.

export class Dapp extends React.Component {
  constructor(props) {
    super(props);

    // We store multiple things in Dapp's state.
    // You don't need to follow this pattern, but it's an useful example.
    this.initialState = {
      // The info of the token (i.e. It's Name and symbol)
      tokenData: undefined,
      // The user's address and balance
      selectedAddress: undefined,
      balance: undefined,
      // The ID about transactions being sent, and any possible error with them
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
    };
    this.state = this.initialState;
    this.state.reciepts = [];
  }

  render() {
   console.log('dapp');
    return (
      <div className="main">
        <nav className="navbar bg-body-tertiary">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              Club NFT
            </a>
            <div>
              <div className="icon-button">
                <Bell/>
              </div>
              <div className="icon-button">
                <Person />
              </div>
            </div>
          </div>
        </nav>
        {
          <Routes>
            <Route
              index
              element={
                <Main 
                  _connectWallet={() => this._connectWallet()} 
                  networkError={this.state.networkError}
                  _dismissNetworkError={() => this._dismissNetworkError()}
                  selectedAddress = {this.state.selectedAddress}
                  reciepts = {this.state.reciepts}
                  getMetaDataUrl = {this.getMetaDataUrl}
                  />}
            />
            <Route 
              path="/upload"
              element={<Upload uploadHandler = {this.uploadHandler} updateReciepts={this.updateReciepts}/>}
            />
          </Routes>
        }
      </div>
    );
  }

  componentWillUnmount() {
    // We poll the user's balance, so we have to stop doing that when Dapp
    // gets unmounted
    this._stopPollingData();
  }

  async _connectWallet() {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Once we have the address, we can initialize the application.

    // First we check the network
    this._checkNetwork();

    this._initialize(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      this._stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state 
      if (newAddress === undefined) {
        return this._resetState();
      }
      
      this._initialize(newAddress);
    });
  }

  _initialize(userAddress) {
    // This method initializes the dapp

    // We first store the user's address in the component's state
    this.setState({
      selectedAddress: userAddress,
    });

    // Then, we initialize ethers, fetch the token's data, and start polling
    // for the user's balance.

    // Fetching the token data and the user's balance are specific to this
    // sample project, but you can reuse the same initialization pattern.
    this._initializeEthers();
    this._startPollingData();
    this._initializeReciepts();
  }

  async _initializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    // Then, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    const tokenContract = new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      this._provider.getSigner(0)
    );
    this._token = tokenContract;

    console.log("Token Contract Instance:", this._token);
    return tokenContract;
  }

  async _initializeReciepts() {
    const getReciepts = await getDocs(collection(db, "tokens"));
    const reciepts = [];
    for (const doc of getReciepts.docs) {
      const reciept = doc.data();
      const isMine = await this.isTokenOwner(reciept?.tokens[0]);
      if (isMine) {
        reciepts.push(reciept);
        console.log('is mine');
      }
    }
    this.state.reciepts = reciepts;
    console.log(this.state.reciepts);
  }

  

  // The next two methods are needed to start and stop polling data. While
  // the data being polled here is specific to this example, you can use this
  // pattern to read any data from your contracts.
  //
  // Note that if you don't need it to update in near real time, you probably
  // don't need to poll it. If that's the case, you can just fetch it when you
  // initialize the app, as we do with the token data.
  _startPollingData() {
    this._pollDataInterval = setInterval(() => this._updateBalance(), 1000);

    // We run it once immediately so we don't have to wait for it
    this._updateBalance();
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  // The next two methods just read from the contract and store the results
  // in the component state.

  async _updateBalance() {
    const balance = await this._token.balanceOf(this.state.selectedAddress);
    // const tokenIds = await this._token.tokensOfOwner(this.state.selectedAddress);
    // console.log(tokenIds)
    this.setState({ balance });
  }

  // This method sends an ethereum transaction to transfer tokens.
  // While this action is specific to this application, it illustrates how to
  // send a transaction.
  async _transferTokens(to, amount) {
    // Sending a transaction is a complex operation:
    //   - The user can reject it
    //   - It can fail before reaching the ethereum network (i.e. if the user
    //     doesn't have ETH for paying for the tx's gas)
    //   - It has to be mined, so it isn't immediately confirmed.
    //     Note that some testing networks, like Hardhat Network, do mine
    //     transactions immediately, but your dapp should be prepared for
    //     other networks.
    //   - It can fail once mined.
    //
    // This method handles all of those things, so keep reading to learn how to
    // do it.

    try {
      // If a transaction fails, we save that error in the component's state.
      // We only save one such error, so before sending a second transaction, we
      // clear it.
      this._dismissTransactionError();

      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      const tx = await this._token.transfer(to, amount);
      this.setState({ txBeingSent: tx.hash });

      // We use .wait() to wait for the transaction to be mined. This method
      // returns the transaction's receipt.
      const receipt = await tx.wait();

      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that made the transaction fail when it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed");
      }

      // If we got here, the transaction was successful, so you may want to
      // update your state. Here, we update the user's balance.
      await this._updateBalance();
    } catch (error) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      // Other errors are logged and stored in the Dapp's state. This is used to
      // show them to the user, and for debugging.
      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      this.setState({ txBeingSent: undefined });
    }
  }

  // This method just clears part of the state.
  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  // This method just clears part of the state.
  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  // This is an utility method that turns an RPC error into a human readable
  // message.
  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }

  // This method resets the state
  _resetState() {
    this.setState(this.initialState);
  }

  async _switchChain() {
    const chainIdHex = `0x${HARDHAT_NETWORK_ID.toString(16)}`
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
    await this._initialize(this.state.selectedAddress);
  }

  // This method checks if the selected network is Localhost:8545
  _checkNetwork() {
    if (window.ethereum.networkVersion !== HARDHAT_NETWORK_ID) {
      this._switchChain();
    }
  }

  uploadHandler = async (files, addr) => {
    const fileUploadPromises = files.map(async ({ file }) => {
      const fileName = uuidv4();
      console.log(fileName);
      console.log(addr);
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, file);

      const downloadUrl = await getDownloadURL(storageRef);

      // 파일 업로드 완료 후 토큰 민팅
      const tokenId = uuidTouint256(fileName);
      const tokenMetadata = {
        name: file.name,
        fileType: file.type,
        url: downloadUrl,
      };
      // 토큰 민팅을 위한 mint 함수 호출
      const transaction = await this._token.mintNFT(tokenMetadata, tokenId, addr);
      await transaction.wait();

      console.log('File uploaded and token minted successfully!');
      return tokenId
    });
    console.log('All files uploaded and tokens minted!');

    return await Promise.all(fileUploadPromises);
  };

  updateReciepts = async (newReciepts) => {
    try {
      const docRef = await addDoc(collection(db, "tokens"), newReciepts);
    
      console.log("Document written with ID: ", docRef.id);
      this.state.reciepts.push(newReciepts)
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }



  // isTokenOwner = async (tokenId) => {
  //   const tokenIdBigNumber = ethers.BigNumber.from(tokenId);
  //   const owner = await this._token.ownerOf(tokenIdBigNumber);
  //   console.log(owner);
  //   return owner.toLowerCase() === this.state.selectedAddress.toLowerCase()
  // }
  isTokenOwner = async (tokenId) => {
    const tokenIdBigNumber = ethers.BigNumber.from(tokenId);
    try {
      const owners = await this._token.getTokenOwners(tokenIdBigNumber);
    // owners 배열이 존재하지 않으면 소유자가 아님을 반환
      if (!owners) {
        console.log("owners empty");
        return false;
      }
    
      for (let i = 0; i < owners.length; i++) {
        const owner = owners[i];
        if (owner.toLowerCase() === this.state.selectedAddress.toLowerCase()) {
          console.log(owner);
          return true; // 소유자로 확인됨
        }
      }
    
      return false; // 소유자가 아님
    } catch (e) {
      return false;
    }
  }

  getMetaDataUrl = async (tokenId) => {
    const metadata = await this._token.getTokenMetadata(tokenId);
    return metadata?.url;
  }
    // const owners = await this._token.tokenOwners[tokenId];
}

const uuidTouint256 = (uuid) => {
  const uuidBytes = ethers.utils.arrayify(`0x${uuid.replace(/-/g, "")}`);
  const randomUint256 = ethers.utils.keccak256(uuidBytes);
  return randomUint256.toString();
}
