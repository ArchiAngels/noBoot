const userController = require('../../../store/userInfo.js');
const FreshMoneyTypes = require('../../../store/money.js');

module.exports = function nextStep(roomID){


    let isUser = userController.getUserByRoomID(roomID);
    let msg = {
        message:'',
        keyboard:false,
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

    
    if(isUser === -1){
        msg.message = 'Здравствуйте, введите своё имя, фамилию латиницей, так как написано в Wise';
        userController.initEmptyUser(roomID);
    }else{
        let state = isUser.user.fillFormState;
        console.log(`NEXT STATE::: actual state::`,state);
        
        if(state === 0){
            msg.message = 'Здравствуйте, введите своё имя, фамилию латиницей, так как написано в Wise';
            userController.initEmptyUser(roomID);  
        }else if(state === 1){
            msg.message = "Введите адрес электронной почты Wise, для зачисления средств.";
        }else if(state === 2){
            msg.message = `Комиссия за обработку платежа 5% от суммы. \n\n`;
            msg.message += `Пример :\n\n`;
            msg.message += `   ${isUser.user.name} ${isUser.user.surname} \n\n`;
            msg.message += `отправляет 500 USDT (курс 36,8)\n\n`;

            msg.message += `-> \n\n`;
            msg.message += `на Binance кошелёк (18400 грн) \n\n`;
            // msg.message += `${process.env.WALLET_OWNER}\n\n`;
            msg.message += `-> \n\n`;
            msg.message += `Wise пополняется на 17480 UAH,\n\n`;
            msg.message += `Нажмите «Продолжить», если соглашаетесь с условиями.`;
        msg.keyboardTemplate(['«Продолжить»']);
            
        }else if(state === 3){
            msg.message = 'Выберите сумму пополнения:';
        msg.keyboardTemplate(FreshMoneyTypes);
        }else if(state === 4){
            let hash = userController.generatePossibleTransactionHash(roomID);
            msg.message = `Пополните Binance (валюта USDT) на сумму которую вы указали \n\n`;
            msg.message += `Вы указали :\n\n   ${hash.split('/')[1]}\n\n`;
            msg.message += `Выберите сеть: \n\n   TRC20 \n\n`;
            msg.message += `В титуле следует вписать: \n\n   usdtWiseUah${hash.split(' ').join('')}\n\n`;
            msg.message += `Адрес пополнения: \n\n${process.env.WALLET_OWNER}\n\n`;
            msg.message += `Напоминание, если вы отправили сумму меньше или больше той, что указали, платёж может не поступить на счёт\n`;
            msg.message += `\nПосле оплаты нажмите «Продолжить»`;

        msg.keyboardTemplate(['«Продолжить»']);
        }else if(state === 5){
            msg.message = `Ожидайте зачисления средств, если информация правильная и сумма совпадает, с той что, вы указали, время зачисления средств 1-5 минут.`
        }else if(state === 6){
            msg.message = 'Поздравляем средства успешно зачислены!';
        msg.keyboardTemplate(['«Продолжить»']);
        }        
    }

    // msg = encodeURIComponent(msg);
    return msg;
}