# Rate Window

`RateWindow` is a deterministic in-memory limiter. Its interval is `[now - windowMs, now)`: a timestamp exactly `windowMs` old is expired, while a younger timestamp still counts toward the limit.
