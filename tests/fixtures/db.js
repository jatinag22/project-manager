const User = require('../../src/models/user')
const Project = require('../../src/models/project')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    username: 'user1',
    password: '56what!!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Mike2',
    email: 'mike2@example.com',
    username: 'user2',
    password: 'newpass@#@$34!!',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const projectOne = {
    _id: new mongoose.Types.ObjectId(),
    title: 'project one title',
    description: 'project one description',
    due: '21 July 2020',
    owner: userOne._id,
    members: [userOne._id]
}

const projectTwo = {
    _id: new mongoose.Types.ObjectId(),
    title: 'project two title',
    description: 'project two description',
    due: '22 July 2020',
    owner: userTwo._id,
    members: [userTwo._id]
}

const projectThree = {
    _id: new mongoose.Types.ObjectId(),
    title: 'project 3 title',
    description: 'project 3 description',
    due: '23 July 2020',
    owner: userOne._id,
    members: [userOne._id]
}

const setupDB = async () => {
    await User.deleteMany()
    await Project.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Project(projectOne).save()
    await new Project(projectTwo).save()
    await new Project(projectThree).save()
}

module.exports = {userOneId, userOne, userTwoId, userTwo, projectOne, projectTwo, projectThree, setupDB}