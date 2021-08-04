// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";


/**
 * @title ERC721 Asset Backed Token
 * @dev ERC721 Token backed by an ERC20 token. ERC20 needs to be transfered on mint, and is redemeed
 * when token is burned. This gives this token a "hard floor". 
 */
abstract contract ERC721AssetBacked is ERC721 {
    
    //asset used to back token
    address public immutable asset;
    uint256 public immutable backingAmount;

    /**
     * @param asset_ is the asset used for collateral to back the token
     * @param asset_ is the amount of the asset required 
     */
    constructor(address asset_, uint256 backingAmount_, string memory name_, string memory symbol_) ERC721(name_, symbol_) {
        asset = asset_;
        backingAmount = backingAmount_;
    }

    /**
     * @notice Mints tokenId after transfering collateral from new owner
     */
    function _mint(address to, uint256 tokenId) internal virtual override{
        IERC20(asset).transferFrom(to, address(this), backingAmount);
        ERC721._mint(to, tokenId);
    }
    
    /**
     * @notice Burns tokenId and transfers ERC20 back to the owner
     * @dev note that that this doesn't perform ownership checks, add if necessary
     */
    function _burn(uint256 tokenId) internal virtual override{
        address owner = ERC721.ownerOf(tokenId);
        IERC20(asset).transfer(owner, backingAmount);
        ERC721._burn(tokenId);
    }
}