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










































































describe('PATCH /api/reviews/:review_id', () => {
  test('should accept a positive number and update the votes property according to the number returning updated review', () => {
    const votes = {inc_votes: 5}
    const reviewFour = {
      review_id: 4,
      title: 'One Night Ultimate Werewolf',
      category: 'hidden-roles',
      designer: 'Akihisa Okui',
      owner: 'happyamy2016',
      review_body: 'We couldn\'t find the werewolf!',
      review_img_url: 'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      created_at: '2021-01-18T10:01:41.251Z',
      votes: 10
    }
    return request(app)
    .patch('/api/reviews/4')
    .send(votes)
    .expect(200)
    .then(({ body }) => {
      expect(body).toEqual({review: [{
        ...reviewFour
      }]})
    })
  });
  test('should accept a negative number and update the votes property according to the number returning updated review', () => {
    const votes = {inc_votes: -10}
    const reviewFour = {
      review_id: 4,
      title: 'One Night Ultimate Werewolf',
      category: 'hidden-roles',
      designer: 'Akihisa Okui',
      owner: 'happyamy2016',
      review_body: 'We couldn\'t find the werewolf!',
      review_img_url: 'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      created_at: '2021-01-18T10:01:41.251Z',
      votes: 0
    }
    return request(app)
    .patch('/api/reviews/4')
    .send(votes)
    .expect(200)
    .then(({ body }) => {
      expect(body).toEqual({review: [{
        ...reviewFour
      }]})
    })
  })
  // test.only('should respond with a 400 when provided with an invalid id', () => {
  //   const votes = {inc_votes: 10}
  //   return request(app)
  //   .patch('/api/reviews/banana')
  //   .send(votes)
  //   .expect(400)
  //   .then(({ body: { msg } }) => {
  //     expect(msg).toBe("Bad Request");
  //   })
  //   })
  //   test('should respond with a 404 when id not found', () => {
  //     const votes = {inc_votes: 10}
  //     return request(app)
  //     .patch('/api/reviews/1000')
  //     .send(votes)
  //     .expect(404)
  //     .then(({ body: { msg } }) => {
  //       expect(msg).toBe('Path Not Found');
  //     })
  //   });
  //   test('should respond with a 400 when provided an incorrect dataset', () => {
  //     const votes = {inc_votes: ''}
  //     return request(app)
  //     .patch('/api/reviews/4')
  //     .send(votes)
  //     .expect(400)
  //     .then(({ body: { msg } }) => {
  //       expect(msg).toBe("Bad Request");
  //     })
  //   });
  });
