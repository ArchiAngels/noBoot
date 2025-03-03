const userController = require('../../../store/userInfo.js');
const nextStep = require('./nextStep.js');
const colorCLI = require('../../../color-cli/color.js');
const FreshMonetTypes = require('../../../store/money.js');
const noCommandAdminController = require('./noCommandAdminController.js');
const sendNotificationToAdmins = require('../../methods/sendNotificationToAdmins.js');

module.exports = function handleNoCommandText(roomID,message){

    console.log(`\n\n\handleNoCommandText\n\n\n`);
    let msg = {
        message:'',
        keyboard:false
    };

    let isUserExist = userController.getUserByRoomID(roomID);

    if(!isUserExist.idx){
        msg = nextStep(roomID);
    }else{

        console.log(isUserExist.user.isAdmin,isUserExist.user.way);
        if(isUserExist.user.isAdmin && isUserExist.user.way === 2){
            return noCommandAdminController(roomID,message);
        }else{
            let state = isUserExist.user.fillFormState;
        
            let nameAndSurnameIsExtend = userController.isUserHaveNameAndSurname(roomID);

            if(!nameAndSurnameIsExtend && state > 0){
                userController.setUserFillFormState(roomID,0);
                return msg = nextStep(roomID);
            }

            let emailIsExtend = userController.isUserHaveEmail(roomID);
                    
            if(!emailIsExtend && state > 1){
                userController.setUserFillFormState(roomID,1);
                return msg = nextStep(roomID);
            }

        
            if(state === 0){

                let fullnameWise = message;
                    fullnameWise = fullnameWise.split(' ');

                    console.log(message,fullnameWise);

                if(fullnameWise.length === 2){
                    userController.addUserFirstAndLastNames(roomID,fullnameWise[0],fullnameWise[1]);
                }

                msg = nextStep(roomID);    
                
            }
            else if(state === 1){

                let regexEmail = new RegExp(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/gi);
                let passedEmail = message;

                let isPassed = passedEmail.match(regexEmail);

                console.log(isPassed,passedEmail);
                console.log(`\n\n\handleNoCommandText\n\n\n`);

                if(isPassed){
                    userController.addUserEmail(roomID,passedEmail);              
                }

                msg = nextStep(roomID);
                
            }else if(state === 2){

                if(message === '«Продолжить»'){
                    userController.userAcceptRules(roomID);
                }
                msg = nextStep(roomID);

            }else if(state === 3){
                let result = FreshMonetTypes.filter((e) => e === message);

                if(result.length !== 0){
                    userController.addPossibleTransaction(roomID,result[0]);
                }

                msg = nextStep(roomID);
                
            }else if(state === 4){
                if(message === '«Продолжить»'){
                    userController.userAcceptRules(roomID);       
                    sendNotificationToAdmins(process.env.bot_token);             
                }

                msg = nextStep(roomID);
            }else{
                msg = nextStep(roomID);
            }
        }
    
        
    }
    return msg;

    
}