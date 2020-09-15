const Blog = require('../models/blog')

const initialBlogs = [
    { title: 'title 1', author: 'author 1', url: 'http://url1.com', likes: 10 }, 
    { title: 'title 2', author: 'author 2', url: 'http://url2.com', likes: 2 }, 
    { title: 'title 3', author: 'author 3', url: 'http://url3.com', likes: 5 }, 
    { title: 'title 4', author: 'author 2', url: 'http://url4.com', likes: 33 }, 
    { title: 'title 5', author: 'author 3', url: 'http://url5.com', likes: 11 }
]

const nonExistingId = async () => {
    const blog = new Blog({ title: 'title 1', author: 'author 1', url: 'http://url1.com', likes: 10 })
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
}