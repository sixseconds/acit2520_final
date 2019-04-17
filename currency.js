const axios = require("axios");

/*
const baseCurrency = "USD";
const newCurrencies = ["CAD", "JPY", "GBP", "PLN"];
const value = 20;
*/

const getExchangeRates = async (currency, newCurrencies) => {
    const exchangeAPI = "https://api.exchangeratesapi.io/latest?base=";
    const searchCurrencies = "&symbols=" + newCurrencies.join(",");
    let exchange = await axios.get(exchangeAPI + currency + searchCurrencies);
    return exchange.data.rates;
};

const getCountries = currency => {
    const countryAPI = "https://restcountries.eu/rest/v2/currency/";
    return axios.get(countryAPI + currency);
};

const getFinalConversion = async (value, baseCurrency, newCurrencies) => {
    const rates = await getExchangeRates(baseCurrency, newCurrencies);
    const countryData = await getCountries(baseCurrency);

    let initialCurrency = `${value} ${baseCurrency}`;

    //let rates = exchange.data.rates;

    let values = Object.values(rates).map(rate =>
        (rate * value).toPrecision(4).toString()
    );
    let codes = Object.keys(rates);
    let convertedValues = [];
    for (i = 0; i < values.length; i++) {
        convertedValues.push(`${values[i]} ${codes[i]}`);
    }

    let countries = countryData.data.map(country => country.name);

    return `${initialCurrency} is worth ${convertedValues.join(
        " / "
    )}. You can spend it in the following countries:\n${countries.join(", ")}.`;
};

/*
getFinalConversion(value, baseCurrency, newCurrencies)
    .then(conversion => {
        console.log(conversion);
    })
    .catch(e => {
        console.log(e);
    });
*/

module.exports = {
    convert: getFinalConversion
};
