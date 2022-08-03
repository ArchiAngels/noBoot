const userController = require('../../../store/userInfo.js');
const nextAdminStep = require('./nextStepAdmins.js');
const sendStateTransaction = require('../../methods/sendInfoAboutTransaction.js');


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
                if(message.includes('\n')){
                    let messageAsKeyValue = message.split('\n').map(e=>{return e.split(':')});

                    let id = messageAsKeyValue.filter(e=> e[0] === 'id');
                    let NrOrder = messageAsKeyValue.filter(e=>e[0] === 'NrOrder');
    
                    console.log(id,NrOrder);
                    let isRoomID = parseInt(id[0][1]);
                    let isOrder = parseInt(NrOrder[0][1]);
                    
                    console.log(`\n\n\n${isRoomID} ::: ${adminState}\n\n\n`);
    
                    if(isRoomID){
                        console.log(`\n\n\n${isRoomID} ::: ${adminState}\n\n\n`);
                        let result = userController.addNotifyuserAboutResultOfTransaction(roomID,isRoomID,isOrder);
                        if(result.isOK){
                            console.log(result);
                            console.log(`\n\n\n${isRoomID} ::: ${adminState}\n\n\n`);
                        }else{
                            console.log('something bad');
                        }
                        
    
                    }
                }
                

                msg = nextAdminStep(roomID);

            }else if(adminState === 1){
                if(message === 'Положительный'){
                    sendStateTransaction(isAdmin.user.userNotify,process.env.bot_token,true);                    
                }else if(message === 'Отрицательный'){
                    sendStateTransaction(isAdmin.user.userNotify,process.env.bot_token,false);
                };                
                userController.sentInformation(roomID);
                msg = nextAdminStep(roomID);
                userController.resetAdminState(roomID);


            }
        }
    }

    console.log(msg);

    return msg;
}