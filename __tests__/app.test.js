const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const { string } = require("pg-format");

afterAll(() => {
  if (db.end) db.end();
});