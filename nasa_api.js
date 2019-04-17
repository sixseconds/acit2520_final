const axios = require("axios");

var getImages = async (keyword) => {
    let search = await axios.get(encodeURI(`https://images-api.nasa.gov/search?q=${keyword}&media_type=image`))
    let images = search.data.collection.items
    
    let imageLinks = images.map(item => {
        return item.links[0].href
    })

    return imageLinks
}

module.exports = {
    getImages
}