const userController = require('../../../store/userInfo.js');
const sendMessage = require('../../methods/sendMessage.js');

module.exports = function nextStep(token,roomID){


    let isUser = userController.getUserByRoomID(roomID);
    let msg ='';

    if(isUser === -1){
        msg = 'Здравствуйте, введите своё имя, фамилию латиницей, так как написано в Wise'
    }else{
        let state = isUser.user.fillFormState;
        
        if(state === 0){
            msg = 'Здравствуйте, введите своё имя, фамилию латиницей, так как написано в Wise'        
        }else if(state === 1){
            msg = "Введите адрес электронной почты Wise, для зачисления средств.";
        }else if(state === 2){
            msg = 'Выберите сумму пополнения:';
        }        
    }

    sendMessage(token,roomID,msg);
}