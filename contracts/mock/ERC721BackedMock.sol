// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { ERC721Backed } from "../ERC721Backed.sol";


contract ERC721BackedMock is ERC721Backed {

    constructor(address asset_, uint256 backingAmount_, string memory name_, string memory symbol_) 
    ERC721Backed(asset_, backingAmount_, name_, symbol_) {}

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

    function burn(uint256 tokenId) public {
        _burn(tokenId);
    }
}
