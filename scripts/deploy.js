const { ethers, run, network } = require("hardhat")


async function main() {
    const SSFactory = await ethers.getContractFactory("SimpleStorage")
    console.log("部署中")
    const SS = await SSFactory.deploy()
    await SS.deployed()
    console.log(`部署地址：${SS.address}`)

    if (network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY){
      console.log("等待区块确认")
      await SS.deployTransaction.wait(6)
      await verify(SS.address, [])
    }

    const currentNumber = await SS.retrieve()
    console.log(`目前的值是：${currentNumber}`)

    const transActionResponce = await SS.store(9)
    await transActionResponce.wait(1)
    const updatedAumber = await SS.retrieve()
    console.log(`更新后的值是：${updatedAumber}`)

}


async function verify(contractAddress, args) {
    console.log("验证合约")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
