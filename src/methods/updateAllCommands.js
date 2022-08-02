const mainRequestHttps = require('./_mainRequestHttps.js');
const colorCLI = require('../../color-cli/color.js');
let getAllCommands = require('../commands/_mainCommandBuilder.js');

const path = __dirname + '/../commands';
let userCommandPath = path + '/commandsName';
let adminCommandPath = path + '/commandAdminName';

module.exports = async function updateAllCommands(token,response){

    let users = await getAllCommands(userCommandPath);
    let admins = await getAllCommands(adminCommandPath);
    
    let allCommands = [...users,...admins];
    

    _updaterContainer(allCommands,token,response);
    
};

async function _updaterContainer(allCommands,token,response){
    

    for(let i=0; i < allCommands.length;i++){
        allCommands[i].description = encodeURIComponent(allCommands[i].description);
        allCommands[i].command = encodeURIComponent(allCommands[i].command)
    }

    let commandsAsJson = JSON.stringify(allCommands);

    let options = {
        url:`setMyCommands?commands=${commandsAsJson}`,
        token:token,
    };

    function whatNeedToDo(response){
        colorCLI.succes('_mainRequestHttps ' + response.statusCode);
    }

    return mainRequestHttps(options,whatNeedToDo,timeOut = 20000).then(value=>{
        colorCLI.succes(value.ok);
        response.end(`RESPONSE :: ${value.ok}`);
    }).catch((reason=>{
        colorCLI.error('here (updateAllCommands) '+reason);
        response.end('BAD ::'+reason);
        return [];
    }));
}