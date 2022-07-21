const mainRequestHttps = require('./_mainRequestHttps.js');
const colorCLI = require('../../color-cli/color.js');

module.exports = function sendMessage(token,chatID,text){
    let options = {
        url:`sendMessage?chat_id=${chatID}&text=${text}`,
        token:token,
    };
    function whatNeedToDo(response){
        colorCLI.succes('_mainRequestHttps ' + response.statusCode);
        // return 0;
    }


    return mainRequestHttps(options,whatNeedToDo).then(value=>{
        // console.log(value);
        // let msg = ``;
        // for(let elem in value){
            
        //     if(elem === 'result'){
        //         msg += `${elem} : \n`;
        //         let result = value[elem];
        //         for(let elemInResult in result){
        //             msg += `\t${elemInResult} : ${result[elemInResult]}\n`;
        //         }
        //         continue
        //     }
        //     msg += `${elem} : ${value[elem]}\n`;
        // }
        // response.end(msg);
    }).catch((reason=>{
        console.log(reason);
        // response.end('BAD ::'+reason);
    }))
};