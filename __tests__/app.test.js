const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const { string } = require("pg-format");

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































describe('GET /api/reviews/:review_id', () => {
  test('should return a review object based upon the specified review id', () => {
    return request(app)
    .get("/api/reviews/1")
    .expect(200)
    .then(({ body }) => {
      const { review } = body
      const expected = {
        review_id: 1,
        title: 'Culture a Love of Agriculture With Agricola',
        review_body: 'You could sum up Agricola with the simple phrase \'Farmyeard Fun\' but the mechanics and game play add so much more than that. You\'ll find yourself torn between breeding pigs, or sowing crops. Its joyeous and rewarding and it makes you think of time spent outside, which is much harder to do these days!',
        designer: 'Uwe Rosenberg',
        review_img_url: 'https://images.pexels.com/photos/4917821/pexels-photo-4917821.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        votes: 1,
        category: 'strategy',
        owner: 'tickle122',
        created_at: '2021-01-18T10:00:20.514Z'
      }
    expect(review[0]).toEqual(expected);
    })
  });
  test('should return a 404 when passed an id which does not exist', () => {
    return request(app)
    .get("/api/reviews/100")
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe('Not Found');
    })
  });
  test('should return a 400 when passed an invalid id', () => {
    return request(app)
    .get("/api/reviews/hello")
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe('Invalid Id');
    })
  });
});