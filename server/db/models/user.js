'use strict'

const bcrypt = require('bcryptjs')
const Sequelize = require('sequelize')
const db = require('APP/db')

const User = db.define('users', {
  name: Sequelize.STRING,  
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true,
      notEmpty: true,
    }
  },

  password_digest: Sequelize.STRING,
  password: Sequelize.VIRTUAL,
  isAdmin: Sequelize.BOOLEAN 
}, {
  indexes: [{fields: ['email'], unique: true,}],
  hooks: {
    beforeCreate: setEmailAndPassword,
    beforeUpdate: setEmailAndPassword,
  },
  instanceMethods: {
    authenticate(plaintext) {
      return new Promise((resolve, reject) =>
        bcrypt.compare(plaintext, this.password_digest,
          (err, result) =>
            err ? reject(err) : resolve(result))
        )
    }    
  }
})

function setEmailAndPassword(user) {
  user.email = user.email && user.email.toLowerCase()
  if (!user.password) return Promise.resolve(user)

  return new Promise((resolve, reject) =>
    bcrypt.hash(user.get('password'), 10, (err, hash) => {
      if (err) reject(err)
      user.set('password_digest', hash)
      resolve(user)
    })
  )
}

module.exports = User