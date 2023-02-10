const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data')

beforeEach(() => {
  return seed(testData);
});

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
            expect(categories.length).toBe(4);
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
      expect(reviews.length).toBe(13);
      const countTest = reviews.filter(review => review.review_id === 3)
      expect(countTest[0].comment_count).toBe('3');
      expect(reviews).toBeSortedBy('created_at', {
        descending: true
      })
    });
  })
  test('should accept a category query returning all reviews relevant to that category', () => {
    return request(app)
    .get('/api/reviews?category=dexterity')
    .expect(200)
    .then(( { body: { reviews } }) => {
      reviews.forEach(review => {
        expect(review.category).toBe('dexterity')
      })
      expect(reviews).toHaveLength(1);
    })
  });
  test('should accept a sort by query of owner', () => {
    return request(app)
    .get("/api/reviews?sort_by=owner")
    .expect(200)
    .then(( { body: { reviews } }) => {
      expect(reviews).toBeSortedBy('owner', {
        descending: true});
    })
  });
  test('should accept a sort by query of title', () => {
    return request(app)
    .get("/api/reviews?sort_by=title")
    .expect(200)
    .then(( { body: { reviews } }) => {
      expect(reviews).toBeSortedBy('title', {
        descending: true});
    })
  });
  test('should accept a sort by query of category', () => {
    return request(app)
    .get("/api/reviews?sort_by=category")
    .expect(200)
    .then(( { body: { reviews } }) => {
      expect(reviews).toBeSortedBy('category', {
        descending: true});
    })
  });
  test('should accept a sort by query of designer', () => {
    return request(app)
    .get("/api/reviews?sort_by=designer")
    .expect(200)
    .then(( { body: { reviews } }) => {
      expect(reviews).toBeSortedBy('designer', {
        descending: true});
    })
  });
  test('should accept a sort by query of created_at', () => {
    return request(app)
    .get("/api/reviews?sort_by=created_at")
    .expect(200)
    .then(( { body: { reviews } }) => {
      expect(reviews).toBeSortedBy('created_at', {
        descending: true});
    })
  });
  test('should allow client to sort by asc', () => {
    return request(app)
    .get("/api/reviews?order=asc")
    .expect(200)
    .then(( { body: { reviews } }) => {
      expect(reviews).toBeSortedBy('created_at');
    })
  });
  test('should result in a 404 request if passed an non-existant category', () => {
    return request(app)
    .get('/api/reviews?category=YEET')
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe('Category Does Not Exist');
  });
  });
  test('should not allow result to be sorted by an invalid query and should return a 400', () => {
    return request(app)
    .get("/api/reviews?sort_by=invalid")
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe('Bad Request');
  });
  });
  test('should not allow result to be ordered by an invalid query and should return a 400', () => {
    return request(app)
    .get("/api/reviews?order=invalid")
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe('Bad Request');
  });
  });
});


