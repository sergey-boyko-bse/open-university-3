const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()

    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs.map(blog => new Blog({...blog, user: user._id}))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('getting blogs', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')  
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
    
    test('all blogs have id property', async () => {
        const response = await api.get('/api/blogs')
        for(let blog of response.body) {
            expect(blog.id).toBeDefined()
        }    
    })
})

describe('addition of a blog', () => {
    test('a new blog can be added', async () => {
        const token = await helper.getFirstUserToken()
        const newBlog = { title: 'title 99', author: 'author 99', url: 'http://url99.com', likes: 99 }
        
        await api
            .post('/api/blogs')
            .set('authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
      
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
      
        const titles = blogsAtEnd.map(n => n.title)
        expect(titles).toContain(
            'title 99'
        )
    })
    
    test('likes default value is 0', async () => {
        const token = await helper.getFirstUserToken()
        const newBlog = { title: 'title 99', author: 'author 99', url: 'http://url99.com', likes: undefined }
      
        await api
            .post('/api/blogs')
            .set('authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
      
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        const likes = blogsAtEnd.map(n => n.likes)
        for(let like of likes) {
            expect(like).toBeDefined()
        }
        expect(likes).toContain(0)
    })
    
    test('returns 400 BadRequest when a new blog is added without title or url', async () => {
        const token = await helper.getFirstUserToken()
        const newBlog = { author: 'author 99', likes: 99 }
        await api
            .post('/api/blogs')
            .set('authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(400)
    })
})

describe('updating of a blog', () => {
    test('an existing blog can be updated', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const newBlog = { title: `${blogToUpdate.title} UPD`, author: `${blogToUpdate.author} UPD`, url: `${blogToUpdate.url} UPD`, likes: blogToUpdate.likes + 100 }
      
        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
      
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
      
        const updatedBlog = blogsAtEnd.find(x => x.id === blogToUpdate.id)
        expect(updatedBlog.title).toBe(newBlog.title)
        expect(updatedBlog.author).toBe(newBlog.author)
        expect(updatedBlog.url).toBe(newBlog.url)
        expect(updatedBlog.likes).toBe(newBlog.likes)
    })
})

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const token = await helper.getFirstUserToken()
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
    
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('authorization', `bearer ${token}`)
            .expect(204)
    
        const blogsAtEnd = await helper.blogsInDb()
    
        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length - 1
        )
    
        const titles = blogsAtEnd.map(x => x.title)
    
        expect(titles).not.toContain(blogToDelete.title)
    })
})

describe('when there is initially one user in db', () => {  
    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
            username: 'serhii',
            name: 'Serhii Boiko',
            password: 'boiko',
        }
    
        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    
        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails without username', async () => {
        const newUser = { name: 'invalid user', password: '12345' }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect({ 'error': 'Both username and password must be given. Both username and password must be at least 3 characters long.' })
    })

    test('creation fails without password', async () => {
        const newUser = { name: 'invalid user', username: 'invalid_user' }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect({ 'error': 'Both username and password must be given. Both username and password must be at least 3 characters long.' })
    })

    test('creation fails with invalid short username', async () => {
        const newUser = { name: 'invalid user', username: 'ab', password: '12345' }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect({ 'error': 'Both username and password must be given. Both username and password must be at least 3 characters long.' })
    })

    test('creation fails with invalid short password', async () => {
        const newUser = { name: 'invalid user', username: 'invalid_user', password: '12' }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect({ 'error': 'Both username and password must be given. Both username and password must be at least 3 characters long.' })
    })

    test('creation fails with invalid non-unique username', async () => {
        const newUser = { name: 'invalid user', username: 'root', password: '12345' }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect({ 'error': 'User validation failed: username: Error, expected `username` to be unique. Value: `root`' })
    })
})

afterAll(() => {
    mongoose.connection.close()
})