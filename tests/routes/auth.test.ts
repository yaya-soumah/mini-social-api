import request from 'supertest'
import app from '../../src/app.js' // Export your Express app from this file

describe('Auth Routes', () => {
  let userToken = ''
  let adminToken = ''

  beforeAll(async () => {
    const userReponse = await request(app).post('/api/v1/auth/register').send({
      username: 'username',
      email: 'username@example.com',
      password: 'password123',
    })
    userToken = userReponse.body.data?.token
    const adminResponse = await request(app).post('/api/v1/auth/register/admin').send({
      username: 'adminname',
      email: 'adminname@example.com',
      password: 'password123',
    })
    adminToken = adminResponse.body.data?.token
  })
  // register
  it('should register a user', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      username: 'register User',
      email: 'register@example.com',
      password: 'password123',
    })

    expect(res.status).toBe(201)
    expect(res.body.data).toHaveProperty('user')
  })

  it('should fail with duplicate email', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      username: 'register User',
      email: 'register@example.com',
      password: 'password123',
    })

    expect(res.status).toBe(400)
  })

  it('Should fail with duplicate username', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      username: 'register User',
      email: 'another@example.com',
      password: 'password123',
    })

    expect(res.status).toBe(400)
  })
  it('Should fail with missing username', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'another@example.com',
      password: 'password123',
    })

    expect(res.status).toBe(400)
  })
  // login
  it('should login a user', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'username@example.com',
      password: 'password123',
    })

    expect(res.status).toBe(200)
    expect(res.body.data.token).toBeDefined()
  })
  it('should reject invalid password', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'test@example.com',
      password: 'wrongpassword',
    })

    expect(res.status).toBe(400)
  })
})
