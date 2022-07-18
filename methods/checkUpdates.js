const mainRequestHttps = require('./_mainRequestHttps.js');
const colorCLI = require('../color-cli/color.js');

module.exports = function checkUpdates(token,response){
    let options = {
        url:'getUpdates',
        token:token,
    };
    function whatNeedToDo(response){
        colorCLI.succes('_mainRequestHttps ' + response.statusCode);
        // return 0;
    }


    return mainRequestHttps(options,whatNeedToDo).then(value=>{
        console.log(value);
        let msg = ``;
        for(let elem in value){
            
            if(elem === 'result'){
                msg += `${elem} : \n`;
                let result = value[elem];
                for(let elemInResult in result){
                    let update = result[elemInResult];
                    console.log(result,update);

                    options.chat_ID = update.message.from.id;
                    options.command = update.message.text;
                    options.who = update.message.from.first_name;
                    options.chat_message_id = update.update_id;
                    
                    sendMessage(process.env.bot_token,options.chat_ID,'ahahaha'+options.command+options.who);
                    

                    msg += `new message ::${elemInResult}\n`;

                    for(let option in options){
                        msg += `\t${option} : ${options[option]}\n`;
                    }
                    // msg += `\tchat_ID : ${chat_ID}\n`;
                    // msg += `\tcommand : ${command}\n`;
                    // msg += `\twho : ${who}\n`;
                    // msg += `\tchat_message_id : ${chat_message_id}\n`;
                }
                continue
            }
            msg += `${elem} : ${value[elem]}\n`;
        }
        response.end(msg);
    }).catch((reason=>{
        console.log(reason);
        response.end('BAD ::'+reason);
    }))
};