const userController = require('../../../store/userInfo.js');
const nextStep = require('./nextStep.js');

module.exports = function getUsersWaitingToConfirmTheirWalletProcess(roomID,isMessage = true){

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
    let isUser = userController.getUserByRoomID(roomID);

    if(isUser === -1){
        return nextStep(roomID);
    }

    console.log(isUser);

    if(!isUser.user.isAdmin){
        msg.message = 'Здравствуйте, Обратитесь к Администратору!';
    }else{
        userController.changeWay(roomID,2);

        if(isMessage){
            msg.message = 'Выберите пользователя которого желаете оповестить о результате транзакции';
        }
        

        let users = [...userController.getUsers().users];

        let usersWithTransaction = users.filter(e => e.possibleTransaction && e.possibleTransaction.length > 0 && e.roomID);

        let usersEmailAndMoney = usersWithTransaction.map((e)=>{
            // return {email:e.email,money:e.possibleTransaction[0]}
            return e.possibleTransaction.map((item,idx)=>{
                return `Емейл:${e.email}\nСумма:${item}\nid:${e.roomID}\nNrOrder:${idx}`;
            })
        });

        if(usersEmailAndMoney.length === 0){
            msg.message = 'Нету пользователей';
        }else{
            msg.keyboardTemplate(...usersEmailAndMoney);
        }

    
    }

    

    return msg;

};

// getUsersWaitingToConfirmTheirWalletProcess(1061674887)