require('dotenv').config();

let AutoLookingForUpdates = false;

const http = require('http');
const port = process.env.PORT || 3002;

const offset = require('./store/offset.js');
const colorCLI = require("./color-cli/color.js");

const updateCommands = require('./src/methods/updateAllCommands.js');
const userController = require('./store/userInfo.js');
const {mainCycle,startStopCycle} = require('./src/methods/_mainLifeCycle.js');
const succesTransaction = require('./src/methods/succesTransaction.js');



http.createServer((req,res)=>{
    let params =  req.url.split('/');

    colorCLI.warning(req.url,params);

    res.setHeader(
        "Access-Control-Allow-Origin","*"
    )

    if(params[1] === 'offset'){
        if(params[2] === '+' || params[2] === 'increase'){
            offset.increaseState();
        }else if(params[2] === '-' || params[2] === 'decrease'){
            offset.decreaseState();
        }

        res.end(offset.getOffset());
        
    }
    else if(params[1] === 'addCommand'){
        updateCommands(process.env.bot_token,res);
    }else if(params[1] === 'userControl'){

        let users = userController.getUsers();
        let jsonUsers = JSON.stringify(users);

        res.end(jsonUsers);

    }else if(params[1] === 'TurnOnOffBot'){
        AutoLookingForUpdates = !AutoLookingForUpdates;

        let result = JSON.stringify({
            isOK:true,
            botIsWorking:AutoLookingForUpdates
        })

        if(AutoLookingForUpdates){
            startStopCycle(true);
            // rerestar bot
            mainCycle(res,process.env.bot_token);
        }else{
            startStopCycle(false);
            res.end(result);
        }
     
    }
    else if(params[1] === 'getCurrentStateOfBot'){

        result = {
            isOK:true,
            isBotON:AutoLookingForUpdates
        }
        result = JSON.stringify(result);
        res.end(result);
    }
    else if(params[1] === 'setSuccesTransaction'){
        
        let roomID = +params[2];
        if(roomID){
            succesTransaction(roomID,process.env.bot_token);
            res.end('ok');
        }else{
            res.end('NOTok');
        }    
    }
    else if(params[1] === 'setAdmin'){
        let roomID = +params[2];
        let setAdmin = +params[3] > 0 ? true : false;
        if(roomID){
            userController.setAdmin(roomID,setAdmin);
            res.end('ok');
        }
        else{
            res.end('NotOk');
        }
    }
    else{
        res.end(process.env.name);
    }
    
    
}).listen({port:port},()=>{
    colorCLI.succes(` Server run at port : ${port} `);
})