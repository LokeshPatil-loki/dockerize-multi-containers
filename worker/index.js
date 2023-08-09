
import keys from "./keys.js";
import redis from "redis";

const redisClient = redis.createClient({
    url: `redis://${keys.redisHost}:${keys.redisPort}`,
    retry_strategy: () => 1000
});
await redisClient.connect();

const subscriber = redisClient.duplicate();
await subscriber.connect();
function fib(index){
    if(index <= 1)
        return index;
    return fib(index-1) + fib(index-2);
}

// subscriber.on("message",(channel, message) => {
//     console.log("message")
//     // redisClient.hSet("values",message,fib(parseInt(message)));
// })

subscriber.subscribe("insert",(message => {
    const num = parseInt(message);
    console.log("fib of ",num)
    redisClient.hSet("values",message,fib(num));
}));
