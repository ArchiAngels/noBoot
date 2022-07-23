const userController = require('../../../store/userInfo.js');

module.exports = function me(roomID){


    let isUser = userController.getUserByRoomID(roomID);
    let msg ='';

    if(isUser === -1){
        msg = 'Нету информации о вас'
    }else{
        let {name,surname,email} = isUser.user;
        let noEntered = 'не указана';

        msg = `\t\t Wise информация обо мне\n\n`;
        
        msg += `Имя : ${name ? name : noEntered}\n`;
            
        msg += `Фамилия : ${surname ? surname : noEntered}\n`;
       
        msg += `Электронная почта : ${email ? email : noEntered}\n` ;
        
    }

    // msg = encodeURIComponent(msg);
    return msg;
}