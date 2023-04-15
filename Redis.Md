## Redis Server

### Redis Server Commands

- set [key] [value]
- get [key]
- keys [*]
- del [key]
- del flushall
- ttl [key]
- expires [key] [seconds]
- setex [key] [expires] [value]

<!-- For list or array -->

- lpush [key] [value]
- rpush [key] [value]
- lpop [key]
- rpop [key]
- lrange [key] [from] [to]

<!-- set -->

- sadd [key] [value]
- srem [key] [value]
- smembers [key] 
