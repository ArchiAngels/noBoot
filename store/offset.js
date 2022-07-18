const FS = require('fs');
const PATH = require('path');
let direction = '/offset.txt';

let path = PATH.join(__dirname,direction);
// console.log(path);

module.exports = {
    getOffset: function(){
        let a = FS.readFileSync(path,(err,value)=>{
            if(err) {
                console.log(err);
                return -1
            };

            // console.log("VALUE::",value);
        })

        return a +'';
    },

    getAsInt: function(){
        let cache = this.getOffset();
        // console.log('INT::',cache);
        return parseInt(cache);
    },

    increaseState: function(){
        let prev_state = this.getAsInt();

        let new_state = prev_state + 1 + '';

        this.setState(new_state);
    },

    decreaseState: function(){
        let prev_state = this.getAsInt();

        let new_state = prev_state - 1 + '';

        this.setState(new_state);
    },

    setState: function(newState){
        // console.log('newSTATE',newState);
        FS.writeFileSync(path,newState,'utf-8',(err)=>{
            if(err) return -1;
        });
    }
}