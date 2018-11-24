'use strict'

const UserInterface = require('../../src/view/UserInterface')
const mockConsole = require('jest-mock-console').default
const ReadlineSyncStub = require('./ReadlineSyncStub')
const CustomConsoleStub = require('./CustomConsoleStub')
const CustomError = require('../../src/model/CustomError')
const Game = require('../../src/model/Game')
const Die = require('../../src/model/Die')

describe('Tests of UserInterface', () => {

    describe('Test of UserInterface constructor', () => {
        it('new UserInterface() should throw EmptyArgumentError', () => {
            expect(() => new UserInterface())
                .toThrowError(CustomError.EmptyArgumentError)
        })

        it('new UserInterface(game), but no readline instance, should throw EmptyArgumentError', () => {
            const game = new Game(new Die())
            expect(() => new UserInterface(game))
                .toThrowError(CustomError.EmptyArgumentError)
        })
    })

    describe('Test of displayWelcomeMessage', () => {
        it('Should clear console', () => {
            const customConsole = new CustomConsoleStub()
            const game = new Game(new Die())
            const readline = new ReadlineSyncStub()
            const ui = new UserInterface(game, readline)

            ui.displayWelcomeMessage(customConsole)
            
            expect(customConsole.hasCalledClear()).toBe(true)
        })

        it('Should throw EmptyArgumentError if no console is provided', () => {
            const game = new Game(new Die())
            const readline = new ReadlineSyncStub()
            const ui = new UserInterface(game, readline)
            
            expect(() => ui.displayWelcomeMessage())
                .toThrowError(CustomError.EmptyArgumentError)
        })

        it('Should call console.log with correct message', () => {
            const restoreConsole = mockConsole()
            const game = new Game(new Die())
            const readline = new ReadlineSyncStub()
            const ui = new UserInterface(game, readline)

            ui.displayWelcomeMessage(console)

            expect(console.log).toHaveBeenCalledWith('Welcome!')
            restoreConsole()
        })
    })
    
    describe('Test of displayRolledDiceAmount', () => {
        it('Looping should result in correct result every time', () => {
            const restoreConsole = mockConsole()
            const game = new Game(new Die())
            const readline = new ReadlineSyncStub()
            const ui = new UserInterface(game, readline)

            for(let amount = 1; amount < 5; amount += 1) {
                game.rollNewDie()
                ui.displayRolledDiceAmount()
                
                expect(console.log).toHaveBeenCalledWith(
                    `Amount of dice rolled: ${amount}`
                )
            }
            restoreConsole()
        })
    })

    describe('Test of displayInstructions', () => {
        it('Should call console.log with correct message', () => {
            const restoreConsole = mockConsole()
            const game = new Game(new Die())
            const readline = new ReadlineSyncStub()

            new UserInterface(game, readline).displayInstructions()
            
            expect(console.log).toHaveBeenCalledWith(
                'Enter "r" to roll another die or enter an integer to guess total dice value'
            )
            restoreConsole()
        })
    })

    describe('Tests of doesUserWantToRollNewDie', () => {
        it('Should call ReadlineSyncStub.question with correct question', () => {
            const game = new Game(new Die())
            const readline = new ReadlineSyncStub()
            const ui = new UserInterface(game, readline)
            
            ui.doesUserWantToRollNewDie()

            expect(readline.getAskedQuestion())
                .toEqual('\tWhat do you want to do?: ')
        })
        
        it('Should return true if user input is "r"', () => {
            const game = new Game(new Die())
            const simpleReadlineStub = { question: () => 'r' }
            const ui = new UserInterface(game, simpleReadlineStub)

            const actual = ui.doesUserWantToRollNewDie()
            expect(actual).toBe(true)
        })

        it('Should return true if user input is "R"', () => {
            const game = new Game(new Die())
            const simpleReadlineStub = { question: () => 'R' }
            const ui = new UserInterface(game, simpleReadlineStub)

            const actual = ui.doesUserWantToRollNewDie()
            expect(actual).toBe(true)
        })

        it('Should return false if user input is something else', () => {
            const game = new Game(new Die())
            const simpleReadlineStub = { question: () => 'something else'}
            const ui = new UserInterface(game, simpleReadlineStub)

            const actual = ui.doesUserWantToRollNewDie()
            expect(actual).toBe(false)
        })
    })

    describe('Tests of didUserGuess', () => {
        it('Should call ReadlineSyncStub.question with correct question', () => {
            const game = new Game(new Die())
            const readline = new ReadlineSyncStub()
            const ui = new UserInterface(game, readline)
            
            ui.didUserGuess()

            expect(readline.getAskedQuestion())
                .toEqual('\tWhat do you want to do?: ')
        })

        it('Should return true if user input is an integer', () => {
            const game = new Game(new Die())
            const simpleReadlineStub = { question: () => 1}
            const ui = new UserInterface(game, simpleReadlineStub)

            const actual = ui.didUserGuess()
            expect(actual).toBe(true)
        })

        it('Should return false if user input is not a number', () => {
            const game = new Game(new Die())
            const simpleReadlineStub = { question: () => 'not a number'}
            const ui = new UserInterface(game, simpleReadlineStub)

            const actual = ui.didUserGuess()
            expect(actual).toBe(false)
        })

        it('Should return false if user input is not an integer', () => {
            const game = new Game(new Die())
            const simpleReadlineStub = { question: () => 1.5}
            const ui = new UserInterface(game, simpleReadlineStub)

            const actual = ui.didUserGuess()
            expect(actual).toBe(false)
        })
    })

    describe('Test of rectifyUser', () => {
        it('Should call console.log with correct message', () => {
            const restoreConsole = mockConsole()
            const game = new Game(new Die())
            const readline = new ReadlineSyncStub()
            const ui = new UserInterface(game, readline)

            ui.rectifyUser()

            expect(console.log).toHaveBeenCalledWith(
                'Invalid input, please try again!'
            )
            restoreConsole()
        })
    })

    describe('Test of displayIncorrectGuess', () => {
        it('Should call console.log with correct message and correct dice value', () => {
            const restoreConsole = mockConsole()
            const simpleDieStub = { rollAndGetFaceValue: () => 1 }

            const game = new Game(simpleDieStub)
            const readline = new ReadlineSyncStub()
            const ui = new UserInterface(game, readline)

            game.rollNewDie()
            ui.displayIncorrectGuess()

            expect(console.log).toHaveBeenCalledWith(
                `Wrong! The total dice value was 1`
            )            
            restoreConsole()
        })

        it('Should call console.log with correct message and correct dice value', () => {
            const restoreConsole = mockConsole()
            const simpleDieStub = { rollAndGetFaceValue: () => 3 }

            const game = new Game(simpleDieStub)
            const readline = new ReadlineSyncStub()
            const ui = new UserInterface(game, readline)

            game.rollNewDie()
            ui.displayIncorrectGuess()
            
            expect(console.log).toHaveBeenCalledWith(
                `Wrong! The total dice value was 3`
            )            
            restoreConsole()
        })
    })

    describe('Test of displayCorrectGuess', () => {
        it('Should call console.log with correct message', () => {
            const restoreConsole = mockConsole()
            const game = new Game(new Die())
            const readline = new ReadlineSyncStub()

            new UserInterface(game, readline).displayCorrectGuess()

            expect(console.log).toHaveBeenCalledWith('Correct! Congratulations!')
            restoreConsole()
        })
    })
})
