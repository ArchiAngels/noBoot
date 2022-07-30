const mainRequestHttps = require('./_mainRequestHttps.js');
const colorCLI = require('../../color-cli/color.js');

module.exports = function checkUpdates(token,response,offset = -1){
    let options = {
        url:`getUpdates${offset > 0? `?offset=${offset}` : ''}`,
        token:token,
    };

    // return colorCLI.error(options.url);
    function whatNeedToDo(response){
        colorCLI.succes('_mainRequestHttps ' + response.statusCode);
    }

    let updatesAsArray = [];


    return mainRequestHttps(options,whatNeedToDo).then(value=>{
        let msg = ``;

        // if(!value.ok){

        //     msg = `\t${value.error_code}\n\t${value.description}`;
        //     response.end(msg);
        //     colorCLI.error(msg);
        //     return [];
        // }

        for(let elem in value){
            
            if(elem === 'result'){

                msg += `${elem} : \n`;
                let result = value[elem];

                for(let elemInResult in result){

                    let update = result[elemInResult];

                    let updateInformation = {};

                    
                    if(update.message){
                        console.log(update);

                        updateInformation.chat_ID = update.message.from.id;
                        updateInformation.offsetID = update.update_id;
                        updateInformation.text = update.message.text;
    
                        if(update.message.entities){
                            updateInformation.isCommand = true;
                            updateInformation.CommandName = update.message.entities[0].type;
                        }else{
                            updateInformation.isCommand = false;
                        }
                        updateInformation.Fn = update.message.from.first_name;
                        updateInformation.Ln = update.message.from.last_name;
                        updateInformation.chat_message_id = update.message.message_id;
                                            
    
                        msg += `new message ::${elemInResult}\n`;
    
                        for(let option in updateInformation){
                            msg += `\t${option} : ${updateInformation[option]}\n`;
                        }
    
                        updatesAsArray.push({...updateInformation});
                    }else{
                        continue;
                    }

                    
                }
                continue
            }
            msg += `${elem} : ${value[elem]}\n`;
        }

        response.end(msg);
        return updatesAsArray;
        
    }).catch((reason=>{
        colorCLI.error('here (checkUpdates true) '+reason);
        response.end('BAD ::'+reason);
        return [];
    }))
};