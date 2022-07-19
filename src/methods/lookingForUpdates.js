let isLooking = false;
const colorCLI = require('../../color-cli/color.js');


module.exports = function looking(res,fn){
    outsideBoolean = isLooking;
    if(isLooking){
        let msg = ' Already looking ';
        colorCLI.error(msg);
        res.end(msg);
    }
    else{
        colorCLI.succes(' start looking ');
        let ms = 2500 * 2;

        function loopOne(){
            console.log('loopOne',ms);
            fn();
            setTimeout(loopOne,ms);
        }
    
        loopOne();

        isLooking = true;
    }
    
}