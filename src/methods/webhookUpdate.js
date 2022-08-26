

function asnwerUpdate(update){




        let msg = ``;

        let updateInformation = {};

                    
        if(update.message){
            console.log(update);

            updateInformation.chat_ID = update.message.from.id;
            updateInformation.offsetID = update.update_id;
            updateInformation.text = update.message.text;

            if(update.message.entities){
                let text = updateInformation.text.includes('id');
                let commandName = update.message.entities[0].type;
                if(text){
                    let phoneEvent = commandName === 'phone_number';
                    let emailEvent = commandName === 'email'
                    if(phoneEvent || emailEvent){
                        updateInformation.isCommand = false;
                    }
                }else{
                    updateInformation.isCommand = true;
                    updateInformation.CommandName = commandName;
                }
            }else{
                updateInformation.isCommand = false;
            }
            updateInformation.Fn = update.message.from.first_name;
            updateInformation.Ln = update.message.from.last_name;
            updateInformation.chat_message_id = update.message.message_id;
                                

            for(let option in updateInformation){
                msg += `\t${option} : ${updateInformation[option]}\n`;
            }
        }
            
        console.log(msg);
        return updateInformation;
        



}

module.exports = {asnwerUpdate}