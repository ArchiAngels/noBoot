const checkUpdates = require('./checkUpdates.js');
const hintNextStep = require('../commands/CommandScripts/nextStep.js');
const aboutMe = require('../commands/CommandScripts/me.js');
const startInit = require('../commands/CommandScripts/start.js');
const email = require('../commands/CommandScripts/email.js');
const support = require('../commands/CommandScripts/support.js');
const handleNoCommandText = require('../commands/CommandScripts/noCommandController.js');
const sendMessage = require('./sendMessage.js');
const colorCLI = require('../../color-cli/color.js');
const offset = require('../../store/offset.js');
// const looking = require('./lookingForUpdates.js');

const admin_getUsersWaitingToConfirmation = require('../commands/CommandScripts/admin_getUsersPending.js');

let AutoLookingForUpdates = false;

function mainCycle(res,token){
    let currentOffset = offset.getAsInt();

    colorCLI.warning(currentOffset);

    if(AutoLookingForUpdates){
        colorCLI.succes('bot run');

        checkUpdates(token,res,currentOffset).then(values=>{

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
                    }else if(messageFromClient === '/support'){
                        msg = support();
                    }else if(messageFromClient === '/get_users_pending'){
                        msg = admin_getUsersWaitingToConfirmation(room_id);
                    }
                    else{
                        msg = hintNextStep(room_id);
                    }
                }else{
                    msg = handleNoCommandText(room_id,messageFromClient);
                }   

                msg.message = encodeURIComponent(msg.message);

                console.log(msg);

                sendMessage(process.env.bot_token,room_id,msg).then(()=>{
                    offset.increaseState();
                })
            }
        })
    }else{
        colorCLI.error('botOff');
    }
}

function startStopCycle(stop = false){
    if(stop){
        AutoLookingForUpdates = true;
    }else{
        AutoLookingForUpdates = false;
    }
}


module.exports = {mainCycle,startStopCycle};