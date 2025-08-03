import request from 'supertest'

import app from '../../app'

describe('users Routes', () => {
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

  it('should update profile bio', async () => {
    const res = await request(app)
      .patch('/api/v1/users/me')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ bio: 'Node.js Developer' })

    expect(res.status).toBe(200)
    expect(res.body.data.bio).toBe('Node.js Developer')
  })

  it('non-admin is not allowed to see list of users', async () => {
    const res = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${userToken}`)

    expect(res.status).toBe(403)
  })

  it('admin is allowed to see list of users', async () => {
    const res = await request(app).get('/api/v1/users').set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(200)
  })
})
