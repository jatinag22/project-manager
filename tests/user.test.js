const request = require('supertest')
const { userOneId, userOne, setupDB } = require('./fixtures/db')
const app = require('../src/app')
const User = require('../src/models/user')

beforeEach(setupDB)

test('Should signup a new user', async () => {
    const response = await request(app).post('/api/auth/signup').send({
        name: 'Andrew',
        email: 'andrew@example.com',
        username: 'andrew',
        password: 'MyPass777!'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Andrew',
            email: 'andrew@example.com',
            username: 'andrew'
        }
    })
    expect(user.password).not.toBe('MyPass777!')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/api/auth/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/api/auth/login').send({
        email: userOne.email,
        password: 'thisisnotmypass'
    }).expect(400)
})

test('should not login if user is already logged in', async () => {
    const response = await request(app)
        .post('/api/auth/login').send({
            email: userOne.email,
            password: userOne.password
        })
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.tokens.length).toEqual(1)
})

test('should not signup if user is already logged in', async () => {
    const response = await request(app)
        .post('/api/auth/signup').send({
            name: 'Andrew',
            email: 'andrew@example.com',
            username: 'andrew',
            password: 'MyPass777!'
        })
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.tokens.length).toEqual(1)
})


test('Should get profile for user', async () => {
    await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/api/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/api/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticate user', async () => {
    await request(app)
        .delete('/api/users/me')
        .send()
        .expect(401)
})


test('Should upload avatar image', async () => {
    await request(app)
        .post('/api/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Jess'
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Jess')
})