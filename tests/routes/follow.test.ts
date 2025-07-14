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

  // Follow feature
  it('should allow user A to follow userB', async () => {
    const res = await request(app)
      .post(`/api/v1/follows/${1}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Followed successfully')
  })

  it('should not allow user A to follow himself', async () => {
    const res = await request(app)
      .post(`/api/v1/follows/${2}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('You cannot follow yourself')
  })

  it('should allow user A to unfollow userB', async () => {
    const res = await request(app)
      .delete(`/api/v1/follows/${1}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Unfollowed successfully')
  })
  it('should not allow duplicate follow', async () => {
    await request(app).post(`/api/v1/follows/${1}`).set('Authorization', `Bearer ${adminToken}`)

    const res = await request(app)
      .post(`/api/v1/follows/${1}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Already following this user')
  })

  it('should show list of followers', async () => {
    const res = await request(app)
      .get(`/api/v1/follows/${1}/followers`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('operation successfully')
  })
  it('should show list of following', async () => {
    const res = await request(app)
      .get(`/api/v1/follows/${1}/following`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('operation successfully')
  })
})
