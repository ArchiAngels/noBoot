let msg = {
    message:'',
    keyboard:false,
    keyboardTemplate:function(arrayWithNames){
        console.log(arrayWithNames)
            if(arrayWithNames.length !== 0){
                let templateTemp = [];

                for(let i = 0; i < arrayWithNames.length;i++){
                    templateTemp.push([
                        {text:encodeURIComponent(arrayWithNames[i])}
                    ])
                }

                this.keyboard = templateTemp;
            }else{
                this.keyboard = false;
            }
        }
    }


    msg.keyboardTemplate(['50 USDT','100 USDT','250 USDT','500 USDT','1000 USDT','2000 USDT']);
    console.log(msg.keyboard);