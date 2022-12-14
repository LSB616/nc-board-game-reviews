const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");

const { checkIfReviewIdExists, isIdValid } = require('../controllers/controller_functions');

afterAll(() => {
    if (db.end) db.end();
  });

describe('checkIfReviewIdExists', () => {
    test('should return true when id exists', () => {
        return checkIfReviewIdExists('1').then((data) => {
            expect(data).toBe(true);
        });
    });
    test('should return not found when id does not exist', () => {
        const expected = {status: 404, msg: 'Not Found'}
        return expect(checkIfReviewIdExists('100')).rejects.toEqual(expected)
    });
});

describe('isIdValid', () => {
    test('should return true if ID is a number', () => {
        expect(isIdValid('1')).toBe(true);
    });
    test('should return rejected Promise if ID is not a number', () => {
    const expected = {status: 400, msg: 'Invalid Id'}
    return expect(isIdValid('hello')).rejects.toEqual(expected)
    });
    });