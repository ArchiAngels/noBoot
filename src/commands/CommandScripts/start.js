const userController = require('../../../store/userInfo.js');
const nextStep = require('./nextStep.js');

module.exports = function start(roomID){


    let isUser = userController.getUserByRoomID(roomID);
    let msg ='';

    if(isUser === -1){
        
        userController.initEmptyUser(roomID);
    }else{
        // nothing
        userController.makeNewTransaction(roomID);

    }
    msg = nextStep(roomID);

    return msg;
}