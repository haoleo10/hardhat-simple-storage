const { assert } = require("chai")
const { ethers } = require("hardhat")

describe("SimpleStorage", function () {
    let SSFactory, SS
    beforeEach(async function () {
        SSFactory = await ethers.getContractFactory("SimpleStorage")
        SS = await SSFactory.deploy()
    })
    it("从0开始", async function () {
        const currentNumber = await SS.retrieve()
        const expectedNumber = "0"

        assert.equal(currentNumber.toString(), expectedNumber)
    })
    it("等于更新后的值", async function () {
        const expectedNumber = "9"
        const transActionResponce = await SS.store(expectedNumber)
        await transActionResponce.wait(1)
        const updatedAumber = await SS.retrieve()

        assert.equal(updatedAumber.toString(), expectedNumber)
    })
    it("人物信息应该对得上：", async function () {
        const expectedName = "lily"
        const expectedNumber = "9"

        const transActionResponce = await SS.addPerson(
            expectedName,
            expectedNumber
        )

        await transActionResponce.wait(1)

        const person = await SS.people(0)
        const name = person.name
        const number = person.favoriteNumber
        assert.equal(name, expectedName)
        assert.equal(number, expectedNumber)
    })
})
