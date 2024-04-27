const User = require('../models/User')

const userCreate = async () => {

  const user = {
    firstName: "Gabriela",
    lastName: "Fernandez",
    email: "gabriela@gmail.com",
    password: "gaby123",
    phone: "12345"
  }
  await User.create(user)
}

module.exports = userCreate
