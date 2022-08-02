const FS = require('fs');
const colorCLI = require('../../color-cli/color.js');
let pathDirectory = '';

module.exports = function getCommandsAsArray(path){
    pathDirectory = path;
    return readDirectoryCommands().then(async files=>{
        let commands = [];
        for(let i = 0; i < files.length;i++){
            // console.log(files[i]);
            commands.push(await getCommand(files[i]))
        }
        // console.log(commands);
        return commands;
    }).catch(err=>{
        colorCLI.error(err);
        return [];
    })
}

function readDirectoryCommands(){

    return asyncLoop((stop,resolve)=>{
        FS.readdir(pathDirectory,(err,files)=>{
            stop();
            if(err){
                colorCLI.error(err);
                colorCLI.error(pathDirectory);
                return -1;
            }
    
            // colorCLI.succes(files.length);
    
            resolve(files);
        })
    })
}

function getCommand(nameCommand = '404'){
    if(nameCommand === '404'){
        colorCLI.error('name Command must be provided');
        return 0
    }

    let pathToCommand = pathDirectory + '/' + nameCommand;

    return asyncLoop((stop,resolve)=>{
        
        let outWrittenCommand = require(pathToCommand);
        stop();
        // colorCLI.succes(Object.keys(outWrittenCommand));
        resolve(outWrittenCommand);
    })

    
}

function asyncLoop(callback){
    return new Promise(function(resolve,reject){
        let timer = setTimeout(()=>{
            reject('time out')
        },5000);

        function deleteTimer(e){

            clearTimeout(timer);

            if(e){
                reject(e);
            }

        }

        callback(deleteTimer,resolve);

        
    })
}