describe('GET /api/reviews/:review_id', () => {
  test('should return a review object based upon the specified review id', () => {
    return request(app)
    .get("/api/reviews/2")
    .expect(200)
    .then(({ body }) => {
      const { review } = body
      const expected = {
        review_id: 2,
        title: 'Jenga',
        review_body: 'Fiddly fun for all the family',
        designer: 'Leslie Scott',
        review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        votes: 5,
        category: 'dexterity',
        owner: 'philippaclaire9',
        created_at: '2021-01-18T10:01:41.251Z',
        comment_count: "3"
      }
    expect(review).toEqual(expect.objectContaining(expected));
    })
  });
  test('should expect an accurate count of the comments associated with the review id', () => {
    return request(app)
    .get("/api/reviews/2")
    .expect(200)
    .then(({ body }) => {
      const { review } = body
      const expected = {
        review_id: 2,
        title: 'JengARRGGGH!',
        review_body: 'Few games are equiped to fill a player with such a defined sense of mild-peril, but a friendly game of Jenga will turn the mustn\'t-make-it-fall anxiety all the way up to 11! Fiddly fun for all the family, this game needs little explaination. Whether you\'re a player who chooses to play it safe, or one who lives life on the edge, eventually the removal of blocks will destabilise the tower and all your Jenga dreams come tumbling down.',
        designer: 'Leslie Scott',
        review_img_url: 'https://images.pexels.com/photos/4009761/pexels-photo-4009761.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
        votes: 5,
        category: 'dexterity',
        owner: 'grumpy19',
        created_at: '2021-01-18T10:01:41.251Z',
        comment_count: "3"
      }
      expect(review.comment_count).toBe('3');
  });
});
// test('should return an accurate comment_count when no comments exist', () => {
//   return request(app)
//   .get("/api/reviews/1")
//   .expect(200)
//   .then(({ body }) => {
//     console.log(body)
//     const { review } = body
//     expect(review.comment_count).toBe('0');
// });
// });
  test('should return a 404 when passed an id which does not exist', () => {
    return request(app)
    .get("/api/reviews/100")
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe('ID Not Found');
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
      .get("/api/reviews/2/comments")
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
      expect(comments[0].review_id).toBe(2);
      expect(comments[1].review_id).toBe(2);
      expect(comments[2].review_id).toBe(2);
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
      expect(msg).toBe('ID Not Found');
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
    username: 'bainesface',
    body: 'Not Enough DICE!!!!'
  }
  test('should add a comment to the database and respond wiht the newly created comment', () => {
    return request(app)
    .post("/api/reviews/2/comments")
    .send(newComment)
    .expect(201)
    .then(({ body }) => {
      const { amendedComment } = body;
      const expectedComment = [{
        comment_id: expect.any(Number),
        body: 'Not Enough DICE!!!!',
        review_id: 2,
        author: 'bainesface',
        votes: 0,
        created_at: expect.any(String)
      }]
      expect(amendedComment).toEqual(expect.objectContaining(expectedComment));
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
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Invalid Values");
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
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Invalid Values");
    });
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

describe('PATCH /api/reviews/:review_id', () => {
  test('should accept a positive number and update the votes property according to the number returning updated review', () => {
    const votes = {inc_votes: 5}
    const reviewFour = {
      review_id: 8,
      title: 'One Night Ultimate Werewolf',
      category: 'social deduction',
      designer: 'Akihisa Okui',
      owner: 'mallionaire',
      review_body: 'We couldn\'t find the werewolf!',
      review_img_url: 'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      created_at: '2021-01-18T10:01:41.251Z',
      votes: 10
    }
    return request(app)
    .patch('/api/reviews/8')
    .send(votes)
    .expect(200)
    .then(({ body }) => {
      expect(body).toEqual({review: {
        ...reviewFour
      }})
    })
  });
  test('should accept a negative number and update the votes property according to the number returning updated review', () => {
    const votes = {inc_votes: -10}
    const reviewFour = {
      review_id: 8,
      title: 'One Night Ultimate Werewolf',
      category: 'social deduction',
      designer: 'Akihisa Okui',
      owner: 'mallionaire',
      review_body: 'We couldn\'t find the werewolf!',
      review_img_url: 'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      created_at: '2021-01-18T10:01:41.251Z',
      votes: -5
    }
    return request(app)
    .patch('/api/reviews/8')
    .send(votes)
    .expect(200)
    .then(({ body }) => {
      expect(body).toEqual({review: {
        ...reviewFour
      }})
    })
  })
  test('should respond with a 400 when provided with an invalid id', () => {
    const votes = {inc_votes: 10}
    return request(app)
    .patch('/api/reviews/banana')
    .send(votes)
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad Request");
    })
    })
    test('should respond with a 404 when id not found', () => {
      const votes = {inc_votes: 10}
      return request(app)
      .patch('/api/reviews/1000')
      .send(votes)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('ID Not Found');
      })
    });
    test('should respond with a 400 when provided an incorrect dataset', () => {
      const votes = {inc_votes: ''}
      return request(app)
      .patch('/api/reviews/4')
      .send(votes)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      })
    });
  });

