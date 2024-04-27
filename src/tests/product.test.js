require('../models')

const Category = require('../models/Category')
const request = require('supertest')
const app = require('../app')

const BASE_URL = '/api/v1/products'
let TOKEN
let productId
let category
let product

beforeAll(async () => {
  const user = {
    email: "gabriela@gmail.com",
    password: "gaby123"
  }

  const res = await request(app)
    .post('/api/v1/users/login')
    .send(user)

  TOKEN = res.body.token

  category = await Category.create({name: "Tech"})
})

test("POST -> BASE_URL, should return statusCode 201, and res.body.title === product.title", async() => {
  product = {
    title: "MacBook",
    description: "Made with better materials",
    price: 1599,
    categoryId: category.id
  }

  const res = await request(app)
    .post(BASE_URL)
    .send(product)
    .set('Authorization', `Bearer ${TOKEN}`)

  productId = res.body.id

  expect(res.status).toBe(201)
  expect(res.body).toBeDefined()
  expect(res.body.title).toBe(product.title)
})

test("GET -> BASE_URL, should return statusCode 200", async() => {
  const res = await request(app)
    .get(BASE_URL)

  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body).toHaveLength(1)
})

test("GET -> BASE_URL/:id, should return statusCode 200, and res.body.length === 1", async() => {
  const res = await request(app)
    .get(`${BASE_URL}/${productId}`)

  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.title).toBe(product.title)

})

test("PUT -> BASE_URL/:id, should return statusCode 200, and res.body.title === bodyUpdate.title", async() => {
  const bodyUpdate = {
    title: "Macbook Pro"
  }

  const res = await request(app)
    .put(`${BASE_URL}/${productId}`)
    .send(bodyUpdate)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body.title).toBe(bodyUpdate.title)
})

test("DELETE -> BASE_URL/:id, should return statusCode 204", async() => {
  const res = await request(app)
    .delete(`${BASE_URL}/${productId}`)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.status).toBe(204)

await category.destroy()
})
