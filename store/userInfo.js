let FS = require('fs');

let pathToUsers = __dirname+'/userInfo.json';
let currentLastID;

const createNewUserOptions = {
    name:'string',
    surname:'string',
    email:'string',    
}

let UserController = {
    getUsers:function(){
        let readedFile = FS.readFileSync(pathToUsers).toString();
            readedFile = JSON.parse(readedFile);
        return readedFile;
    },
    setUsers:function(obj){
        let newFileData = JSON.stringify(obj);
        FS.writeFileSync(pathToUsers,newFileData)
    },
    getUserByID:function(id = -1){

        let usersGlobal = this.getUsers();

        for(let i = 0; i < usersGlobal.users.length;i++){

            if(usersGlobal.users[i].userID === id){

                return {userGlobals:usersGlobal,user:usersGlobal.users[i],idx:i};
            }

        }
        console.log('no user with id::'+id);
        return -1
    },
    updateUserByID:function(id,options){

        let users = this.getUserByID(id);

        if(users === -1){
            return -1
        }
        let user = users.user;
    
        
    
        user = {...user,...options};
    
        users.userGlobals.users[users.idx] = {...user};
    
        this.setUsers({...users.userGlobals});
    
    
    },
    createNewUser:function(options = createNewUserOptions){
        let newUSER = {...options};
            newUSER.userID = this.getID();
        return newUSER
    
    },
    addNewuser:function(objUser){

        let usersBefore = this.getUsers();
            usersBefore.lastId = currentLastID;
            usersBefore.users.push(objUser);
        this.setUsers(usersBefore);
    
        let newUsers = this.getUsers();
        console.log(newUsers);
    
    },
    createAndSaveUser:function(options = createNewUserOptions){
        let newUser = this.createNewUser(options);
        this.addNewuser(newUser);
    },
    getID:function (){
        let id = this.getUsers();
            id = id.lastId;
            id += 1;
    
            currentLastID = id;
        return id;
    },
};

module.exports = UserController;

function __initDB(){
    let copy = { 
        users: [ { name: 'firstGuyName',surname:"firstGuySurname", email: 'firstGuy.mail.com',userID:0 } ], 
        lastId: 0
    };
    
    UserController.setUsers(copy);
}


function text_add(){
    let anotherMe = this.createNewUser({name:"NoNameGuy",surname:"NoNameGuy",email:"NoNameGuy@mail.co"});
    UserController.addNewUserToJSON(anotherMe);
}