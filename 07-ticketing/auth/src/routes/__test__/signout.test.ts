import request from 'supertest'
import { app } from '../../app'

it('clears the cookie after signing out', async () => {
  const credential = {
    email: 'test@test.com',
    password: 'password'
  }

  await request(app)
    .post('/api/users/signup')
    .send(credential)
    .expect(201)

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200)

  expect(response.get('Set-Cookie'))
    .toContain('express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly')
})
