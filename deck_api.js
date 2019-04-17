const axios = require("axios");

var getDeck = async (cards) => {
    let deck = await axios.get(encodeURI(`https://deckofcardsapi.com/api/deck/new/draw/?count=${cards}`))
    let draws = deck.data.cards

    let imageLinks = draws.map(item => {
        return item.images.png
    })
    //console.log(imageLinks)
    return imageLinks
}

module.exports = {
    getDeck
}