# xxl-coind-express-api

`xxl-coind-express-api` is an Express middleware wrapper exposing local *coind JSOIN-RPC methods for access via a url. Should work for most Bitcoin or Bitcoin derived Cryptocurrencies.

**Notes**: Currently does not support RPC methods that require you to unlock your local wallet. The focus of this project is to support simple, Read-Only methods. This middleware is experimental presently but should be refined over time. Please report any bugs.

## Install

```javascript
npm install xxl-coind-express-api
```

## How to use

### Node.js

```javascript
const express   = require('express');
const coindApi  = require('xxl-coind-express-api');

// Create Express App
let app = express();

let allowedMethods = ['getinfo', 'getmininginfo', 'getpeerinfo'];
let walletSettings = {
  host: 'localhost',
  port: 8332,
  user: 'username',
  pass: 'password123'
};

// Provide an array of allowed RPC methods
app.set('coindAllowedMethods', allowedMethods);

// Provide local *coind wallet settings
app.set('coindRPCSettings', walletSettings);

// Bind the middleware "coindApi" to a provided path
app.use('/api', coindApi);

// Run the application server
app.listen(3000);
```

### Client/Browser

Just add the method name after the binded url.

* http://localhost:3000/URL/METHOD

For example:

* http://localhost:5000/api/getinfo

This returns data exactly as would be expected from the JSON-RPC api.

```javascript
{
  "version": 1,
  "protocolversion": 1,
  "walletversion": 1,
  "balance": 1,
  "blocks": 1,
  "timeoffset": -2,
  "connections": 1,
  ...
}
```

Parameters are sent via a query string:

* http://localhost:3000/api/gettransaction?txid=abc123

```javascript
{
  "amount": 1,
  "confirmations": 1,
  "blockhash": "1",
  "blockindex": 1,
  "blocktime": 1372728756,
  "txid": "1",
  ...
}
```

Bitcoin and Bitcoin-derived cryptocurrencies should have similarities to RPC methods available. Consult the [Bitcoin API call list](https://en.bitcoin.it/wiki/Original_Bitcoin_client/API_Calls_list) for parameter information, or your local blockchain developer!


## Access Control

To ensure sneaky individuals can't manipulate your information or view details you would otherwise like to hide, you can pass in an **optional array** of RPC method names you would like to expose. This middleware will authenticate requests and ensure a request matches one of the passed array values:

```
let allowedMethods = ['getinfo', 'getmininginfo', 'getpeerinfo'];
app.set('coindAllowedMethods', allowedMethods);
```

By default, if no *coindAllowedMethods* are set, the following RPC methods/routes will become available: **getInfo, getmininginfo**.

## Projects

xxl-coind-express-api is used in the following projects:

* xxl-coind-explorer (**in development**)

If you use xxl-coind-express-api in your projects submit a pull request to the readme with a link for review, open collaboration and improvements are welcomed!

# Licence

Copyright (C) 2018 Pixxl

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


Sample here
