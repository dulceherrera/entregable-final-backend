require("../models")

const request = require('supertest')
const app = require('../app')
const Product = require('../models/Product')

const BASE_URL = '/api/v1/purchase'

let TOKEN
let userId
let productBody
let product
let bodyCart

beforeAll(async () => {
  const user = {
    email: "gabriela@gmail.com",
    password: "gaby123"
  }

  const res = await request(app)
    .post('/api/v1/users/login')
    .send(user)

  TOKEN = res.body.token
  userId = res.body.user.id

  productBody = {
    title: "MacBook Pro",
    description: "macbook description",
    price: 2000
  }

  product = await Product.create(productBody)

  bodyCart = {
    quantity: 2,
    productId: product.id
  }

  await request(app)
    .post('/api/v1/cart')
    .send(bodyCart)
    .set('Authorization', `Bearer ${TOKEN}`)
})


test("POST -> BASE_URL, should return statusCode 201 and res.body.quantity === bodyCart.quantity", async () => {
  const res = await request(app)
    .post(BASE_URL)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.status).toBe(201)
  expect(res.body[0].quantity).toBe(bodyCart.quantity)
})

test("GET -> BASE_URL, should return statusCode 200, and res.body.length === 1", async () => {
  const res = await request(app)
    .get(BASE_URL)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body).toHaveLength(1)

  expect(res.body[0].userId).toBeDefined()
  expect(res.body[0].userId).toBe(userId)

  expect(res.body[0].product).toBeDefined()
  expect(res.body[0].product.id).toBe(product.id)

  await product.destroy()
})
