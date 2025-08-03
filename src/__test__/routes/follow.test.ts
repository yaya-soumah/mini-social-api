import request from 'supertest'

import app from '../../app'
describe('Follow API', () => {
  let adminToken = ''

  beforeAll(async () => {
    const adminResponse = await request(app).post('/api/v1/auth/register/admin').send({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
    })
    adminToken = adminResponse.body.data?.token
  })

  describe('Post /follows/:userId', () => {
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

    it('should not allow duplicate follow', async () => {
      await request(app).post(`/api/v1/follows/${1}`).set('Authorization', `Bearer ${adminToken}`)

      const res = await request(app)
        .post(`/api/v1/follows/${1}`)
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('Already following this user')
    })
  })

  describe('Delete /follows/:userId', () => {
    it('should allow user A to unfollow userB', async () => {
      const res = await request(app)
        .delete(`/api/v1/follows/${1}`)
        .set('Authorization', `Bearer ${adminToken}`)
      expect(res.status).toBe(200)
      expect(res.body.message).toBe('Unfollowed successfully')
    })
  })

  describe('GET /follows/:userId', () => {
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
})
