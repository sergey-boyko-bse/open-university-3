const _ = require('lodash')

const dummy = (blogs) =>  {
    return blogs ? 1 : 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((totalLikes, blog) => totalLikes + (blog.likes || 0), 0)
}

const favoriteBlog = (blogs) => {
    const max = Math.max(...blogs.map(x => x.likes || 0))
    return blogs.find(x => x.likes === max)
}

const mostBlogs = (blogs) => {
    const groups = _.chain(blogs).groupBy('author').map((value, key) => ({ author: key, blogs: value })).value()
    const max = Math.max(...groups.map(x => x.blogs.length))
    const group = groups.find(x => x.blogs.length === max)
    
    if(!group) {
        return undefined
    }

    return {
        author: group.author,
        blogs: group.blogs.length
    }
}

const mostLikes = (blogs) => {
    const groups = _.chain(blogs).groupBy('author').map((value, key) => ({ author: key, details: value || [] })).value().map(x => { return { author: x.author, likes: x.details.reduce((total, details) => total + (details.likes || 0), 0) }})
    const max = Math.max(...groups.map(x => x.likes))
    const group = groups.find(x => x.likes === max)
    
    if(!group) {
        return undefined
    }

    return {
        author: group.author,
        likes: group.likes
    }
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}