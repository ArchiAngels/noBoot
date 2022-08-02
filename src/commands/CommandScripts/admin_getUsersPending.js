const nextAdminStep = require('./nextStepAdmins.js');


module.exports = function getUsersWaitingToConfirmTheirWalletProcess(roomID){

    return nextAdminStep(roomID)

};