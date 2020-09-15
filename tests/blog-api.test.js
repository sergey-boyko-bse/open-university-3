const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
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
        const newBlog = { title: 'title 99', author: 'author 99', url: 'http://url99.com', likes: 99 }
      
        await api
            .post('/api/blogs')
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
        const newBlog = { title: 'title 99', author: 'author 99', url: 'http://url99.com', likes: undefined }
      
        await api
            .post('/api/blogs')
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
        const newBlog = { author: 'author 99', likes: 99 }
        await api
            .post('/api/blogs')
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
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
    
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
    
        const blogsAtEnd = await helper.blogsInDb()
    
        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length - 1
        )
    
        const titles = blogsAtEnd.map(x => x.title)
    
        expect(titles).not.toContain(blogToDelete.title)
    })
})

afterAll(() => {
    mongoose.connection.close()
})