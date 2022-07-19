const mainRequestHttps = require('./_mainRequestHttps.js');
const colorCLI = require('../../color-cli/color.js');

module.exports = function sendMessage(token,response){
    let options = {
        url:`sendMessage?chat_id=${chatID}&text=${text}`,
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
                    msg += `\t${elemInResult} : ${result[elemInResult]}\n`;
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


module.exports =  function Updates(token,chatID,text){
    const http = require('https');

    let path = `/bot${token}/sendMessage?chat_id=${chatID}&text=${text}`;

    const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: path,
        method: 'POST',
        
    };

    

    return new Promise(function(resolve,reject){
        let timeout = setTimeout(()=>{
            console.log('time out');
            reject('time up')
        },5000);

        function deleteTimeOut(e = false){
            clearTimeout(timeout);
            if(e){
                return reject(e);
            }

            
            
        }

        const req = http.request(options, (res) => {
            deleteTimeOut();
            // console.log(`STATUS: ${res.statusCode}`);
            // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    
            res.setEncoding('utf8');
    
            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
                let finallyURL = req.protocol+'//'+req.host+req.path;
                // deleteTimeOut();
                return resolve({...JSON.parse(chunk),url:finallyURL});
            });
    
            res.on('end', () => {
                console.log('No more data in response.');
            });
        });
    
        req.on('error', (e) => {
            deleteTimeOut(e);
            console.error(`problem with request: ${e.message}`);
        });
    
        // Write data to request body
        // req.write(path);
        // req();
        console.log();
        req.end();

    })

}
