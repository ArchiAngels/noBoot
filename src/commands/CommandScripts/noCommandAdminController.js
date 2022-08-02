const userController = require('../../../store/userInfo.js');
const nextAdminStep = require('./nextStepAdmins.js');
const succesTransaction = require('../../methods/succesTransaction.js');


module.exports = function noCommandAdminController(roomID,message){
    let msg = {
        message:'',
        keyboard:false
    };

    let isAdmin = userController.getUserByRoomID(roomID);

    if(!isAdmin.idx){
        msg.message = 'Не найден пользователь';

    }else{
        if(!isAdmin.user.isAdmin){
            msg.message = 'ошибка Обратитесь к Администратору!';
        }else{
            let adminState = isAdmin.user.adminState;

            if(adminState === 0){
                let isRoomID = message.split('id:');
                isRoomID = parseInt(isRoomID[isRoomID.length -1]);
                console.log(`\n\n\n${isRoomID} ::: ${adminState}\n\n\n`);

                if(isRoomID){
                    console.log(`\n\n\n${isRoomID} ::: ${adminState}\n\n\n`);
                    userController.addNotifyuserAboutResultOfTransaction(roomID,isRoomID);
                    console.log(`\n\n\n${isRoomID} ::: ${adminState}\n\n\n`);
                }

                msg = nextAdminStep(roomID);

            }else if(adminState === 1){
                if(message === 'Положительный'){
                    succesTransaction(isAdmin.user.userNotify,process.env.bot_token)
                    msg = nextAdminStep(roomID);
                    userController.resetAdminState(roomID);

                }else if(message === 'Отрицательный'){
                    msg.message = 'in progrtess';
                };


            }
        }
    }

    console.log(msg);

    return msg;
}