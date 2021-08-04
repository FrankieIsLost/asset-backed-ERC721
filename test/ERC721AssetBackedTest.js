const { expect } = require("chai");

describe("Asset Backed ERC721", function () {

  const assetName = "Asset Token"
  const assetSymbol = "AST"
  const assetSupply = 1000;

  const nftName = "NFT Token"
  const nftSymbol = "NFT"
  const backingAmount = 100;

  const tokenId = 1;

  let erc20Mock;
  let erc721AssetBackedMock;
  let owner;
  let addr1;
  let addrs;


  beforeEach(async function () {

    const erc20Factory = await ethers.getContractFactory("ERC20Mock");
    erc20Mock = await erc20Factory.deploy(assetName, assetSymbol, assetSupply);
    
    const erc721AssetBackedFactory = await ethers.getContractFactory("ERC721AssetBackedMock");
    erc721AssetBackedMock = await erc721AssetBackedFactory.deploy(erc20Mock.address, backingAmount, nftName, nftSymbol);

    [owner, addr1, ...addrs] = await ethers.getSigners();
  });

  describe("Like an asset-backed ERC721", function () {
    
    describe("Mint", function () {
      it("Should be mintable", async function () {
        //transfer asset to address 1 
        await erc20Mock.transfer(addr1.getAddress(), 100);
        //abrove spend of asset by nft contract 
        await erc20Mock.connect(addr1).approve(erc721AssetBackedMock.address, backingAmount);
        //mint
        await erc721AssetBackedMock.mint(addr1.getAddress(), tokenId);
        //check owner of nft
        expect(await erc721AssetBackedMock.ownerOf(tokenId)).to.equal(await addr1.getAddress());
      });

      it("Should reduce asset balance after mint", async function () {
        await erc20Mock.transfer(addr1.getAddress(), 100);

        const balanceBeforeMint = await erc20Mock.balanceOf(addr1.getAddress());
        erc20Mock.connect(addr1).approve(erc721AssetBackedMock.address, backingAmount);
        await erc721AssetBackedMock.mint(addr1.getAddress(), tokenId);
        const balanceAfterMint = await erc20Mock.balanceOf(addr1.getAddress());

        expect(balanceAfterMint + backingAmount).to.eq(balanceBeforeMint);
      });
    });

    describe("Burn", function () {
      it("Should increase balance after burn", async function () {
        await erc20Mock.transfer(addr1.getAddress(), 100);

        await erc20Mock.connect(addr1).approve(erc721AssetBackedMock.address, backingAmount);
        await erc721AssetBackedMock.mint(addr1.getAddress(), tokenId);
        const balanceBeforeBurn = await erc20Mock.balanceOf(addr1.getAddress());
        await erc721AssetBackedMock.burn(tokenId);
        const balanceAfterBurn = await erc20Mock.balanceOf(addr1.getAddress());
        expect(balanceBeforeBurn + backingAmount).to.eq(balanceAfterBurn);
      });
    });
    
  });
});