describe('PATCH /api/reviews/:review_id/edit-review', () => {
  const reviewUpdate = {      
    review_id: 8,
    title: 'One Night Ultimate Werewolf: The New Review',
    category: 'social deduction',
    designer: 'Akihisa Okui',
    owner: 'mallionaire',
    review_body: 'We couldn\'t find the werewolf! But then we found the werewolf! La CHANCE!!!',
    review_img_url: 'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    created_at: '2021-01-18T10:01:41.251Z',
    votes: 5}
  test('should accept updated review data and return an updated review object', () => {
    const reviewFour = {
      review_id: 8,
      title: 'One Night Ultimate Werewolf: The New Review',
      category: 'social deduction',
      designer: 'Akihisa Okui',
      owner: 'mallionaire',
      review_body: 'We couldn\'t find the werewolf! But then we found the werewolf! La CHANCE!!!',
      review_img_url: 'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      created_at: '2021-01-18T10:01:41.251Z',
      votes: 5
    }
    return request(app)
    .patch('/api/reviews/8/edit-review')
    .send(reviewUpdate)
    .expect(200)
    .then(({ body }) => {
      expect(body).toEqual({
        ...reviewFour
      })
    })
  });
  test('should respond with a 400 when provided with an invalid id', () => {
    return request(app)
    .patch('/api/reviews/banana/edit-review')
    .send(reviewUpdate)
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad Request");
    })
    })
    test('should respond with a 404 when id not found', () => {
      return request(app)
      .patch('/api/reviews/1000/edit-review')
      .send(reviewUpdate)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('ID Not Found');
      })
    });
    test('should respond with a 400 when provided an incorrect dataset', () => {
      const incompleteReview = {
        review_id: 8,
        review_body: 'We couldn\'t find the werewolf! But then we found the werewolf! La CHANCE!!!',
        review_img_url: 'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        created_at: '2021-01-18T10:01:41.251Z',
        votes: 5
      }
      return request(app)
      .patch('/api/reviews/4/edit-review')
      .send(incompleteReview)
      .expect(500)
    });
  });

describe('GET /api/users', () => {
    test('should return an object with the key of users and an array of the user objects', () => {
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
            expect(users.length).toBe(4);
        })
    });
  });

describe('POST /api/create-account', () => {
  test('should receive a user object and return the newly created user object', () => {
    const newUser = {
      username: 'BillyBob',
      name: 'Bob',
      avatar_url: 'https://www.giantbomb.com/a/uploads/scale_small/0/9493/2498107-cletus.gif',
      email: 'bob@gmail.com',
      password: 'apassword'
    }
    return request(app)
    .post("/api/create-account")
    .send(newUser)
    .expect(201)
    .then(({ body }) => {
      const expectedUser = {
        username: 'BillyBob',
        name: 'Bob',
        avatar_url: 'https://www.giantbomb.com/a/uploads/scale_small/0/9493/2498107-cletus.gif',
        email: 'bob@gmail.com',
        password: expect.any(String)
      }
    expect(body).toEqual(expect.objectContaining(expectedUser))
    })
  });
  test('should return a 400 when provided an incomplete dataset', () => {
    const incompleteUser = {
      username: "blah",
      name: '',
      avatar_url: ''
    }
    return request(app)
    .post('/api/create-account')
    .send(incompleteUser)
    .expect(400)
    .then(({ res }) => {
      expect(res.statusMessage).toBe("Bad Request");
    })
  });
  });

describe('DELETE /api/comments/:comment_id', () => {
  test('should delete a comment by comment_id', () => {
    return request(app)
    .delete('/api/comments/6')
    .expect(204)
  });
  test('should return a 404 when provided a non-existent ID', () => {
    return request(app)
    .delete('/api/comments/1000')
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("ID Not Found");
    })
  });
  test('should return an error when provided at invalid comment id', () => {
        return request(app)
    .delete('/api/comments/banana')
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad Request");
    })
    })
  });

describe('GET /api/users/:username', () => {
    test('should return a user object based upon the specified username', () => {
      return request(app)
      .get("/api/users/mallionaire")
      .expect(200)
      .then(({ body }) => {
        const { user } = body
        const expected = {
          username: "mallionaire",
          name: "haz",
          avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
        }
      expect(user).toEqual(expect.objectContaining(expected));
      })
    });
    test('should return a 404 when passed a username which does not exist', () => {
      return request(app)
      .get("/api/users/bananaMan360")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('User Does Not Exist');
      })
    });
  });

describe('GET /api', () => {
    test('should return a JSON describing all the available endpoints', () => {
      return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body["GET /api"]).toEqual({
          description: 'serves up a json representation of all the available endpoints of the api'
        });
      })
    });
  });

