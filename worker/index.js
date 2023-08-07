const keys = require("./keys");

const redis = require("redis");

const redisClient = redis.createClient({
    url: `redis://${keys.redisHost}:${keys.redisPort}`,
    retry_strategy: () => 1000
});
redisClient.connect();

const subscriber = redisClient.duplicate();

function fib(index){
    if(index < 2)
        return 1;
    return fib(index-1) + fib(index-2);
}

subscriber.on("message",(channel, message) => {
    redisClient.hSet("values",message,fib(parseInt(message)));
})

subscriber.subscribe("insert");
