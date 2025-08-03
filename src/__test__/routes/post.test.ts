import request from 'supertest'

import app from '../../app'

describe('posts Routes', () => {
  let userToken = ''

  beforeAll(async () => {
    const userReponse = await request(app).post('/api/v1/auth/register').send({
      username: 'username',
      email: 'username@example.com',
      password: 'password123',
    })
    userToken = userReponse.body.data.token
  })
  it('should create a new post', async () => {
    const res = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        content: 'test1',
      })

    expect(res.status).toBe(201)
    expect(res.body.data.content).toBe('test1')
  })
  it('should reject authorized user', async () => {
    const res = await request(app).post('/api/v1/posts').send({
      content: 'no token',
    })

    expect(res.status).toBe(401)
  })

  it('should return a post', async () => {
    const res = await request(app)
      .get('/api/v1/posts/1')
      .set('Authorization', `Bearer ${userToken}`)

    expect(res.status).toBe(200)
  })

  it('should not allow unauthenticated access', async () => {
    const res = await request(app).get('/api/v1/posts/1')

    expect(res.status).toBe(401)
  })
  it('should get list of posts of a user', async () => {
    const res = await request(app).get('/api/v1/posts').set('Authorization', `Bearer ${userToken}`)

    expect(res.status).toBe(200)
  })
  it('should update a post', async () => {
    const res = await request(app)
      .patch('/api/v1/posts/1')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        content: 'updated test1',
      })

    expect(res.status).toBe(200)
    expect(res.body.data.content).toBe('updated test1')
  })

  it('should allow only owner of a post to update a post', async () => {
    const userReponse = await request(app).post('/api/v1/auth/register').send({
      username: 'unkown',
      email: 'unknown@example.com',
      password: 'password123',
    })
    const res = await request(app)
      .patch('/api/v1/posts/1')
      .set('Authorization', `Bearer ${userReponse.body.token}`)
      .send({
        content: 'updated test1',
      })

    expect(res.status).toBe(403)
  })

  it('should delete a post', async () => {
    const res = await request(app)
      .delete('/api/v1/posts/1')
      .set('Authorization', `Bearer ${userToken}`)

    expect(res.status).toBe(204)
  })

  it('should allow only owner of a post to delete a post', async () => {
    const userReponse = await request(app).post('/api/v1/auth/register').send({
      username: 'unkown',
      email: 'unknown@example.com',
      password: 'password123',
    })

    // create a post to delete
    await request(app).post('/api/v1/posts').set('Authorization', `Bearer ${userToken}`).send({
      content: 'new post',
    })

    const res = await request(app)
      .delete('/api/v1/posts/1')
      .set('Authorization', `Bearer ${userReponse.body.token}`)

    expect(res.status).toBe(403)
  })
})
