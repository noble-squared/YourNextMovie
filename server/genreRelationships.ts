//I came up with all these values, but after completely filling out "Animation" I got sick of cross-referencing previous values, and only filled in new ones
// and asked copilot to make them symmetrical afterwards. If that makes sense.
// Basically, I came up with everything and left the tedious (well, *more* tedious) work to AI
const genreRelationships : Map<string, Map<string, number>> = new Map([
    ["Action", new Map([
        ["Action", 1], ["Adventure", .9], ["Animation", .6], ["Comedy", .4], ["Crime", .6], ["Documentary", .1], ["Drama", .3], ["Family", .1],
        ["Fantasy", .4], ["History", 0], ["Horror", 0], ["Music", 0], ["Mystery", .6], ["Romance", .7], ["Science Fiction", .2], ["TV Movie", .5], //ngl i don't know what a TV Movie is
        ["Thriller", .5], ["War", .2], ["Western", .5], 
    ])],
    ["Adventure", new Map([
        ["Action", .9], ["Adventure", 1], ["Animation", .6], ["Comedy", .6], ["Crime", .3], ["Documentary", 0], ["Drama", .4], ["Family", .9],
        ["Fantasy", .7], ["History", 0], ["Horror", 0], ["Music", 0], ["Mystery", .2], ["Romance", .6], ["Science Fiction", .5], ["TV Movie", .5], //ngl i don't know what a TV Movie is
        ["Thriller", .1], ["War", 0], ["Western", .2], 
    ])],
    ["Animation", new Map([
        ["Action", .6], ["Adventure", .6], ["Animation", 1], ["Comedy", .8], ["Crime", 0], ["Documentary", 0], ["Drama", .2], ["Family", .6],
        ["Fantasy", .7], ["History", 0], ["Horror", 0], ["Music", 0], ["Mystery", .3], ["Romance", .7], ["Science Fiction", .6], ["TV Movie", .5], //ngl i don't know what a TV Movie is
        ["Thriller", 0], ["War", 0], ["Western", 0], 
    ])],
    ["Comedy", new Map([
        ["Action", .4], ["Adventure", .6], ["Animation", .8], ["Comedy", 1], ["Crime", .1], ["Documentary", 0], ["Drama", .2], ["Family", .8],
        ["Fantasy", .2], ["History", 0], ["Horror", 0], ["Music", 0], ["Mystery", .3], ["Romance", .8], ["Science Fiction", .2], ["TV Movie", .5], //ngl i don't know what a TV Movie is
        ["Thriller", 0], ["War", 0], ["Western", .1], 
    ])],
    ["Crime", new Map([
        ["Action", .6], ["Adventure", .3], ["Animation", 0], ["Comedy", .1], ["Crime", 1], ["Documentary", .9], ["Drama", .2], ["Family", 0],
        ["Fantasy", 0], ["History", .1], ["Horror", 0], ["Music", 0], ["Mystery", .9], ["Romance", .7], ["Science Fiction", .1], ["TV Movie", .5], //ngl i don't know what a TV Movie is
        ["Thriller", .7], ["War", 0], ["Western", .4], 
    ])],
    ["Documentary", new Map([
        ["Action", .1], ["Adventure", 0], ["Animation", 0], ["Comedy", 0], ["Crime", .9], ["Documentary", 1], ["Drama", .1], ["Family", 0],
        ["Fantasy", 0], ["History", .7], ["Horror", .3], ["Music", .5], ["Mystery", .9], ["Romance", .1], ["Science Fiction", 0], ["TV Movie", .5], //ngl i don't know what a TV Movie is
        ["Thriller", .1], ["War", .5], ["Western", .2], 
    ])],
    ["Drama", new Map([
        ["Action", .3], ["Adventure", .4], ["Animation", .2], ["Comedy", .2], ["Crime", .2], ["Documentary", .1], ["Drama", 1], ["Family", .3],
        ["Fantasy", .3], ["History", .4], ["Horror", 0], ["Music", 0], ["Mystery", .7], ["Romance", .8], ["Science Fiction", .3], ["TV Movie", .5], //ngl i don't know what a TV Movie is
        ["Thriller", .2], ["War", 0], ["Western", .5], 
    ])],
    ["Family", new Map([
        ["Action", .1], ["Adventure", .9], ["Animation", .6], ["Comedy", .8], ["Crime", 0], ["Documentary", 0], ["Drama", .3], ["Family", 1],
        ["Fantasy", .1], ["History", .1], ["Horror", .1], ["Music", .1], ["Mystery", .1], ["Romance", .1], ["Science Fiction", .1], ["TV Movie", .1], //ngl i don't know what a TV Movie is
        ["Thriller", .1], ["War", .1], ["Western", .1], 
    ])],
    ["Fantasy", new Map([
        ["Action", .4], ["Adventure", .7], ["Animation", .7], ["Comedy", .2], ["Crime", 0], ["Documentary", 0], ["Drama", .3], ["Family", .1],
        ["Fantasy", 1], ["History", .4], ["Horror", .4], ["Music", .4], ["Mystery", .3], ["Romance", .4], ["Science Fiction", .4], ["TV Movie", .4], //ngl i don't know what a TV Movie is
        ["Thriller", .4], ["War", .4], ["Western", .4], 
    ])],
    ["History", new Map([
        ["Action", 0], ["Adventure", 0], ["Animation", 0], ["Comedy", 0], ["Crime", .1], ["Documentary", .7], ["Drama", .4], ["Family", 0],
        ["Fantasy", 0], ["History", 1], ["Horror", 0], ["Music", 0], ["Mystery", 0], ["Romance", 0], ["Science Fiction", 0], ["TV Movie", 0], //ngl i don't know what a TV Movie is
        ["Thriller", 0], ["War", 0], ["Western", 0], 
    ])],
    ["Horror", new Map([
        ["Action", 0], ["Adventure", 0], ["Animation", 0], ["Comedy", 0], ["Crime", 0], ["Documentary", .3], ["Drama", 0], ["Family", .1],
        ["Fantasy", .4], ["History", 0], ["Horror", 1], ["Music", 0], ["Mystery", 0], ["Romance", 0], ["Science Fiction", 0], ["TV Movie", 0], //ngl i don't know what a TV Movie is
        ["Thriller", 0], ["War", 0], ["Western", 0], 
    ])],
    ["Music", new Map([
        ["Action", 0], ["Adventure", 0], ["Animation", 0], ["Comedy", 0], ["Crime", 0], ["Documentary", .5], ["Drama", 0], ["Family", .5],
        ["Fantasy", .4], ["History", .4], ["Horror", 0], ["Music", 1], ["Mystery", .1], ["Romance", .3], ["Science Fiction", .2], ["TV Movie", 0], //ngl i don't know what a TV Movie is
        ["Thriller", 0], ["War", 0], ["Western", 0], 
    ])],
    ["Mystery", new Map([
        ["Action", .6], ["Adventure", .2], ["Animation", .3], ["Comedy", .3], ["Crime", .9], ["Documentary", .9], ["Drama", .7], ["Family", .1],
        ["Fantasy", .3], ["History", .3], ["Horror", .7], ["Music", .1], ["Mystery", 1], ["Romance", .6], ["Science Fiction", .5], ["TV Movie", .5], //ngl i don't know what a TV Movie is
        ["Thriller", .4], ["War", 0], ["Western", 0], 
    ])],
    ["Romance", new Map([
        ["Action", .7], ["Adventure", .6], ["Animation", .7], ["Comedy", .8], ["Crime", .7], ["Documentary", .1], ["Drama", .8], ["Family", .1],
        ["Fantasy", .8], ["History", 0], ["Horror", 0], ["Music", .3], ["Mystery", .6], ["Romance", 1], ["Science Fiction", .7], ["TV Movie", .7], //ngl i don't know what a TV Movie is
        ["Thriller", .7], ["War", .7], ["Western", .5], 
    ])],
    ["Science Fiction", new Map([
        ["Action", .2], ["Adventure", .5], ["Animation", .6], ["Comedy", .2], ["Crime", .1], ["Documentary", 0], ["Drama", .3], ["Family", .1],
        ["Fantasy", .4], ["History", .1], ["Horror", .6], ["Music", .2], ["Mystery", .5], ["Romance", .5], ["Science Fiction", 1], ["TV Movie", .2], //ngl i don't know what a TV Movie is
        ["Thriller", .2], ["War", .2], ["Western", .5], 
    ])],
    ["TV Movie", new Map([
        ["Action", .5], ["Adventure", .5], ["Animation", .5], ["Comedy", .5], ["Crime", .5], ["Documentary", .5], ["Drama", .5], ["Family", .5],
        ["Fantasy", .5], ["History", .5], ["Horror", .5], ["Music", 0], ["Mystery", .5], ["Romance", .5], ["Science Fiction", .2], ["TV Movie", 1], //ngl i don't know what a TV Movie is
        ["Thriller", .5], ["War", .5], ["Western", .5], 
    ])],
    ["Thriller", new Map([
        ["Action", .5], ["Adventure", .1], ["Animation", 0], ["Comedy", 0], ["Crime", .7], ["Documentary", .1], ["Drama", .2], ["Family", 0],
        ["Fantasy", .1], ["History", 0], ["Horror", .8], ["Music", 0], ["Mystery", .4], ["Romance", .7], ["Science Fiction", .2], ["TV Movie", .5], //ngl i don't know what a TV Movie is
        ["Thriller", 1], ["War", 0], ["Western", .2], 
    ])],
    ["War", new Map([
        ["Action", .2], ["Adventure", 0], ["Animation", 0], ["Comedy", 0], ["Crime", 0], ["Documentary", .5], ["Drama", 0], ["Family", 0],
        ["Fantasy", 0], ["History", .4], ["Horror", 0], ["Music", 0], ["Mystery", 0], ["Romance", .7], ["Science Fiction", .2], ["TV Movie", .5], //ngl i don't know what a TV Movie is
        ["Thriller", 0], ["War", 1], ["Western", 0], 
    ])],
    ["Western", new Map([
        ["Action", .5], ["Adventure", .2], ["Animation", 0], ["Comedy", .1], ["Crime", .4], ["Documentary", .2], ["Drama", .5], ["Family", 0],
        ["Fantasy", .1], ["History", .5], ["Horror", .1], ["Music", 0], ["Mystery", 0], ["Romance", .5], ["Science Fiction", .5], ["TV Movie", .5], //ngl i don't know what a TV Movie is
        ["Thriller", .2], ["War", 0], ["Western", 1], 
    ])],
])

export default genreRelationships;