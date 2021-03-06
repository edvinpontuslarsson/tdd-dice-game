'use strict'

const UserInterface = require('../../src/view/UserInterface')
const mockConsole = require('jest-mock-console').default
const ReadlineSyncStub = require('./ReadlineSyncStub')
const CustomConsoleStub = require('./CustomConsoleStub')
const CustomError = require('../../src/model/CustomError')
const Game = require('../../src/model/Game')
const Die = require('../../src/model/Die')

const game = new Game(new Die())

describe('Tests of UserInterface instance', () => {

    describe('Test of UserInterface constructor', () => {
        it('new UserInterface() should throw EmptyArgumentError', () => {
            expect(() => new UserInterface())
                .toThrowError(CustomError.EmptyArgumentError)
        })

        it('new UserInterface(game), but no readline instance, should throw EmptyArgumentError', () => {
            expect(() => new UserInterface(game))
                .toThrowError(CustomError.EmptyArgumentError)
        })
    })

    describe('Test of initializeView', () => {
        it('Should clear console', () => {
            const customConsole = new CustomConsoleStub()
            const readline = new ReadlineSyncStub()
            const ui = new UserInterface(game, readline)

            ui.initializeView(customConsole)
            
            expect(customConsole.hasCalledClear()).toBeTruthy()
        })

        it('Should set user input to null', () => {
            const customConsole = new CustomConsoleStub()
            
            const specialReadline = {
                calledFirstTime: true,
                question: firstReturn => {
                    if(this.calledFirstTime) {
                        this.calledFirstTime = false
                        return firstReturn
                    } else {
                        return 'Works as expected'
                    }
                }
            }

            const ui = new UserInterface(game, specialReadline)

            ui.getUserInput() // sets user input variable

            ui.initializeView(customConsole)
            
            expect(ui.getUserInput())
                .toBe('Works as expected')
        })

        it('Should throw EmptyArgumentError if no console is provided', () => {
            const readline = new ReadlineSyncStub()
            const ui = new UserInterface(game, readline)
            
            expect(() => ui.initializeView())
                .toThrowError(CustomError.EmptyArgumentError)
        })
    })
    
    describe('Test of displayRolledDiceAmount', () => {
        it('Looping should result in correct result every time', () => {
            const restoreConsole = mockConsole()
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
            const readline = new ReadlineSyncStub()

            new UserInterface(game, readline).displayInstructions()
            
            expect(console.log).toHaveBeenCalledWith(
                'Enter "r" to roll another die or enter a positive integer to guess total dice value'
            )
            restoreConsole()
        })
    })

    describe('Tests of doesUserWantToRollNewDie', () => {
        it('Should call ReadlineSyncStub.question with correct question', () => {
            const readline = new ReadlineSyncStub()
            const ui = new UserInterface(game, readline)
            
            ui.doesUserWantToRollNewDie()

            expect(readline.getAskedQuestion())
                .toEqual('\tWhat do you want to do?: ')
        })
        
        it('Should return true if user input is "r"', () => {
            const simpleReadlineStub = { question: () => 'r' }
            const ui = new UserInterface(game, simpleReadlineStub)

            const actual = ui.doesUserWantToRollNewDie()
            expect(actual).toBeTruthy()
        })

        it('Should return true if user input is "R"', () => {
            const simpleReadlineStub = { question: () => 'R' }
            const ui = new UserInterface(game, simpleReadlineStub)

            const actual = ui.doesUserWantToRollNewDie()
            expect(actual).toBeTruthy()
        })

        it('Should return false if user input is something else', () => {
            const simpleReadlineStub = { question: () => 'something else'}
            const ui = new UserInterface(game, simpleReadlineStub)

            const actual = ui.doesUserWantToRollNewDie()
            expect(actual).toBeFalsy()
        })
    })

    describe('Tests of didUserGuess', () => {
        it('Should call ReadlineSyncStub.question with correct question', () => {
            const readline = new ReadlineSyncStub()
            const ui = new UserInterface(game, readline)
            
            ui.didUserGuess()

            expect(readline.getAskedQuestion())
                .toEqual('\tWhat do you want to do?: ')
        })

        it('Should return true if user input is an integer in string', () => {
            const simpleReadlineStub = { question: () => '1'}
            const ui = new UserInterface(game, simpleReadlineStub)

            const actual = ui.didUserGuess()
            expect(actual).toBeTruthy()
        })

        it('Should return false if user input is not a number', () => {
            const simpleReadlineStub = { question: () => 'not a number'}
            const ui = new UserInterface(game, simpleReadlineStub)

            const actual = ui.didUserGuess()
            expect(actual).toBeFalsy()
        })

        it('Should return false if user input is not an integer', () => {
            const simpleReadlineStub = { question: () => '1.5' }
            const ui = new UserInterface(game, simpleReadlineStub)

            const actual = ui.didUserGuess()
            expect(actual).toBeFalsy()
        })

        it('Should return false if user input is a negative integer', () => {
            const simpleReadlineStub = { question: () => '-1' }
            const ui = new UserInterface(game, simpleReadlineStub)

            const actual = ui.didUserGuess()
            expect(actual).toBeFalsy()
        })
    })

    describe('Test of getGuess', () => {
        it('Looping, should retrun correct guess (as number) every time', () => {

            for (let guess = 0; guess <= 5; guess += 1) {
                const simpleReadlineStub = { question: () => guess.toString() }
                const ui = new UserInterface(game, simpleReadlineStub)

                expect(ui.getGuess())
                    .toBe(guess)
            }            
        })
    })

    describe('Test of rectifyUser', () => {
        it('Should call console.log with correct message', () => {
            const restoreConsole = mockConsole()
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
        it('Looping, should call console.log with correct message and correct dice value', () => {
            for(let value = 1; value <= 10; value += 1) {
                const restoreConsole = mockConsole()
                const simpleDieStub = {
                    rollAndGetFaceValue: () => value
                }

                const game = new Game(simpleDieStub)
                const readline = new ReadlineSyncStub()
                const ui = new UserInterface(game, readline)

                game.rollNewDie()
                ui.displayIncorrectGuess()

                expect(console.log).toHaveBeenCalledWith(
                    `Wrong! The total dice value was ${value}`
                )            
                restoreConsole()
            }
        })

        it('Should call ReadlineSyncStub.question with "\tenter anything to play again: "', () => {
            const readline = new ReadlineSyncStub()

            new UserInterface(game, readline).displayIncorrectGuess()

            expect(readline.getAskedQuestion())
                .toEqual('\tenter anything to play again: ')
        })
    })

    describe('Test of displayCorrectGuess', () => {
        it('Should call console.log with correct message', () => {
            const restoreConsole = mockConsole()
            const readline = new ReadlineSyncStub()

            new UserInterface(game, readline).displayCorrectGuess()

            expect(console.log)
                .toHaveBeenCalledWith('Correct!')
            restoreConsole()
        })

        it('Should call ReadlineSyncStub.question with "\tenter anything to play again: "', () => {
            const readline = new ReadlineSyncStub()

            new UserInterface(game, readline).displayCorrectGuess()

            expect(readline.getAskedQuestion())
                .toEqual('\tenter anything to play again: ')
        })
    })
})
