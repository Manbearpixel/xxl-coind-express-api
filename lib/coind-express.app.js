const express     = require('express');
const router      = express.Router();

// Switched to old bitcoin npm module due to getrawtransaction duplicate key issue
// const bitcoinCore = require('bitcoin-core');
const bitcoin     = require('bitcoin');

// Default accessible methods (simple read-only requests)
let defaultAccessMethods = [
  'getInfo',
  'getMiningInfo'
];

// Check if a method key exists within a methodList
function methodAvailable(method, methodList) {
  if (typeof methodList !== 'object') methodList = defaultAccessMethods;

  let regexExists = new RegExp(methodList.join("|"), 'gi');
  if (method.match(regexExists)) return true
  return false;
}


/**
 * Router :: Middleware Funnel
 */

// Setup request.coind properties
router.use((req, res, next) => {
  req.coindClient   = {};
  req.coindCommand  = {
    method:     req.path.substring(1,req.path.length),
    parameters: []
  };
  
  next();
});

// Verify method is allowed)
router.use((req, res, next) => {
  if (req.coindCommand['method'] === '') {
    next(new Error('missing_blockchain_method'));
  }
  else if (!methodAvailable(req.coindCommand['method'], req.app.get('coindAllowedMethods'))) {
    next(new Error(`invalid_blockchain_method (${req.coindCommand['method']})`));
  }
  else {
    next();
  }
});

// Clean up any passed parameters
router.use((req, res, next) => {
  if (Object.keys(req.query).length === 0) return next();

  let coindParams = [];
  for (let param in req.query) {
    if (req.query.hasOwnProperty(param)) {
      param = req.query[param];
      if (typeof param === 'undefined' || param === '') continue;
      if (!isNaN(param)) param = parseFloat(param);
      coindParams.push(param);
    }
  }

  req.coindCommand['parameters'] = coindParams;
  next();
});

// Setup bitcoin-client for RPC communication
router.use((req, res, next) => {
  if (typeof req.app.get('coindRPCSettings') === 'undefined') {
    next(new Error('missing_coind_blockchain_settings'));
  }
  else {
    req.coindClient = new bitcoin.Client(req.app.get('coindRPCSettings'));
    next();
  }
});

// Handle Request
router.get('*', (req, res, next) => {
  if (typeof req.coindClient['cmd'] !== 'function')
    return next(new Error('invalid_coind_client'));

  let command = [{
    method: req.coindCommand['method'],
    params: req.coindCommand['parameters']
  }];

  // req.coindClient.command([req.coindCommand], (err, response) => {
  req.coindClient.cmd(command, (err, response) => {
    if (err) {
      console.log(`\nRPC_ERROR :: ${req.url}\n${JSON.stringify(req.coindCommand)}\nError: ${err.message}`);
      return next(new Error(err));
    }

    if (typeof response === 'object') {
      if (response.hasOwnProperty('name') && response['name'] === 'RpcError') {
        console.log(`\nRPC_ERROR :: ${req.url}\n${JSON.stringify(req.coindCommand)}\n${response['message']}\n`);
        return next(new Error(`rpc_error`));
      }
      return res.json(response);
    }
    
    res.send('' + response);
  });
});

module.exports = router;
