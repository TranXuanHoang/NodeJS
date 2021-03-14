import request from 'supertest'
import { app } from '../../app'

it('fails when an email hat does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400)
})

it('fails when incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)

  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'wrong password'
    })
    .expect(400)
})

it('returns a 200 with a cookie on successful signin', async () => {
  const credential = {
    email: 'test@test.com',
    password: 'password'
  }

  await request(app)
    .post('/api/users/signup')
    .send(credential)
    .expect(201)

  const response = await request(app)
    .post('/api/users/signin')
    .send(credential)
    .expect(200)

  expect(response.get('Set-Cookie')).toBeDefined()
})
