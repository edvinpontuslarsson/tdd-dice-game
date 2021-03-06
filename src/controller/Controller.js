'use strict'

const CustomError = require('../../src/model/CustomError')

class Controller {
    playGame(game, ui) {
        if (!game || !ui) 
            throw new CustomError.EmptyArgumentError()

        ui.initializeView(console)
        ui.displayRolledDiceAmount()
        ui.displayInstructions()

        if (ui.doesUserWantToRollNewDie()) 
            game.rollNewDie()

        if (ui.didUserGuess())
            this.handleGuess(game, ui)
    }

    handleGuess(game, ui) {
        const guess = ui.getGuess()
            
        if (game.isGuessCorrect(guess))
            ui.displayCorrectGuess()
        else
            ui.displayIncorrectGuess()

        game.resetGame()
    }
}

module.exports = Controller