describe('PATCH /api/comments/:comment_id', () => {
    test('should accept a positive number and update the votes property according to the number returning the updated comment', () => {
      const votes = {inc_votes: 5}
      const expected = {
        comment_id: 1,
        body: 'I loved this game too!',
        review_id: 2,
        author: 'bainesface',
        created_at: '2017-11-22T12:43:33.389Z',
        votes: 21
      }
      return request(app)
      .patch('/api/comments/1')
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({comment: {
          ...expected
        }})
      })
    });
    test('should accept a negative number and update the votes property according to the number returning the updated comment', () => {
      const votes = {inc_votes: -10}
      const expected = {
        comment_id: 1,
        body: 'I loved this game too!',
        review_id: 2,
        author: 'bainesface',
        created_at: '2017-11-22T12:43:33.389Z',
        votes: 6
      }
      return request(app)
      .patch('/api/comments/1')
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({comment: {
          ...expected
        }})
      })
    })
    test('should respond with a 400 when provided with an comment id', () => {
      const votes = {inc_votes: 10}
      return request(app)
      .patch('/api/comments/banana')
      .send(votes)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      })
      })
      test('should respond with a 404 when id not found', () => {
        const votes = {inc_votes: 10}
        return request(app)
        .patch('/api/comments/1000')
        .send(votes)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('ID Not Found');
        })
      });
      test('should respond with a 400 when provided an incorrect dataset', () => {
        const votes = {inc_votes: ''}
        return request(app)
        .patch('/api/comments/4')
        .send(votes)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        })
      });
  });

describe('POST /api/reviews', () => {
    const newReview = {
      title: 'Catan',
      owner: 'mallionaire',
      review_body: 'It is like Risk for pacifists',
      designer: 'Klaus Teuber',
      category: 'euro game',
      review_img_url: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg'
    }
    test('should add a review to the database and respond with the newly created review', () => {
      return request(app)
      .post("/api/reviews")
      .send(newReview)
      .expect(201)
      .then(({ body }) => {
        const { review } = body;
        const expectedReview = {
          review_id: 14,
          owner: 'mallionaire',
          title: 'Catan',
          review_body: 'It is like Risk for pacifists',
          designer: 'Klaus Teuber',
          category: 'euro game',
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
          review_img_url: expect.any(String)
        }
        expect(review).toEqual(expect.objectContaining(expectedReview));
      })
    });
    test('should return a 400 when provided an incomplete dataset', () => {
      const incompleteReview = {
        title: 'Catan',
        owner: 'mallionaire',
        review_body: 'It is like Risk for pacifists',
        designer: '',
        category: '',
        review_img_url: ''
      }
      return request(app)
      .post("/api/reviews")
      .send(incompleteReview)
      .expect(400)
      .then(({  body: { msg }}) => {
        expect(msg).toBe("Invalid Values");
      })
    });
  });

describe('DELETE /api/reviews/:review_id', () => {
      test('should delete a review by review_id', () => {
        return request(app)
        .delete('/api/reviews/6')
        .expect(204)
      });
      test('should return a 404 when provided a non-existent ID', () => {
        return request(app)
        .delete('/api/reviews/1000')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("ID Not Found");
        })
      });
      test('should return an error when provided at invalid comment id', () => {
            return request(app)
        .delete('/api/reviews/banana')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        })
        })
  });

describe('POST /api/login', () => {
  const userCreds = {
    username: "mallionaire",
    password: 'apassword'
  }
  const invalidCreds = {
    username: "mallionaire",
    password: 'anincorrectpassword'
  }
  test('should take a username and password, check if it matches the database, and return username plus a jsonwebtoken', () => {
      return request(app)
      .post('/api/login')
      .send(userCreds)
      .expect(201)
      .then(({ body }) => {
        const { user } = body;
        const expectedUser = {
          username: "mallionaire",
          name: 'haz',
          avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
          email: 'haz@gmail.com',
          token: expect.any(String)
        }
        expect(user).toEqual(expect.objectContaining(expectedUser));
      })
  });
  test('should return a 401 unauthorized if credentials incorrect', () => {
    return request(app)
    .post('/api/login')
    .send(invalidCreds)
    .expect(401)
    .then(({  body: { msg }}) => {
      expect(msg).toBe("Unauthorized");
    })
  });
});
