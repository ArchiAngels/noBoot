require('dotenv').config();

const http = require('http');
const port = process.env.PORT || 3001;
const offset = require('./store/offset.js');

const login = require('./methods/logInToBot.js');
const checkUpdates = require('./methods/checkUpdates.js');
// const sendMessage = require('./methods/sendMessage.js');
// const closeUpdate = require('./methods/closeUpdate.js');

http.createServer((req,res)=>{
    let params =  req.url.split('/');
    console.log(req.url,params);
    if(params[1] === 'apitest'){
        login(process.env.bot_token,res);
        
    }else if(params[1] === 'apitest2'){
        checkUpdates(process.env.bot_token,res);
    }
    else if(params[1] === 'offset'){
        if(params[2] === '+' || params[2] === 'increase'){
            offset.increaseState()
        }else if(params[2] === '-' || params[2] === 'decrease'){
            offset.decreaseState();
        }

        res.end(offset.getOffset());
        
    }
    else{
        res.end(process.env.name);
    }
    
    
}).listen(port)

// login(process.env.token).then(value=>{
//     console.log(value);
// }).catch((reason=>{
//     console.log(reason);
// }))