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

app.use(function setCommonHeaders(req, res, next) {
    res.set("Access-Control-Allow-Private-Network", "true");
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

app.get("/activities2", async(rec, res) => {
    const sql = `
    SELECT a1.*, SUM(a2.participants) AS current FROM activities2 AS a1
LEFT JOIN participants as a2 ON a1.id = a2.activityID
GROUP BY a1.id
    `
    db.all(sql, (err, rows) => {
        if(err) {
            res.status(400).json(err.message);
            return;
        }
        console.log(rows)
        res.status(200).send(rows);
    })
})

app.post("/register", async(rec, res) => {
    try {
    const time = Date.now()
    const sql = `
    INSERT INTO participants (time, name, surname, school, contactInfo, activityID, participants)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    for (let index = 0; index < rec.body.activities.length; index++) {
        const e = rec.body.activities[index];
        await db.run(sql, [time, rec.body.name, rec.body.surname, rec.body.school, rec.body.contactInfo, e.id, e.participants])
    }
    res.status(201).send("CREATED");
    } catch(error) {
        console.group(error)
        res.status(400).send(error);
    }
})

app.listen(process.env.PORT || 5001, () => {
    console.log("Server started");
});