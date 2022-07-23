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
                            let msg = 'hi' +  (offset.getAsInt() + update);
                            // return 0;
                            if(values[update].isCommand){
                                if(values[update].text === '/next_step'){
                                    msg = hintNextStep(process.env.bot_token,room_id);
                                }
                                if(values[update].text === '/start'){

                                    let isUserExist = userController.getUserByRoomID(room_id);

                                    if(isUserExist === -1){
                                        msg = 'Здравствуйте, введите своё имя, фамилию латиницей, так как написано в Wise'
                                        userController.createAndSaveUser({roomID:room_id,fillFormState:0});
                                    }else{
                                        let state = isUserExist.user.fillFormState;
                                        if(state === 0){
                                            msg = 'Здравствуйте, введите своё имя, фамилию латиницей, так как написано в Wise'
                                        }
                                        else if(state === 1){
                                            msg = "Введите адрес электронной почты Wise, для зачисления средств."
                                        }else if(state === 2){
                                            msg = 'Выберите сумму пополнения:';
                                        }
                                    }
                                }
                                else if(values[update].CommandName === 'email'){
                                    let regexEmail = new RegExp(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/gi);
                                    let passedEmail = values[update].text;

                                    let isPassed = passedEmail.match(regexEmail);

                        
                                    console.log('EMAIL::',passedEmail,isPassed);
                                    // return 0;
                                    if(isPassed){
                                        userController.addUserEmail(room_id,passedEmail);
                                        msg = 'Выберите сумму пополнения:';
                                    }else{
                                        msg = "Введите адрес электронной почты Wise, для зачисления средств."
                                    }
                                }
                            }else{
                                let isUserExist = userController.getUserByRoomID(room_id);
                                console.log(values[update].text);
                                

                                    if(isUserExist === -1){
                                        msg = 'Здравствуйте, введите своё имя, фамилию латиницей, так как написано в Wise'
                                        userController.createAndSaveUser({roomID:room_id,fillFormState:0});
                                    }else{
                                        let state = isUserExist.user.fillFormState;
                                        if(state === 0){
                                            let fullnameWise = values[update].text;
                                            console.log(fullnameWise);
                                                fullnameWise = fullnameWise.split(' ');
                                                console.log(fullnameWise);
                                            userController.addUserFirstAndLastNames(room_id,fullnameWise[0],fullnameWise[1]);
                                            msg = "Введите адрес электронной почты Wise, для зачисления средств."
                                        }
                                        else if(state === 1){
                                            // let email = values[update].text;
                                            let regexEmail = new RegExp(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/gi);
                                            let passedEmail = values[update].text;

                                            let isPassed = passedEmail.match(regexEmail);
                        
                                            console.log('EMAIL::',passedEmail,isPassed);
                                            // return 0;
                                            if(isPassed){
                                                userController.addUserEmail(room_id,passedEmail);
                                                msg = 'Выберите сумму пополнения:';
                                            }else{
                                                msg = "Введите адрес электронной почты Wise, для зачисления средств."
                                            }
                                            
                                        }else if(state === 2){
                                            msg = 'Выберите сумму пополнения:';
                                        }
                                    }
                            }
                            msg = encodeURIComponent(msg);
                            sendMessage(process.env.bot_token,room_id,msg).then(()=>{
                                offset.increaseState();
                            })
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