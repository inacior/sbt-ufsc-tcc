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
    const SBTContract = await ethers.getContractFactory('SBTContract');
    sbt = await SBTContract.deploy(CONTRACT_NAME, CONTRACT_ID);
  });

  it('Should return the name and id', async function () {
    expect(await sbt.name()).to.equal(CONTRACT_NAME);
    expect(await sbt.id()).to.equal(CONTRACT_ID);
    expect(await sbt.operator()).to.equal(owner.address);
  });

  it('Souls sould be empty', async function () {
    const profiles = await sbt.listSouls();

    expect(profiles).is.empty
  });

  it('Create a soul', async function () {
    await sbt.createSoul('PROGRAD', 'https://prograd.ufsc.br');
    const souls = await sbt.listSouls();

    expect(souls).not.is.empty
    const [id, description, caller, url] = souls[0];
    expect(parseInt(id)).to.equal(0)
    expect(description).to.equal('PROGRAD')
    expect(url).to.equal('https://prograd.ufsc.br')
    expect(caller).to.equal(owner.address)
  });

  it('Only operatorn can create a soul', async function () {
    try {
      await sbt.connect(user2).createSoul('OPERATOR_CREATE_TEST', 'https://google.com');
    } catch (error) {
      expect(error.reason).to.equal("Error: VM Exception while processing transaction: reverted with reason string 'Only operator can create a soul'")
    }
  });

  it('Get a soul', async function () {
    await sbt.createSoul('GET_TEST', 'https://google.com');

    const [id, description, caller, url] = await sbt.getSoul(1);
    expect(parseInt(id)).to.equal(1)
    expect(description).to.equal('GET_TEST')
    expect(url).to.equal('https://google.com')
    expect(caller).to.equal(owner.address)
  });

  it('Remove a soul', async function () {
    await sbt.createSoul('DELETE_TEST', 'https://google.com');

    const [id, description, caller, url] = await sbt.getSoul(2);
    expect(parseInt(id)).to.equal(2)
    expect(description).to.equal('DELETE_TEST')
    expect(url).to.equal('https://google.com')
    expect(caller).to.equal(owner.address)

    await sbt.removeSoul(2);

    const [zeroId, zeroCaller] = await sbt.getSoul(2);
    expect(parseInt(zeroId)).to.equal(0)
    expect(zeroCaller).to.equal('')
  });

  it('Only owners can remove a soul', async function () {
    await sbt.connect(owner).createSoul('OWNER_DELETE_TEST', 'https://google.com');

    const [id,, caller] = await sbt.getSoul(3);
    expect(parseInt(id)).to.equal(3)
    expect(caller).to.equal(owner.address)

    try {
      await sbt.connect(user1).removeSoul(3)
    } catch (error) {
      expect(error.reason).to.equal("Error: VM Exception while processing transaction: reverted with reason string 'Only the creator have rights to delete their soul'")
    }
  });

  it('User1 SoulboundTokens array should be empty', async function () {
    const soulboundTokens = await sbt.listSoulboundTokens(user1.address);

    expect(soulboundTokens).is.empty
  });

  it('Create a soulbound token for user1', async function () {
    await sbt.createSoulboundToken(0, 'INE0000', user1.address);
    await sbt.createSoulboundToken(0, 'INE0001', user1.address);
    await sbt.createSoulboundToken(0, 'INE0002', user1.address);

    const user1SoulboundTokens = await sbt.listSoulboundTokens(user1.address);
    const user2SoulboundTokens = await sbt.listSoulboundTokens(user2.address);
    expect(user1SoulboundTokens).not.is.empty;
    expect(user2SoulboundTokens).is.empty;

    const [token1, token2, token3] = user1SoulboundTokens;

    expect(token1[0]).to.equal('INE0000')
    expect(token2[0]).to.equal('INE0001')
    expect(token3[0]).to.equal('INE0002')
  });

  it('Enable user3 as operator', async function () {
    await sbt.enableOperator(user3.address, )
  });
});
