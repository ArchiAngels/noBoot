const userController = require('../../../store/userInfo.js');

module.exports = function nextStepAdmins(roomID){
    let isUser = userController.getUserByRoomID(roomID);

    let msg = {
        message:'',
        keyboard:false,
        resize_keyboard:true,
        keyboardTemplate:function(arrayWithNames){
            if(arrayWithNames.length !== 0){
                let templateTemp = [];

                for(let i = 0; i < arrayWithNames.length;i++){
                    templateTemp.push([
                        {text:encodeURIComponent(arrayWithNames[i])}
                    ])
                }

                this.keyboard = templateTemp;
            }else{
                this.keyboard = false;
            }
        }
    }

    if(!isUser.user.isAdmin){
        msg.message = 'Здравствуйте, Обратитесь к Администратору!';
    }else{
        userController.changeWay(roomID,2);
        let adminState = isUser.user.adminState;

        console.log(`\n\n\n${roomID}:::${adminState}\n\n`);

        if(adminState === 0){
            msg.message = 'Выберите пользователя которого желаете оповестить о результате транзакции';

            let users = userController.getUsers();

            let usersWithTransaction = users.users.filter(e => e.possibleTransaction && e.possibleTransaction.length > 0 && e.roomID);

            let usersEmailAndMoney = usersWithTransaction.map((e)=>{
                // return {email:e.email,money:e.possibleTransaction[0]}
                return `Емейл: ${e.email} \nСумма: ${e.possibleTransaction[0]}\nid: ${e.roomID}`;
            });

        msg.keyboardTemplate(usersEmailAndMoney);
        }else if(adminState === 1){
            msg.message = 'Выберите результат транзакции';
        msg.keyboardTemplate(['Положительный',"Отрицательный"]);
        }else if(adminState === 2){
            msg.message = `Отчет успешно отправлен!`;
        }else{
            msg.message = 'Ошибка...';
        }

    }

    return msg;
}