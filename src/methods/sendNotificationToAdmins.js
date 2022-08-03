let adminRoomIDs = ['1061674887'];
const sendMessage = require('./sendMessage.js');
const userController = require('../../store/userInfo.js');

module.exports = function notificationAdmin(token){

    msg = {};

    let users = [...userController.getUsers().users];

    let usersWithTransaction = users.filter(e => e.possibleTransaction && e.possibleTransaction.length > 0 && e.roomID);

    console.log(usersWithTransaction);

    let userCountOrders = usersWithTransaction.reduce((sum,i) => {return sum += i.possibleTransaction.length},0);

    console.log(userCountOrders);

    msg.message = encodeURIComponent(`Новых заявок {${userCountOrders}}`);

    

    for(let i =0; i < adminRoomIDs.length;i++){
        sendMessage(token,adminRoomIDs[i],msg);
    }


}

// notificationAdmin()