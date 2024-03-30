const request = require('supertest');
const app = require('../server');

describe('Test CRUD operations for books API', () => {
  let isbn;

  test('Create a new book', async () => {
    const res = await request(app)
      .post('/books')
      .send({
        title: 'Sample Book',
        author: 'John Doe',
        description: 'A sample book for testing',
        publicationYear: 2024,
        isbn: '1234567890'
      });
    expect(res.statusCode).toBe(201);
    isbn = res.body.isbn;
  });

  test('Get created book', async () => {
    const res = await request(app).get(`/books/${isbn}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Sample Book');
  });

  test('Update created book', async () => {
    const res = await request(app)
      .put(`/books/${isbn}`)
      .send({
        title: 'Updated Sample Book',
        author: 'Jane Doe',
        description: 'An updated sample book for testing',
        publicationYear: 2025
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Sample Book');
    expect(res.body.author).toBe('Jane Doe');
  });

  test('Delete created book', async () => {
    const res = await request(app).delete(`/books/${isbn}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Book deleted successfully');
  });

  test('Get non-existent book', async () => {
    const res = await request(app).get('/books/nonexistentisbn');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Book not found');
  });
});