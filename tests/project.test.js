const request = require('supertest')
const { userOneId, userOne, userTwoId, userTwo, projectOne, projectTwo, projectThree, setupDB } = require('./fixtures/db')
const app = require('../src/app')
const Project = require('../src/models/project')

beforeEach(setupDB)

test('should create project for user', async () => {
    const response = await request(app)
                        .post('/api/projects')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send({
                            title: 'New Project',
                            description: 'This is my new project',
                            due: '15 July 2020'
                        })
                        .expect(201)
    const project = await Project.findById(response.body._id)
    expect(project).not.toBeNull()
    expect(project.completed).toEqual(false)
    expect(project.owner).toEqual(userOneId)
    expect(project.members[0]).toEqual(userOneId)
})

test('should fetch user projects', async () => {
    const response = await request(app)
                        .get('/api/projects')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send()
                        .expect(200)
    expect(response.body.length).toEqual(2)
})

test('should not delete other users project', async () => {
    const response = await request(app)
        .delete(`/api/projects/${projectTwo._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(404)
    const project = await Project.findById(projectTwo._id)
    expect(project).not.toBeNull()
})
