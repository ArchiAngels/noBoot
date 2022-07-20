const colorCLI = require('../../color-cli/color.js');

module.exports = function mainRequestHttps(options = {},fn){
    const http = require('https');

    let isAllOptions = isAllPropertiesArePassed(options);

    
    if(!isAllOptions){        
        throw new Error(colorCLI.error(' Options are required ',false));
    }

    options = customPropertiesObj(options);
    

    return new Promise(function(resolve,reject){
        let timeout = setTimeout(()=>{
            console.log('mainRequestHttps __ time out');
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

            fn(res);
    
            res.setEncoding('utf8');
    
            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
                let finallyURL = req.protocol+'//'+req.host+req.path;
                // deleteTimeOut();
                return resolve({...JSON.parse(chunk),url:finallyURL});
            });
    
            res.on('end', () => {
                colorCLI.warning('No more data in response.');
            });
        });
    
        req.on('error', (e) => {
            deleteTimeOut(e);
            colorCLI.error(`problem with request: ${e.message}`);
        });
    
        // Write data to request body
        // req.write(path);
        // req();
        console.log();
        req.end();

    })

}

function customPropertiesObj(options){
    let path = `/bot${options.token}/${options.url}`;
    return {
        hostname: 'api.telegram.org',
        port: 443,
        path: path,
        method: options.method || 'GET',
    }
}

function isAllPropertiesArePassed(obj){
    // console.log('start parsing');
    let requiredOptions = ['url','token'];
    let count = requiredOptions.length;
    let result = false;

    if(Object.keys(obj).length === 0){
        result = false;
        return result;
    }

    for(let elem in obj){
        if(requiredOptions.includes(elem)){
            count -= 1;
            // console.log(elem,count);
        }
    }

    result = count > 0 ? false : true;
    // console.log('finish parsing', result);
    return result;

}