const express = require("express");
const hbs = require("hbs");
const currency = require("./currency");
const fs = require("fs");

const port = process.env.PORT || 8080;

/*
const baseCurrency = "USD";
const newCurrencies = ["CAD", "JPY", "GBP", "PLN"];
const value = 20;
*/

const app = express();

hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));

hbs.registerHelper("getCurrentYear", () => {
    return new Date().getFullYear();
});

var pages = {
    "/index": "index",
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

hbs.registerHelper("converter", (value, baseCurrency, newCurrencies) => {
    currency.convert(value, baseCurrency, newCurrencies).then(conversion => {
        console.log(conversion);
        console.log(typeof value)

        if (typeof value === "number") {
            return conversion;
        } else {
            return "Invalid conversion!";
        }
    });
});

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

/*
app.use((request, response, next) => {
    response.render("maintenance.hbs", {
        title: "Maintenance"
    });
});
*/

app.get("/index", (request, response) => {
    response.render("index.hbs", {
        title: pages[request.route.path],
        currentEndpoint: request.route.path
    });
    console.log(response.headers);
});

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

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
