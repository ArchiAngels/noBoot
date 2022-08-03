const sendMessage = require('./sendMessage.js');
const userController = require('../../store/userInfo.js');

module.exports = function Send(roomID,token,isGood = true){
    
    let msg = {};

    let good = 'Успешно пополнено';
    let bad = 'К сожалению что-то пошло не так';
    let result = {amount:'not declared'};
    

    if(isGood){
        result = userController.transactionSuccesfullyGoes(roomID);
    }else{
        result = userController.transactionFailureGoes(roomID);
    }

    msg.message = encodeURIComponent(`${isGood ? good : bad}\n${result.amount}`);
    
    sendMessage(token,roomID,msg)
}