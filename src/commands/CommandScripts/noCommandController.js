const userController = require('../../../store/userInfo.js');
const nextStep = require('./nextStep.js');
const colorCLI = require('../../../color-cli/color.js');
const FreshMonetTypes = require('../../../store/money.js');

module.exports = function handleNoCommandText(roomID,message){

    console.log(`\n\n\handleNoCommandText\n\n\n`);
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
        // console.log("handleNoCommandText::",message,message === '«Продолжить»',state);
    
            if(state === 0){
    
                let fullnameWise = message;
                    fullnameWise = fullnameWise.split(' ');

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
                }

                msg = nextStep(roomID);
            }else{
                msg = nextStep(room_id);
            }
    
        
    }
    return msg;

    
}