const sendMessage = require('./sendMessage.js');
const userController = require('../../store/userInfo.js');

module.exports = function Succes(roomID,token){
    let msg = {};
    msg.message = encodeURIComponent('Успешно пополнено');
    userController.transactionSuccesfullyGoes(roomID);
    sendMessage(token,roomID,msg)
}