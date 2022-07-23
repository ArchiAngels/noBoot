const userController = require('../../../store/userInfo.js');
const nextStep = require('./nextStep.js');
const colorCLI = require('../../../color-cli/color.js');

module.exports = function handleNoCommandText(roomID,message){
    let msg = {
        message:'',
        keyboard:false
    };

    let isUserExist = userController.getUserByRoomID(roomID);
    

    // msg = nextStep(roomID);

    if(!isUserExist.idx){
        msg = nextStep(roomID);
    }else{
        let state = isUserExist.user.fillFormState;

        // colorCLI.error('CURRENT STATE:::',state,isUserExist.user);
        // console.log(state,isUserExist.user);
        // colorCLI.error('CURRENT STATE:::',state);
        // colorCLI.error('CURRENT STATE:::',state);
        console.log("handleNoCommandText::",message,message === '«Продолжить»',state);
    
            if(state === 0){
    
                let fullnameWise = message;
                    fullnameWise = fullnameWise.split(' ');
                if(fullnameWise.length === 2){
                    userController.addUserFirstAndLastNames(roomID,fullnameWise[0],fullnameWise[1]);
                    msg = nextStep(roomID);
                }else{
                    msg = nextStep(roomID);
                }
    
                
            }
            else if(state === 1){
                let regexEmail = new RegExp(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/gi);
                let passedEmail = message;
    
                let isPassed = passedEmail.match(regexEmail);
                if(isPassed){
                    userController.addUserEmail(roomID,passedEmail);              
                }else{
                    // nothing
                }
                msg = nextStep(roomID);
                
            }else if(state === 2){
                // console.log('state',2,'«Продолжить»')
                if(message === '«Продолжить»'){
                    // console.log('state',2,'«Продолжить»')
                    userController.userAcceptRules(roomID);
                    msg = nextStep(roomID);
                    // msg.message = process.env.sendButtons;
                }else{
                    // nothing
                }
            }else if(state === 3){
                let isPassedNumber = false;
                let lookMess = message.split(' ')[0];
    
                let keyboard = [        
                    [{text:50}],
                    [{text:100}],
                    [{text:250}],
                    [{text:500}],
                    [{text:1000}],
                    [{text:2000}],
                ]
    
                for(let i = 0; i < keyboard.length;i++){
                    if(lookMess == keyboard[i][0].text){
                        // console.log(keyboard[i]);
                        isPassedNumber = true;
                        userController.addPossibleTransaction(roomID,keyboard[i][0].text);
                        break;
                    }
                }
    
                if(isPassedNumber){
                    msg = nextStep(roomID);
                }else{
                    msg.message = process.env.sendButtons;
                }
                
            }else if(state === 4){
                // console.log('state',4,'«Продолжить»')
                if(message === '«Продолжить»'){
                    // console.log('state',4,'«Продолжить»')
                    userController.userAcceptRules(roomID);
                    msg = nextStep(roomID);
                }else{
                    // nothing
                }
            }
    
        
    }
    return msg;

    
}