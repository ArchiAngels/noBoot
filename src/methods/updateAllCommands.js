const mainRequestHttps = require('./_mainRequestHttps.js');
const colorCLI = require('../../color-cli/color.js');
let getAllCommands = require('../commands/allCommands.js');

const path = __dirname + '/../commands/commands';

module.exports = async function updateAllCommands(token,response){
    let allCommands = await getAllCommands(path);

    // console.log(allCommands[0]);

    for(let i=0; i < allCommands.length;i++){
        allCommands[i].description = allCommands[i].description.replace(/\s/g,'%20');
        allCommands[i].command = allCommands[i].command.replace(/\s/g,'%20');
    }

    let commandsAsJson = JSON.stringify(allCommands)

    let options = {
        url:`setMyCommands?commands=${commandsAsJson}`,
        token:token,
    };

    // return colorCLI.error(options.url);

    function whatNeedToDo(response){
        colorCLI.succes('_mainRequestHttps ' + response.statusCode);
    }

    return mainRequestHttps(options,whatNeedToDo).then(value=>{
        colorCLI.succes(value.ok);
        response.end(`RESPONSE :: ${value.ok}`);
    }).catch((reason=>{
        colorCLI.error('here '+reason);
        response.end('BAD ::'+reason);
        return [];
    }));
};