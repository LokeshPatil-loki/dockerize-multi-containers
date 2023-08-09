// const keys = require("./keys");
import keys from "./keys.js";
// Express App Setup
import express from "express";
// const express = require("express");
import cors from "cors";
// const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Postgres client setup
// const {Pool} = require("pg");
import pg from "pg";
const {Pool} = pg;
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on("error",() => {
    console.log('Lost PG connection');
});

pgClient
    .query("CREATE TABLE IF NOT EXISTS values(number INT)")
    .catch(err => console.log(err));

// RedisClient setup
// const redis = require("redis");
import redis from "redis";

const redisClient = redis.createClient({
    url: `redis://${keys.redisHost}:${keys.redisPort}`,
    retry_strategy: () => 1000
});



redisClient.on('connect', () => {
    console.log('Connected to Redis12345');
})

redisClient.on('error', (err) => {
    console.log(err.message);
})

redisClient.on('ready', () => {
    console.log('Redis is ready');
})

redisClient.on('end', () => {
    console.log('Redis connection ended');
})

process.on('SIGINT', () => {
    redisClient.quit();
})

await redisClient.connect();

const redisPublisher = redisClient.duplicate();
await redisPublisher.connect();

// Express route handlers

app.get("/",(req,res) => {
    res.send("Hi"); 
});

app.get("/values/all",async (req,res) => {
    const values = await pgClient.query("SELECT * FROM values");
    res.send(values.rows);
});

app.get("/values/current", async (req,res) => {
    try {
        const values = await redisClient.hGetAll("values");
        console.log(values);
        res.send(values);
    } catch (error) {
        console.log(error);
        res.send([]);
    }
});

app.post("/values",async(req,res) => {
    try {
        const index = req.body.index;
        if(parseInt(index) > 40){
            return res.status(422).send("Index too high");
        }
        redisClient.hSet("values", index, "Nothing Yet!");
        redisPublisher.publish("insert", String(index));
        pgClient.query(`INSERT INTO values(number) VALUES($1)`,[index]);
        res.send({working: true});
    } catch (error) {
        console.log(error);
    }
});



app.listen(5000, err => {
    console.log("Listening");
})
