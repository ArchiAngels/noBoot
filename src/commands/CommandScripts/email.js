const userController = require('../../../store/userInfo.js');
const nextStep = require('./nextStep.js');

module.exports = function email(roomID,email){


    let isUser = userController.getUserByRoomID(roomID);
    let regexEmail = new RegExp(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/gi);
    let passedEmail = email;
    let isPassed = passedEmail.match(regexEmail);

    let msg ='';

    if(isUser === -1){
        msg = nextStep(roomID).message
        userController.initEmptyUser(roomID);
    }else{

        if(isPassed){
            userController.addUserEmail(roomID,passedEmail);
        }else{
        //    nothing
        }        
        
        msg = nextStep(roomID);
    }


    return msg;
}
                                    