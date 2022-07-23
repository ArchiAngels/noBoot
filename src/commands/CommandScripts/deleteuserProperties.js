const userController = require('../../../store/userInfo.js');

module.exports = function deleteUser(roomID){


    let isUser = userController.getUserByRoomID(roomID);
    let msg ='';

    if(isUser === -1){
        msg = 'Упсс, такого пользователя не нашлось.'
    }else{
        userController.deleteuserFromList(roomID);
        msg = 'Успешно данные стерты';      
    }

    // msg = encodeURIComponent(msg);
    return msg;
}