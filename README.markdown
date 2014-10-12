# Introduction

This is a NodeJS event handler that can attach to the [EventBus](https://github.com/aeden/eventbus) system and process events.

# Installation

If necessary, install nodejs.

Next, install the dependencies:

```
npm install ws
npm install sleep
npm install dotenv
```

# Running

To start, set up .env as follows:

```
AUTHORIZATION_TOKEN=123abc
```

You should change the token if you change it in the EventBus service config.

Once .env is set up, run `node eventhandler.js`

# Notes

## Retry Logic

The current retry logic backs off connection retries for N * 1 second, where N is the retry count. It will stop retrying after a certain number of retries.
