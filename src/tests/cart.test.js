require('../models')

const request = require('supertest')
const app = require('../app')
const Product = require('../models/Product')

let TOKEN
const BASE_URL = '/api/v1/cart'
let userId
let product
let cartId
let newCart
let productBody

beforeAll(async() => {
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
})


test("POST -> BASE_URL, should return statusCode 201, and res.body.quantity === newCart.quantity", async() => {


  const newCart = {
    quantity: 3,
    productId: product.id
  }

  const res = await request(app)
    .post(BASE_URL)
    .send(newCart)
    .set('Authorization', `Bearer ${TOKEN}`)

  cartId = res.body.id

  product.destroy()

  expect(res.status).toBe(201)
  expect(res.body.id).toBeDefined()
  expect(res.body.quantity).toBe(newCart.quantity)
})

test("GET -> BASE_URL, should return statusCode 200, and res.body.length === 1", async () => {
  const res = await request(app)
    .get(BASE_URL)
    .set('Authorization', `Bearer ${TOKEN}`)

  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body).toHaveLength(1)
})

test("GET -> BASE_URL/:id, should return statusCode 200, and res.body.quantity = newCart.quantity", async () => {
  const res = await request(app)
    .get(`${BASE_URL}/${cartId}`)
    .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.quantity).toBe(newCart.quantity)
})

test("PUT -> BASE_URL/:id, should return statusCode 200, and res.body.quantity === bodyUpdate.quantity", async () => {
  const bodyUpdate = { quantity: 6 }

  const res = await request(app)
    .put(`${BASE_URL}/${cartId}`)
    .send(bodyUpdate)
    .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.quantity).toBe(bodyUpdate.quantity)
})

test("DELETE -> BASE_URL/:id, should return statusCode 204", async () => {
  const res = await request(app)
    .delete(`${BASE_URL}/${cartId}`)
    .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(204)

    await product.destroy()
})
