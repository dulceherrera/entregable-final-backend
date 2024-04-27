const request = require('supertest')
const app = require('../app')
const Product = require('../models/Product')
const Category = require('../models/Category')
require('../models')

let TOKEN
const BASE_URL = '/api/v1/cart'
let category

beforeAll(async() => {
  const user = {
    email: "gabriela@gmail.com",
    password: "gaby123"
  }

  const res = await request(app)
    .post('/api/v1/users/login')
    .send(user)

  TOKEN = res.body.token
  category = await Category.create({ name: "Tech" })
})

test("GET -> BASE_URL, should return statusCode 200", async() => {
  const res = await request(app)
    .get(BASE_URL)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body).toBeInstanceOf(Array)
})

test("POST -> BASE_URL, should return statusCode 201, and res.body.quantity === newCart.quantity", async() => {
  const product = await Product.create({
    title: "iPhone",
    description: "Smarthphone Apple prueba",
    price: 999,
    categoryId: category.id
  })

  const newCart = {
    quantity: 3,
    productId: product.id
  }

  const res = await request(app)
    .post(BASE_URL)
    .send(newCart)
    .set('Authorization', `Bearer ${TOKEN}`)

  id = res.body.id
  product.destroy()

  expect(res.status).toBe(201)
  expect(res.body.id).toBeDefined()
  expect(res.body.quantity).toBe(newCart.quantity)
})
