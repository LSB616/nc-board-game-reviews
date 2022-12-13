const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");

afterAll(() => {
  if (db.end) db.end();
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
            const { categories } = body
            const expected = {          
            slug: expect.any(String),
            description: expect.any(String),
            }
            categories.forEach(category => {
              expect(category).toEqual(expect.objectContaining(expected))
            });
            expect(categories.length).toBe(7);
        })
    });
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
  })
});

describe('GET /api/reviews/:review_id', () => {
  test('should return an array of comments for the provided review_id', () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
          const expected = {          
          comment_id: expect.any(Number),
          review_id: expect.any(Number),
          created_at: expect.any(String),
          votes: expect.any(Number),
          author: expect.any(String),
          body: expect.any(String)
      }
      comments.forEach(comment => {
        expect(comment).toEqual(expect.objectContaining(expected))
      })
      expect(comments.length).toBe(3);
      expect(comments).toBeSortedBy('created_at', {
        descending: true
      })
      });
  });
  test('should return a 404 when passed an id which does not exist', () => {
    return request(app)
    .get("/api/reviews/100/comments")
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe('Not Found');
    })
  });
  test('should return a 400 when passed an invalid id', () => {
    return request(app)
    .get("/api/reviews/hello/comments")
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe('Invalid Id');
    })
  });
});