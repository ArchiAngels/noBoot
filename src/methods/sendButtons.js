const mainRequestHttps = require('./_mainRequestHttps.js');
const colorCLI = require('../../color-cli/color.js');

module.exports = function sendButtons(token,chatID,keyboard){
    let text = 'Выберите сумму пополнения:';
        text = encodeURIComponent(text);
    let buttn_markup = {
        keyboard:keyboard
    }
    

    buttn_markup = JSON.stringify(buttn_markup);

    let options = {
        url:`sendMessage?chat_id=${chatID}&text=${text}&reply_markup=${buttn_markup}`,
        token:token,
    };
    function whatNeedToDo(response){
        colorCLI.succes('_mainRequestHttps ' + response.statusCode);
        // return 0;
    }


    return mainRequestHttps(options,whatNeedToDo).then(value=>{
        // console.log(value);
        // response.end(msg);
    }).catch((reason=>{
        console.log(reason);
        // response.end('BAD ::'+reason);
    }))
};