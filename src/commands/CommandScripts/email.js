const userController = require('../../../store/userInfo.js');
const nextStep = require('./nextStep.js');

module.exports = function email(roomID,email){

    console.log(`\n\n\nEMAIL__EVENT\n\n\n`);


    let isUser = userController.getUserByRoomID(roomID);
    

    let msg ='';

    if(isUser === -1){
        msg = nextStep(roomID)
        userController.initEmptyUser(roomID);
    }else{
        let regexEmail = new RegExp(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/gi);
        let passedEmail = email;
        let isPassed = passedEmail.match(regexEmail);

        console.log(isPassed,passedEmail);
        if(isPassed){
            userController.addUserEmail(roomID,passedEmail);
        }      
        
        msg = nextStep(roomID);
    }


    return msg;
}
                                    