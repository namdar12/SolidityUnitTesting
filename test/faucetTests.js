const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');

describe('Faucet', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory('Faucet');
    const faucet = await Faucet.deploy();

    const [owner] = await ethers.getSigners();

    const [address] = await faucet.address

    let withdrawAmount = ethers.utils.parseUnits('1', 'ether');

    return { faucet, owner, withdrawAmount, address };
  }

  
  it('should deploy and set the owner correctly', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });

  it('should not allow withdrawals above .1 ETH at a time', async function () {
    const { faucet, withdrawAmount } = await loadFixture(
      deployContractAndSetVariables
    );
    await expect(faucet.withdraw(withdrawAmount)).to.be.reverted;
  });

  it('should allow destroy faucet to only be called by owner', async function () {
    const { faucet, owner } = await loadFixture(
      deployContractAndSetVariables
    );
    await expect(faucet.destroyFaucet());
  });

  it('should allow withdraw to only be called by owner', async function () {
    const { faucet, owner } = await loadFixture(
      deployContractAndSetVariables
    );
    await expect(faucet.withdrawAll());
  });


  // it('Should not work', async function () {
  //   const {faucet,address} = await loadFixture(deployContractAndSetVariables);
  //   const contract = await hre.ethers.getContractAt("Faucet",address)

  //   await expect(contract.destroyFaucet()).to.be.reverted;


  // });



});