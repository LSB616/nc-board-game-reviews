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
      const countTest = reviews.filter(review => review.review_id === 3)
      expect(countTest[0].comment_count).toBe('5');
      expect(reviews).toBeSortedBy('created_at', {
        descending: true
      })
    });
  })
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


describe('GET /api/reviews/:review_id/comments', () => {
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
      expect(comments[0].review_id).toBe(1);
      expect(comments[1].review_id).toBe(1);
      expect(comments[2].review_id).toBe(1);
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

describe('POST /api/reviews/:review_id/comments', () => {
  const newComment = {
    username: 'weegembump',
    body: 'Not Enough DICE!!!!'
  }
  test('should add a comment to the database and respond wiht the newly created comment', () => {
    return request(app)
    .post("/api/reviews/1/comments")
    .send(newComment)
    .expect(201)
    .then(({ body }) => {
      const { amendedComment } = body;
      const editedComment = [{
        comment_id: expect.any(Number),
        body: 'Not Enough DICE!!!!',
        review_id: 1,
        author: 'weegembump',
        votes: 0,
        created_at: expect.any(String)
      }]
      expect(amendedComment).toEqual(editedComment);
    })
  });
  test('should return 400 when provided an invalid id', () => {
    return request(app)
    .post("/api/reviews/banana/comments")
    .send(newComment)
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad Request");
    })
  });
  test('should return 404 when review id not found', () => {
    return request(app)
    .post("/api/reviews/1000/comments")
    .send(newComment)
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe('Path Not Found');
    })
  });
  test('should return 404 when user not found', () => {
    const invalidComment = {
      username: 'KerplunkMaster4000',
      body: 'Y tho??'
    }
    return request(app)
    .post("/api/reviews/1/comments")
    .send(invalidComment)
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe('Path Not Found');
    })
  });
  test('should return a 400 when provided an incomplete dataset', () => {
    const incompleteComment = {
      username: '',
      body: '',
    };
    return request(app)
    .post("/api/reviews/1/comments")
    .send(incompleteComment)
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad Request");
    })
  });
  });





























































  describe('GET /api/users', () => {
    test('should return an object with the key of users and an array of the category objects', () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
            const { users } = body
            const expected = {          
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
            };
            users.forEach(user => {
              expect(user).toEqual(expect.objectContaining(expected))
            });
            expect(users.length).toBe(6);
        })
    });
  });
