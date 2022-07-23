const mainRequestHttps = require('./_mainRequestHttps.js');
const colorCLI = require('../../color-cli/color.js');

module.exports = function sendMessage(token,chatID,msg){
    keyboardMarkup = {};

    if(msg.keyboard){
        keyboardMarkup = {
            keyboard:msg.keyboard
        }
    }else{
        keyboardMarkup = {
            remove_keyboard:true
        }
    }

    colorCLI.error(msg.keyboard);

    keyboardMarkup = JSON.stringify(keyboardMarkup);

    let options = {
        url:`sendMessage?chat_id=${chatID}&text=${msg.message}&reply_markup=${keyboardMarkup}`,
        token:token,
    };
    function whatNeedToDo(response){
        colorCLI.succes('_mainRequestHttps ' + response.statusCode);
    }


    return mainRequestHttps(options,whatNeedToDo).then(value=>{
    }).catch((reason=>{
        console.log(reason);
    }))
};