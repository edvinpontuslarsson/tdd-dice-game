'use strict'

const assert = require('chai').assert
const Die = require('../../src/model/Die')

describe('Test of Die instance', () => {
    describe('Tests that Die can be instantiated', () => {
        it('new Die() should be defined', done => {
            assert.isDefined(new Die())
            done()
        })
    })

    describe('Tests of Die.faceValue', () => {
        it('new Die().faceValue should be null', done => {
            assert.isNull(new Die().faceValue)
            done()
        })
    })
})