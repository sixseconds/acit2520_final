const express = require("express");
const hbs = require("hbs");
const currency = require("./currency");
//const fs = require("fs");

const port = process.env.PORT || 8080;

/*
const baseCurrency = "USD";
const newCurrencies = ["CAD", "JPY", "GBP", "PLN"];
const value = 20;
*/

const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));

hbs.registerHelper("getCurrentYear", () => {
    return new Date().getFullYear();
});

var pages = {
    "/index": "final",
    "/about": "about me",
    "/convert": "convert money here"
};

hbs.registerHelper("makeLinks", currentEndpoint => {
    let links = [];
    Object.entries(pages).forEach(page => {
        if (page[0] !== currentEndpoint) {
            links.push(`<li><a href=${page[0]}>${page[1]}</a></li>`);
        }
    });
    return links.join(`\n`);
});

/*
var convert = (value, baseCurrency, newCurrencies) => {
    currency.convert(value, baseCurrency, newCurrencies).then(conversion => {
        console.log(conversion);
        console.log(typeof value);

        if (typeof value === "number") {
            return conversion;
        } else {
            return "Invalid conversion!";
        }
    });
};
*/

//test
/*
app.use((request, response, next) => {
    let time = new Date().toString();
    let log = `${time}: ${request.method} ${request.url}`;
    fs.appendFile(`server.log`, log + `\n`, error => {
        if (error) {
            console.log("Unable to log message!");
        }
    });
    next();
});
*/

/*
app.use((request, response, next) => {
    response.render("maintenance.hbs", {
        title: "Maintenance"
    });
});
*/

app.get("/", async (request, response) => {
    response.render("index.hbs", {
        title: pages[request.route.path],
        currentEndpoint: request.route.path,
        output: "output"
    });
    //console.log(response);
});

app.post("/", async (request, response) => {
    let baseCurrency = request.body.baseCurrency.toUpperCase();
    let newCurrencies = request.body.newCurrencies.toUpperCase().split(" ").join(",");
    let value = Number(request.body.value);
    
    /*
    console.log(value);
    console.log(baseCurrency);
    console.log(newCurrencies);
    */

    try {
        let conversion = await currency.getFinalConversion(
            value,
            baseCurrency,
            newCurrencies
        );
        //console.log(conversion);

        response.render("index.hbs", {
            title: pages[request.route.path],
            currentEndpoint: request.route.path,
            output: conversion
        });
    } catch (error) {
        response.render("index.hbs", {
            title: pages[request.route.path],
            currentEndpoint: request.route.path,
            output: `${error.message}`
        });
    }

    /*
    response.render("index.hbs", {
        title: pages[request.route.path],
        currentEndpoint: request.route.path,
        output: conversion
    });
    */

    //console.log(response);
});

/*
app.get("/about", (request, response) => {
    response.render("about.hbs", {
        title: pages[request.route.path],
        currentEndpoint: request.route.path
    });
    console.log(response.headers);
});


app.get("/convert", (request, response) => {
    response.render("convert.hbs", {
        title: pages[request.route.path],
        currentEndpoint: request.route.path,
        baseCurrency: "USD",
        newCurrencies: ["CAD", "JPY", "GBP", "PLN"],
        value: 20
    });
});
*/

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
