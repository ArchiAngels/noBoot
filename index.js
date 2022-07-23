require('dotenv').config();

const http = require('http');
const port = process.env.PORT || 3001;
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

http.createServer((req,res)=>{
    let params =  req.url.split('/');

    colorCLI.warning(req.url,params);

    if(params[1] === 'apitest'){
        login(process.env.bot_token,res);
        
    }else if(params[1] === 'apitest2'){
        let currentOffset = offset.getAsInt();
        looking(
            res,
            ()=>{
                currentOffset = offset.getAsInt();
                colorCLI.warning(currentOffset);
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
                                    msg.message = aboutMe(room_id);
                                }else if(messageFromClient === '/start'){
                                    msg = startInit(room_id);
                                }else if(values[update].CommandName === 'email'){
                                    msg = email(room_id,messageFromClient);
                                }
                                // else if(messageFromClient === '/delete_my_inforamtion'){
                                //     msg.message = deleteUserProperties(room_id);
                                // }
                            }else{
                                msg = handleNoCommandText(room_id,messageFromClient);
                            }   

                            colorCLI.warning(msg.message,msg === process.env.sendButtons);

                            if(msg.message === process.env.sendButtons ){
                                let options_keyboard = [        
                                    [{text:50}],
                                    [{text:100}],
                                    [{text:250}],
                                    [{text:500}],
                                    [{text:1000}],
                                    [{text:2000}],
                                ]

                                options_keyboard = options_keyboard.map((e)=>{
                                    e[0].text += ' USDT';
                                })


                                sendButtons(process.env.bot_token,room_id,options_keyboard).then(()=>{
                                    offset.increaseState();
                                });
                            }else{

                                msg.message = encodeURIComponent(msg.message);

                                sendMessage(process.env.bot_token,room_id,msg).then(()=>{
                                    offset.increaseState();
                                })
                            }
                            
                        }
                    
                })
            }
        )
        
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
    }
    else{
        res.end(process.env.name);
    }
    
    
}).listen({port:port},()=>{
    colorCLI.succes(` Server run at port : ${port} `);
})

// login(process.env.token).then(value=>{
//     console.log(value);
// }).catch((reason=>{
//     console.log(reason);
// }))