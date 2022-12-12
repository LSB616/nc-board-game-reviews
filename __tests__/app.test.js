const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const { string } = require("pg-format");

afterAll(() => {
  if (db.end) db.end();
});

describe('GET /api', () => {
    test('should return an object in the body', () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeInstanceOf(Object);
            expect(Object.keys(body)).toEqual(["message"]);
            expect(body.message).toBe("ok");
          });
    });
});

describe('GET /api for non existant route', () => {
    test('should respond with a 404 when provided with a non existant route', () => {
      return request(app)
        .get("/api/non-existant-route")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({msg: 'Path Not Found'});
        })
    });
  });


describe('GET /api/categories', () => {
    test('should return an object with the key of categories and an array of the category objects', () => {
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeInstanceOf(Object);
            expect(Object.keys(body)).toEqual(["categories"]);
            const { categories } = body
            expect(categories).toBeInstanceOf(Array);
            const expected = {          
            slug: expect.any(String),
            description: expect.any(String),
            }
            expect(categories[0]).toEqual(expect.objectContaining(expected))
        })
    });
});