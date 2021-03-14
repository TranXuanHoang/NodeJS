import request from 'supertest'
import { app } from '../../app'

it('responds with details about the current user', async () => {
  const credential = {
    email: 'test@test.com',
    password: 'password'
  }

  const cookie = await global.signup(credential)

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200)

  expect(response.body.currentUser.email).toEqual(credential.email)
})

it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200)

  expect(response.body.currentUser).toEqual(null)
})
