const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const request = require("request");
app.use(bodyParser.urlencoded({ extended: false }));
let Port = process.env.PORT || 8000;

let temp_path = path.join(__dirname, "..", "templates", "views");
const static_path = path.join(__dirname, "../templates/public");
app.use(express.static(static_path));

app.set("view engine", "ejs");
app.set("views", temp_path);

app.get("/", (req, res) => {
    let country = "";
    request(`https://corona.lmao.ninja/v2/countries`, (err, resp) => {
        if (err) {
            res.status(404).render('404', {
                err: "Server Error"
            });
        } else {
            let API_Country = JSON.parse(resp.body);
            country = API_Country;
        }
        res.render("index", {
            country1: country
        });
    });



});
app.post('/', (req, res) => {
    const city = req.body.city;
    const country = req.body.country;
    if (city === "No" || country === "No") {
        res.status(404).render('404', {
            err: "Empty Field"
        });
    } else {
        let date = new Date();
        let today = new Date();
        var dd = today.getDate();

        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }
        today = dd + '-' + mm + '-' + yyyy;
        request(`https://api.aladhan.com/v1/calendarByCity?city=${city}&country=${country}&method=2&month=${date.getMonth}&year=${date.getFullYear}`, (err, resp) => {
            let v = JSON.parse(resp.body);
            if (err || v.code == 400) {
                res.status(500).render('404', {
                    err: "Server Error"
                });
            } else {
                var time = date.toLocaleString('en-US', {
                    timeZone: v.data[0].meta.timezone
                });
                var da = time.split(",")[0].split("/")[1];
                if (da < 10) {
                    da = '0' + da;
                }
                res.render('namaz_page', {
                    city2: city,
                    city1: `${city}, ${country}`,
                    obj: v,
                    date1: da,
                    year: yyyy
                });
            }
        });
    }
});
app.listen(Port, () => {
    console.log(`${Port}`);
});