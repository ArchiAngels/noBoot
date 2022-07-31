require('dotenv').config();

let AutoLookingForUpdates = false;

const http = require('http');
const port = process.env.PORT || 3002;
const offset = require('./store/offset.js');
const colorCLI = require("./color-cli/color.js");
const URL_COMMANDS = './src/commands/commands';

const login = require('./src/methods/logInToBot.js');
const checkUpdates = require('./src/methods/checkUpdates.js');
const sendMessage = require('./src/methods/sendMessage.js');
const looking = require('./src/methods/lookingForUpdates.js');
const updateCommands = require('./src/methods/updateAllCommands.js');
const userController = require('./store/userInfo.js');
const hintNextStep = require('./src/commands/CommandScripts/nextStep.js');
const aboutMe = require('./src/commands/CommandScripts/me.js');
const startInit = require('./src/commands/CommandScripts/start.js');
const email = require('./src/commands/CommandScripts/email.js');
const handleNoCommandText = require('./src/commands/CommandScripts/noCommandController.js');
const sendButtons = require('./src/methods/sendButtons.js');
const deleteUserProperties = require('./src/commands/CommandScripts/deleteuserProperties.js');
const support = require('./src/commands/CommandScripts/support.js');
const FreshMoneyTypes = require('./store/money.js');



http.createServer((req,res)=>{
    let params =  req.url.split('/');

    colorCLI.warning(req.url,params);

    res.setHeader(
        "Access-Control-Allow-Origin","*"
    )

    if(params[1] === 'apitest'){
        login(process.env.bot_token,res);
        
    }else if(params[1] === 'apitest2'){
        mainCicle(req,res);
        
    }
    else if(params[1] === 'offset'){
        if(params[2] === '+' || params[2] === 'increase'){
            offset.increaseState()
        }else if(params[2] === '-' || params[2] === 'decrease'){
            offset.decreaseState();
        }

        res.end(offset.getOffset());
        
    }
    else if(params[1] === 'addCommand'){
        updateCommands(process.env.bot_token,res);
    }else if(params[1] === 'userControl'){
        res.setHeader(
            "Access-Control-Allow-Origin","*"
        )
        let users = userController.getUsers();
        let jsonUsers = JSON.stringify(users);
        // console.log(jsonUsers)
        res.end(jsonUsers);
        // res.end(userController.getUsers());
    }else if(params[1] === 'TurnOnOffBot'){
        // res.setHeader(
        //     "Access-Control-Allow-Origin","*"
        // )
        AutoLookingForUpdates = !AutoLookingForUpdates;

        let result = JSON.stringify({
            isOK:true,
            botIsWorking:AutoLookingForUpdates
        })

        if(AutoLookingForUpdates){
            // rerestar bot
            mainCicle(res);
        }else{
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
        console.log(roomID);
        if(roomID){
            let msg = {};
            msg.message = encodeURIComponent('Успешно пополнено');
            userController.transactionSuccesfullyGoes(roomID);
            sendMessage(process.env.bot_token,roomID,msg);
            res.end('ok');
        }else{
            res.end('NOTok');
        }

        
        
        
    }
    else{
        res.end(process.env.name);
    }

    function mainCicle(res){
        let currentOffset = offset.getAsInt();
        looking(
            res,
            ()=>{
                currentOffset = offset.getAsInt();
                colorCLI.warning(currentOffset);
                if(AutoLookingForUpdates){
                    colorCLI.succes('bot run');

                    checkUpdates(process.env.bot_token,res,currentOffset).then(values=>{

                        console.log(values);

                        for(let update = 0; update < values.length; update++){
                            let room_id = values[update].chat_ID;
                            let msg = {};
                            let messageFromClient = values[update].text;
                            // return 0;
                            if(values[update].isCommand){
                                if(messageFromClient === '/next_step'){
                                    msg = hintNextStep(room_id);
                                }else if(messageFromClient === '/me'){
                                    msg = aboutMe(room_id);
                                }else if(messageFromClient === '/start'){
                                    msg = startInit(room_id);
                                }else if(values[update].CommandName === 'email'){
                                    msg = email(room_id,messageFromClient);
                                }
                                else if(messageFromClient === '/support'){
                                    msg = support();
                                }else{
                                    msg = hintNextStep(room_id);
                                }
                                // else if(messageFromClient === '/delete_my_inforamtion'){
                                //     msg.message = deleteUserProperties(room_id);
                                // }
                            }else{
                                msg = handleNoCommandText(room_id,messageFromClient);
                            }   

                            colorCLI.warning(msg.message,msg === process.env.sendButtons);

                            msg.message = encodeURIComponent(msg.message);

                            sendMessage(process.env.bot_token,room_id,msg).then(()=>{
                                offset.increaseState();
                            })
                            
                        }
                    
                })

                }else{
                    colorCLI.error('botOff');
                }
                
            }
        )
    }
    
    
}).listen({port:port},()=>{
    colorCLI.succes(` Server run at port : ${port} `);
})

// login(process.env.token).then(value=>{
//     console.log(value);
// }).catch((reason=>{
//     console.log(reason);
// }))