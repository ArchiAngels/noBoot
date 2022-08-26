require('dotenv').config();

let AutoLookingForUpdates = false;

const http = require('http');
const port = process.env.PORT || 3002;

const offset = require('./store/offset.js');
const colorCLI = require("./color-cli/color.js");

const updateCommands = require('./src/methods/updateAllCommands.js');
const userController = require('./store/userInfo.js');
const {mainCycle,startStopCycle} = require('./src/methods/_mainLifeCycle.js');
const sendStateTransaction = require('./src/methods/sendInfoAboutTransaction.js');



http.createServer((req,res)=>{
    let params =  req.url.split('/');

    let isWebhook = req.url.includes('?');
    
    console.log(req.url,'----',params,isWebhook);
    colorCLI.warning(req.url,'----',params,isWebhook);

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
        // AutoLookingForUpdates = !AutoLookingForUpdates;

        // let result = JSON.stringify({
        //     isOK:true,
        //     botIsWorking:AutoLookingForUpdates
        // })

        // if(AutoLookingForUpdates){
        //     startStopCycle(true);
        //     // rerestar bot
        //     mainCycle(res,process.env.bot_token);
        // }else{
        //     startStopCycle(false);
        //     res.end(result);
        // }
        res.end('Deprecated');
     
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
            sendStateTransaction(roomID,process.env.bot_token,true);
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
    else if (params[1] === 'update' || isWebhook){
        // update obj'c here
        let webhookParam = params[1].split('?');
        console.log('update',webhookParam);
        const fs = require('fs');
        console.log(req.url);

        let toTxt = webhookParam+'\n\n\n';

        fs.appendFileSync((__dirname+'/testRemoteStore/history.txt'),toTxt);
        // res.writeHead(307,{
        //     "Content-Type": "application/json",
        //     "Cache-Control": "no-cache",
        //     location:'/getUpdates'

        // });
        res.end('ok');
    }else if(params[1] === 'getUpdates'){
        const fs = require('fs');

        let txt = fs.readFileSync((__dirname+'/testRemoteStore/history.txt'));
        res.end(txt);
    }else if (params[1] === 'testUpdates'){
        let objMess = {
            "update_id":10000,
            "message":{
            "date":1441645532,
            "chat":{
                "last_name":"Test Lastname",
                "id":1111111,
                "first_name":"Test",
                "username":"Test"
            },
            "message_id":1365,
            "from":{
                "last_name":"Test Lastname",
                "id":1111111,
                "first_name":"Test",
                "username":"Test"
            },
            "text":"/start"
            }
        }

        objMess = JSON.stringify(objMess);

        res.writeHead(307,{
            location:`/update?${objMess}`,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        })
        res.end();
    }
    else{
        res.end(process.env.name);
    }
    
    
}).listen({port:port},()=>{
    colorCLI.succes(` Server run at port : ${port} `);
})