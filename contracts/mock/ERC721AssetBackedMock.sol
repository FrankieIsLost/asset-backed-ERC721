// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { ERC721AssetBacked } from "../ERC721AssetBacked.sol";


contract ERC721AssetBackedMock is ERC721AssetBacked {

    constructor(address asset_, uint256 backingAmount_, string memory name_, string memory symbol_) 
    ERC721AssetBacked(asset_, backingAmount_, name_, symbol_) {}

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

    function burn(uint256 tokenId) public {
        _burn(tokenId);
    }
}
