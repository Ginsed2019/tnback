import express from "express";
import sqlite3 from "sqlite3";


const app = express();
const db = new sqlite3.Database("./tn.db", sqlite3.OPEN_READWRITE, (err) => {
    if(err) return console.error(err.message)
    console.log("Connection sucesful")
})

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
});

app.use(express.json());

app.get("/", async (rec, res) => {
    res.status(200).send("API Works!");
});

app.get("/activities", async(rec, res) => {
    const sql = `
    SELECT *
    FROM activities AS a1
    LEFT JOIN times AS a2 ON a1.id = a2.activity
    `
    db.all(sql, (err, rows) => {
        if(err) {
            res.status(400).json(err.message);
            return;
        }
        let groups = rows.reduce((result, current) => {
            result[current.group] = result[current.group] || [];
            result[current.group].push(current);
            return result;
        }, {})
        // for(let key in groups) {
        //     groups[key] = groups[key].reduce((result, current) => {
        //         result[current.name] = result[current.name] || [];
        //         result[current.name].push(current);
        //         return result;
        //     }, {})
        // }
        res.status(200).send(groups);
    })
})

app.listen(process.env.PORT || 5001, () => {
    console.log("Server started");
});