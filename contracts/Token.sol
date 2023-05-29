//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;

// We import this library to be able to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

struct TokenMetadata {
    string name;
    //uint256 size;
    string fileType;
    string url;
}


// This is the main building block for smart contracts.
contract Token is ERC721URIStorage, Ownable{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint256 => TokenMetadata) private tokenMetadataMap;
    uint256 private tokenIdCounter;
    

    // The fixed amount of tokens stored in an unsigned integer type variable.
    uint256 public totalSupply = 1000000;

    // An address type variable is used to store ethereum accounts.
    // address public owner;

    // A mapping is a key/value map. Here we store each account balance.
    mapping(address => uint256) balances;

    /**
     * Contract initialization.
     */
    constructor() public ERC721("MyNFT", "NFT"){
        balances[msg.sender] = totalSupply;
        //owner = msg.sender;
    }

    function _setTokenMetadata(uint256 tokenId, TokenMetadata memory tokenMetadata) internal {
        tokenMetadataMap[tokenId] = tokenMetadata;
        // 또는 토큰 ID에 해당하는 토큰의 메타데이터를 토큰 컨트랙트의 상태 변수에 저장할 수도 있습니다.
        //Token[tokenId].metadata = tokenMetadata;
        // 실제 구현 방식은 토큰 컨트랙트의 로직과 요구사항에 따라 다를 수 있습니다.
    }

    function getTokenMetadata(uint256 tokenId) public view returns (TokenMetadata memory) {
        return tokenMetadataMap[tokenId];
        // 또는 토큰 ID에 해당하는 토큰의 메타데이터를 토큰 컨트랙트의 상태 변수에 저장할 수도 있습니다.
        //Token[tokenId].metadata = tokenMetadata;
        // 실제 구현 방식은 토큰 컨트랙트의 로직과 요구사항에 따라 다를 수 있습니다.
    }

    function mintNFT(TokenMetadata memory tokenMetadata, uint256 tokenId) public  { 
        require(!_exists(tokenId), "Token ID already exists");
        _safeMint(msg.sender, tokenId);
        _setTokenMetadata(tokenId, tokenMetadata);
    }


    /**
     * A function to transfer tokens.
     *
     * The `external` modifier makes a function *only* callable from outside
     * the contract.
     */
    function transfer(address to, uint256 amount) external {
        // Check if the transaction sender has enough tokens.
        // If `require`'s first argument evaluates to `false` then the
        // transaction will revert.
        require(balances[msg.sender] >= amount, "Not enough tokens");

        // We can print messages and values using console.log, a feature of
        // Hardhat Network:
        console.log(
            "Transferring from %s to %s %s tokens",
            msg.sender,
            to,
            amount
        );

        // Transfer the amount.
        balances[msg.sender] -= amount;
        balances[to] += amount;

        // Notify off-chain applications of the transfer.
        emit Transfer(msg.sender, to, amount);
    }

    /**
     * Read only function to retrieve the token balance of a given account.
     *
     * The `view` modifier indicates that it doesn't modify the contract's
     * state, which allows us to call it without executing a transaction.
     */
    function balanceOf(address account) public view override returns (uint256) {
        return balances[account];
    }
}