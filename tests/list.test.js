const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('totalLikes', () => {
    test('returns 0 for empty array', () => {
        const blogs = []

        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(0)
    })

    test('returns correct value for array with one element if likes are set', () => {
        const blogs = [
            { _id: '5a422aa71b54a676234d17f8', title: 'title 1', author: 'author 1', url: 'http://url1.com', likes: 10, __v: 0 }
        ]

        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(10)
    })

    test('returns correct value for array with multiple elements if likes are set', () => {
        const blogs = [
            { _id: '5a422aa71b54a676234d17f8', title: 'title 1', author: 'author 1', url: 'http://url1.com', likes: 10, __v: 0 }, 
            { _id: '5a422aa71b54a676234d17f9', title: 'title 2', author: 'author 2', url: 'http://url2.com', likes: 5, __v: 0}
        ]

        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(15)
    })

    test('returns correct value for array with one element if likes are not set', () => {
        const blogs = [
            { _id: '5a422aa71b54a676234d17f8', title: 'title 1', author: 'author 1', url: 'http://url1.com', likes: undefined, __v: 0 }
        ]

        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(0)
    })

    test('returns correct value for array with multiple elements if likes are not set', () => {
        const blogs = [
            { _id: '5a422aa71b54a676234d17f8', title: 'title 1', author: 'author 1', url: 'http://url1.com', likes: 10, __v: 0 }, 
            { _id: '5a422aa71b54a676234d17f9', title: 'title 2', author: 'author 2', url: 'http://url2.com', likes: undefined, __v: 0 }, 
            { _id: '5a422aa71b54a676234d17f0', title: 'title 3', author: 'author 3', url: 'http://url3.com', likes: 5, __v: 0 }
        ]

        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(15)
    })
})

describe('favoriteBlog', () => {
    test('returns undefined for empty blog array', () => {
        const blogs = []
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual(undefined)
    })

    test('returns first element for array with one element', () => {
        const blogs = [
            { _id: '5a422aa71b54a676234d17f8', title: 'title 1', author: 'author 1', url: 'http://url1.com', likes: 10, __v: 0 }
        ]
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual(blogs[0])
    })

    test('returns first element for array with multiple elements having same likes', () => {
        const blogs = [
            { _id: '5a422aa71b54a676234d17f8', title: 'title 1', author: 'author 1', url: 'http://url1.com', likes: 10, __v: 0 }, 
            { _id: '5a422aa71b54a676234d17f9', title: 'title 2', author: 'author 2', url: 'http://url2.com', likes: 10, __v: 0 }, 
            { _id: '5a422aa71b54a676234d17f0', title: 'title 3', author: 'author 3', url: 'http://url3.com', likes: 10, __v: 0 }
        ]
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual(blogs[0])
    })

    test('returns correct element for array with multiple elements', () => {
        const blogs = [
            { _id: '5a422aa71b54a676234d17f8', title: 'title 1', author: 'author 1', url: 'http://url1.com', likes: 10, __v: 0 }, 
            { _id: '5a422aa71b54a676234d17f9', title: 'title 2', author: 'author 2', url: 'http://url2.com', likes: 15, __v: 0 }, 
            { _id: '5a422aa71b54a676234d17f0', title: 'title 3', author: 'author 3', url: 'http://url3.com', likes: 10, __v: 0 }
        ]
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual(blogs[1])
    })
})

describe('mostBlogs', () => {
    test('returns undefined for empty array', () => {
        const blogs = []
        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual(undefined)
    })

    test('returns correct result for array with one element', () => {
        const blogs = [
            { _id: '5a422aa71b54a676234d17f8', title: 'title 1', author: 'author 1', url: 'http://url1.com', likes: 10, __v: 0 }
        ]
        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual({
            author: 'author 1',
            blogs: 1
        })
    })

    test('returns correct result for array with one author and multiple elements', () => {
        const blogs = [
            { _id: '5a422aa71b54a676234d17f8', title: 'title 1', author: 'author 1', url: 'http://url1.com', likes: 10, __v: 0 }, 
            { _id: '5a422aa71b54a676234d17f9', title: 'title 2', author: 'author 1', url: 'http://url2.com', likes: undefined, __v: 0 }, 
            { _id: '5a422aa71b54a676234d17f0', title: 'title 3', author: 'author 1', url: 'http://url3.com', likes: 5, __v: 0 }
        ]
        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual({
            author: 'author 1',
            blogs: 3
        })
    })

    test('returns correct result for array with multiple authors', () => {
        const blogs = [
            { _id: '5a422aa71b54a676234d17f8', title: 'title 1', author: 'author 1', url: 'http://url1.com', likes: 10, __v: 0 }, 
            { _id: '5a422aa71b54a676234d17f9', title: 'title 2', author: 'author 2', url: 'http://url2.com', likes: undefined, __v: 0 }, 
            { _id: '5a422aa71b54a676234d17f0', title: 'title 3', author: 'author 2', url: 'http://url3.com', likes: 5, __v: 0 }
        ]
        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual({
            author: 'author 2',
            blogs: 2
        })
    })
})

describe('mostLikes', () => {
    test('returns undefined for empty array', () => {
        const blogs = []
        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual(undefined)
    })

    test('returns correct result for array with one element', () => {
        const blogs = [
            { _id: '5a422aa71b54a676234d17f8', title: 'title 1', author: 'author 1', url: 'http://url1.com', likes: 10, __v: 0 }
        ]
        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual({
            author: 'author 1',
            likes: 10
        })
    })

    test('returns correct result for array with one author and multiple elements', () => {
        const blogs = [
            { _id: '5a422aa71b54a676234d17f8', title: 'title 1', author: 'author 1', url: 'http://url1.com', likes: 10, __v: 0 }, 
            { _id: '5a422aa71b54a676234d17f9', title: 'title 2', author: 'author 1', url: 'http://url2.com', likes: undefined, __v: 0 }, 
            { _id: '5a422aa71b54a676234d17f0', title: 'title 3', author: 'author 1', url: 'http://url3.com', likes: 5, __v: 0 }
        ]
        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual({
            author: 'author 1',
            likes: 15
        })
    })

    test('returns correct result for array with multiple authors', () => {
        const blogs = [
            { _id: '5a422aa71b54a676234d17f8', title: 'title 1', author: 'author 1', url: 'http://url1.com', likes: 10, __v: 0 }, 
            { _id: '5a422aa71b54a676234d17f9', title: 'title 2', author: 'author 2', url: 'http://url2.com', likes: 15, __v: 0 }, 
            { _id: '5a422aa71b54a676234d17f0', title: 'title 3', author: 'author 2', url: 'http://url3.com', likes: 5, __v: 0 }
        ]
        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual({
            author: 'author 2',
            likes: 20
        })
    })
})