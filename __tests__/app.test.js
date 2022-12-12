const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const { string } = require("pg-format");

afterAll(() => {
  if (db.end) db.end();
});

describe('GET /api/reviews', () => {
  test('should return an object containing an array of review objects ', () => {
      return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
      const { reviews } = body;
      const expected = {          
          owner: expect.any(String),
          title: expect.any(String),
          review_id: expect.any(Number),
          category: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          designer: expect.any(String),
          comment_count: expect.any(String)
      }
      reviews.forEach(review => {
      expect(review).toEqual(expect.objectContaining(expected))
      });
      expect(reviews.length).toBe(24);
      const countTest = reviews.filter(review => review.review_id === 1)
      expect(countTest[0].comment_count).toBe('3');
      expect(reviews).toBeSortedBy('created_at', {
        descending: true
      })
    });
  });
});