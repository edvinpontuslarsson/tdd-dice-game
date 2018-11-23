'use strict'

const CustomError = require('../../src/model/CustomError')

class UserInterface {
    constructor (game) {
        if(!game) throw new CustomError.EmptyArgumentError()

        this.displayRolledDiceAmount = () => {
            const amount = game.getRolledDiceAmount()
            console.log(`Amount of dice rolled: ${amount}`)
        }

        this.displayInstructions = () => {
            console.log(
                'Enter "r" to roll another die or enter an integer to guess total dice value'
            )
        }
    }
}

module.exports = UserInterface
