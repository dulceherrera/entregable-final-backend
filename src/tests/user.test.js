const request = require("supertest")
const app = require("../app")
const BASE_URL= '/api/v1/users'

let TOKEN
let userId

beforeAll(async() => {
  const user ={
    email: "gabriela@gmail.com",
    password: "gaby123"
  }

  const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(user)

  TOKEN = res.body.token
})

test("GET -> BASE_URL, should return statusCode 200, and res.body.length===1", async() => {
  const res = await request(app)
  .get(BASE_URL)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body).toHaveLength(1)
})

test("POST -> BASE_URL, should return statusCode 201, and res.body.firstName === user.firstName", async() => {
  const user = {
    firstName: "Dulce",
    lastName: "Herrera",
    email: "dulceherrera@gmail.com",
    password: "dulce12345",
    phone: "12345"
  }

  const res = await request(app)
    .post(BASE_URL)
    .send(user)

  userId = res.body.id

  expect(res.statusCode).toBe(201)
  expect(res.body).toBeDefined()
  expect(res.body.firstName).toBe(user.firstName)
})

test("PUT -> BASE_URL/:id, should return statusCode 200, res.body.lastName === bodyUpdate.lastName", async() => {
  const bodyUpdate = {
    lastName: "Carmona"
  }

  const res = await request(app)
    .put(`${BASE_URL}/${userId}`)
    .send(bodyUpdate)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.lastName).toBe(bodyUpdate.lastName)
})

test("POST -> BASE_URL/login, should return statusCode 200 res.body.user.email === user.email and res.body.token to be defined", async() => {
  const user = {
    email: "dulceherrera@gmail.com",
    password: "dulce12345"
  }

  const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(user)

  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.user.email).toBe(user.email)
  expect(res.body.token).toBeDefined()
})

test("POST -> BASE_URL/login, should return statusCode 401", async() => {
  const invalidUser = {
    email: "dulceherrera@gmail.com",
    password: "dulce12345233"
  }

  const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(invalidUser)

  expect(res.statusCode).toBe(401)
})

test("DELETE -> BASE_URL/:id, should return statusCode 204", async() => {
  const res = await request(app)
    .delete(`${BASE_URL}/${userId}`)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.statusCode).toBe(204)
})
