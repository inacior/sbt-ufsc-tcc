const { expect } = require('chai');
const { ethers } = require('hardhat');
const {
  expectRevert,
} = require('@openzeppelin/test-helpers');

describe('SBTContract', function () {
  before(async () => {
    CONTRACT_ID = 'SBT';
    CONTRACT_NAME = 'Test SBT Token';
    [owner, user1, user2, user3] = await ethers.getSigners();
    const SBTContract = await ethers.getContractFactory('UFSCSBT');
    sbt = await SBTContract.deploy(CONTRACT_NAME, CONTRACT_ID);
  });

  describe('Operators', function () {
    it('Should get an empty list for user3', async function () {
      const enabledList = await sbt.connect(owner).getOperator(user3.address);

      expect(enabledList).is.empty
    });

    it('Enable user3 to reference INE0001', async function () {
      await sbt.connect(owner).enableOperator(user3.address, "INE0001");
      const enabledList = await sbt.connect(owner).getOperator(user3.address);

      expect(enabledList.length).to.equal(1)
      expect(enabledList[0]).to.equal('INE0001')
    });

    it('Enable user3 to reference INE0002 and INE0003', async function () {
      await sbt.connect(owner).enableOperator(user3.address, "INE0002");
      await sbt.connect(owner).enableOperator(user3.address, "INE0003");
      const enabledList = await sbt.connect(owner).getOperator(user3.address);

      expect(enabledList.length).to.equal(3)
      expect(enabledList[0]).to.equal('INE0001')
      expect(enabledList[1]).to.equal('INE0002')
      expect(enabledList[2]).to.equal('INE0003')
    });

    it('Cant duplicate reference', async function () {
      let error;
      const enabledList = await sbt.connect(owner).getOperator(user3.address);

      expect(enabledList.length).to.equal(3)
      expect(enabledList[0]).to.equal('INE0001')

      try {
        await sbt.connect(owner).enableOperator(user3.address, "INE0001");
      } catch (e) {
        error = e
      }

      expect(error.reason).to.equal("Error: VM Exception while processing transaction: reverted with reason string 'Operator are already enabled to manage this identifier'")
    });

    it('Disable user3 to reference INE0001', async function () {
      const enabledList = await sbt.connect(owner).getOperator(user3.address);

      expect(enabledList.length).to.equal(3)
      expect(enabledList[0]).to.equal('INE0001')

      await sbt.connect(owner).disableOperator(user3.address, "INE0001");
      const enabledListEmpty = await sbt.connect(owner).getOperator(user3.address);

      expect(enabledListEmpty.length).to.equal(2)
      expect(enabledListEmpty[0]).to.equal('INE0002')
      expect(enabledListEmpty[1]).to.equal('INE0003')
    });
  });

  describe('Token', function () {
    it('Should return the name and id', async function () {
      expect(await sbt.name()).to.equal(CONTRACT_NAME);
      expect(await sbt.id()).to.equal(CONTRACT_ID);
      expect(await sbt.creator()).to.equal(owner.address);
    });

    it('Mint a new SoulboundToken to user1', async function () {
      const tokenInLedger = await sbt.connect(owner).ownerOf('__TOKEN-ID-1__');
      expect(tokenInLedger).to.equal('0x0000000000000000000000000000000000000000');

      await sbt.connect(owner).mint('__TOKEN-ID-1__', 'INE0004', user1.address);
      const mintedToken = await sbt.connect(owner).ownerOf('__TOKEN-ID-1__');
      expect(mintedToken).to.equal(user1.address);
    });

    it('Cant mint a new SoulboundToken with the same tokenId', async function () {
      let error;
      await sbt.connect(owner).mint('__TOKEN-ID-2__', 'INE0005', user1.address);

      try {
        await sbt.connect(owner).mint('__TOKEN-ID-2__', 'INE0005', user2.address);
      } catch (e) {
        error = e
      }

      expect(error.reason).to.equal("Error: VM Exception while processing transaction: reverted with reason string 'There is already a SoulboundToken with given tokenId'")
    });

    it('Burn a SoulboundToken', async function () {
      const mintedToken = await sbt.connect(owner).ownerOf('__TOKEN-ID-2__');
      expect(mintedToken).to.equal(user1.address);

      await sbt.connect(owner).burn('__TOKEN-ID-2__');

      const tokenInLedger = await sbt.connect(owner).ownerOf('__TOKEN-ID-2__');
      expect(tokenInLedger).to.equal('0x0000000000000000000000000000000000000000');
    });

    it('Only operators or contract owner can burn a SoulboundToken', async function () {
      let error;
      await sbt.connect(owner).mint('__TOKEN-ID-3__', 'INE0006', user1.address);

      try {
        await sbt.connect(user2).burn('__TOKEN-ID-3__');
      } catch (e) {
        error = e
      }

      expect(error.reason).to.equal("Error: VM Exception while processing transaction: reverted with reason string 'You arent enabled to manage this tokenReference'")
    });
  });
});
