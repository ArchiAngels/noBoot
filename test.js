function getw(){
    const http = require('http');

    let objMess = {
        "update_id":10000,
        "message":{
        "date":1441645532,
        "chat":{
            "last_name":"Test Lastname",
            "id":1111111,
            "first_name":"Test",
            "username":"Test"
        },
        "message_id":1365,
        "from":{
            "last_name":"Test Lastname",
            "id":1111111,
            "first_name":"Test",
            "username":"Test"
        },
        "text":"/start"
        }
    }

    const postData = JSON.stringify(
        objMess
    );

    const options = {
    host: 'localhost',
    port: 8080,
    path: '/update',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
    };

    const req = http.request(options);

    req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
    });

    req.write(postData);
    req.end();

    console.log('Send')
}

getw();
// module.exports  ={getw}