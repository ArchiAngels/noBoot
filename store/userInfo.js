let FS = require('fs');
const colorCLI = require('../color-cli/color');

let pathToUsers = __dirname+'/userInfo.json';
let currentLastID;

const createNewUserOptions = {
    name:'string',
    surname:'string',
    email:'string',
    roomID:'integer',
    fillFormState:0,
    
    // FORM__CODE  
    // WISE INFORMATION
    // {0} - enter name and surname
    // {1} - enter email
    // {2} - choose payment amount
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
    saveChanges:function(userGlobals,needToSave = {}){

        userGlobals.userGlobals.users[userGlobals.idx] = {...needToSave};    
        this.setUsers({...userGlobals.userGlobals});

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

        this.saveChanges(users,user);
    
        // users.userGlobals.users[users.idx] = {...user};
    
        // this.setUsers({...users.userGlobals});
    
    
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
    getUserByRoomID(id = -1){
        let usersGlobal = this.getUsers();

        for(let i = 0; i < usersGlobal.users.length;i++){

            if(usersGlobal.users[i].roomID === id){

                return {userGlobals:usersGlobal,user:usersGlobal.users[i],idx:i};
            }

        }
        console.log('no user with id::'+id);
        return -1
    },
    addUserFirstAndLastNames:function(roomID =-1,firstName ='string',lastName='string'){
        let userGlobals = this.getUserByRoomID(roomID);


        let user = {
            name:firstName,
            surname:lastName,
            roomID:roomID,
            fillFormState:1,
            userID:this.getID(),
        }         
        
        this.saveChanges(userGlobals,user);
        // userGlobals.userGlobals.users[userGlobals.idx] = {...user};
    
        // this.setUsers({...userGlobals.userGlobals});

        colorCLI.succes('Add name and lastanme');
        console.log(this.getUsers());

    },
    addUserEmail:function(roomID = -1,email = 'string'){
        let userGlobals = this.getUserByRoomID(roomID);

        if(userGlobals === -1){
            console.log("no find a user with this id");
        }else{

            let user = userGlobals.user;
                user.email = email;
                user.fillFormState = 2;

            this.saveChanges(userGlobals,user);

            // userGlobals.userGlobals.users[userGlobals.idx] = {...user};
    
            // this.setUsers({...userGlobals.userGlobals});
        }
    },
    deleteuserFromList:function(roomID = -1){
        let userGlobals = this.getUserByRoomID(roomID);

        if(userGlobals === -1){
            console.log("no find a user with this id");
        }else{



            userGlobals.userGlobals.users.splice(userGlobals.idx,1);

            this.saveChanges(userGlobals,userGlobals);
    
            // this.setUsers({...userGlobals.userGlobals});
        }
    },
    initEmptyUser:function(roomID = -1){
        let userGlobals = this.getUserByRoomID(roomID);

        if(userGlobals === -1){
            this.createAndSaveUser({roomID:roomID,fillFormState:0});
        }
        
    },
    userAcceptRules:function(roomID = -1){
        let userGlobals = this.getUserByRoomID(roomID);

        if(userGlobals === -1){
            console.log("no find a user with this id");
        }else{

            let user = userGlobals.user;
                user.acceptRules = true;
                user.fillFormState = user.fillFormState +1;

            // userGlobals.userGlobals.users[userGlobals.idx] = {...user};

            this.saveChanges(userGlobals,user);

            colorCLI.succes("USER HAS ACCEPT RULES",user.fillFormState);
    
            // this.setUsers({...userGlobals.userGlobals});
        }
    },
    addPossibleTransaction:function(roomID = -1,amount){
        let userGlobals = this.getUserByRoomID(roomID);

        if(userGlobals === -1){
            console.log("no find a user with this id");
        }else{

            let user = userGlobals.user;
                user.possibleTransaction = user.possibleTransaction ? user.possibleTransaction : [];
                user.possibleTransaction.push(amount);

                user.fillFormState = user.fillFormState +1;

            this.saveChanges(userGlobals,user);

            // userGlobals.userGlobals.users[userGlobals.idx] = {...user};
    
            // this.setUsers({...userGlobals.userGlobals});
        }
    },
    generatePossibleTransactionHash:function(roomID = -1){
        let userGlobals = this.getUserByRoomID(roomID);

        if(userGlobals === -1){
            console.log("no find a user with this id");
        }else{

            let Hash = `${userGlobals.user.roomID}/${userGlobals.user.possibleTransaction[0]}`;
            return Hash;
        }
    },
    makeNewTransaction:function(roomID = -1){
        let userGlobals = this.getUserByRoomID(roomID);

        if(userGlobals === -1){
            console.log("no find a user with this id");
        }else{

            let user = userGlobals.user;

            user.fillFormState = 2;
            user.way = 1;

            this.saveChanges(userGlobals,user);

            // userGlobals.userGlobals.users[userGlobals.idx] = {...user};
    
            // this.setUsers({...userGlobals.userGlobals});
        }
    },
    transactionSuccesfullyGoes:function(roomID = -1){
        let userGlobals = this.getUserByRoomID(roomID);

        if(userGlobals === -1){
            console.log(userGlobals);
            console.log("no find a user with this id");
        }else{

            let user = userGlobals.user;

            user.fillFormState = 6;
            user.succesfullyTransactions = user.succesfullyTransactions? user.succesfullyTransactions : [];
            let possibleTransaction = user.possibleTransaction.splice(user.orderIdx,1)[0];
            user.succesfullyTransactions.push(possibleTransaction);

            user.orderIdx = 0;

            this.saveChanges(userGlobals,user);

            return {amount:possibleTransaction};

            // userGlobals.userGlobals.users[userGlobals.idx] = {...user};
    
            // this.setUsers({...userGlobals.userGlobals});
        }
    },
    transactionFailureGoes:function(roomID = -1){
        let userGlobals = this.getUserByRoomID(roomID);

        if(userGlobals === -1){
            console.log(userGlobals);
            console.log("no find a user with this id");
        }else{

            let user = userGlobals.user;

            user.fillFormState = 7;
            user.badTransactions = user.badTransactions? user.badTransactions : [];
            let badTransaction = user.possibleTransaction.splice(user.orderIdx,1)[0];
            user.badTransactions.push(badTransaction);

            user.orderIdx = 0;

            this.saveChanges(userGlobals,user);

            return {amount:badTransaction};
        }
    },

    isUserHaveNameAndSurname:function(roomID = -1){
        let userGlobals = this.getUserByRoomID(roomID);
        let result = {
            name:false,
            surname:false
        }


        if(userGlobals === -1){
            console.log("no find a user with this id");
        }else{

            let user = userGlobals.user;

            user.name ? result.name = true : 0;
            user.surname ? result.surname = true : 0;
        }

        return result.name && result.surname;
    },
    isUserHaveEmail:function(roomID = -1){
        let userGlobals = this.getUserByRoomID(roomID);
        let result = {
            email:false,
        }


        if(userGlobals === -1){
            console.log("no find a user with this id");
        }else{

            let user = userGlobals.user;

            user.email ? result.email = true : 0;
        }

        return result.email;
    },
    setUserFillFormState:function(roomID = -1,newState = 0){
        let userGlobals = this.getUserByRoomID(roomID);


        if(userGlobals === -1){
            console.log("no find a user with this id");
        }else{

            let user = userGlobals.user;

            user.fillFormState = newState;

            this.saveChanges(userGlobals,user);
        }

        
    },
    setAdmin:function(roomID = -1,admin = false){

        let userGlobals = this.getUserByRoomID(roomID);

        if(userGlobals === -1){
            console.log('No user with that id');   
        }else{
            let user = userGlobals.user;

            user.isAdmin = admin;
            user.way = 2;

            if(admin){
                user.adminState = 0;
            }else{
                delete user.adminState;
            }

            

            this.saveChanges(userGlobals,user);
        }
    },
    addNotifyuserAboutResultOfTransaction:function(adminRoomID = -1,userRoomID = -1,orderIdx = 0){
        colorCLI.error('add new '+orderIdx);
        let userGlobals = this.getUserByRoomID(userRoomID);
        let admin = this.getUserByRoomID(adminRoomID);
        let output = {isOK:false};

        if(admin === -1){
            console.log('adminNotFound');
            return output;
        }
        if(userGlobals === -1){
            console.log('No user with that id');   
            return output;
        }else{
            
            let admin_u = admin.user;
            admin_u.userNotify = userRoomID;
            admin_u.adminState = 1;     
            
            this.saveChanges(admin,admin_u);



            userGlobals = this.getUserByRoomID(userRoomID);
            let user = userGlobals.user;
            user.orderIdx = orderIdx; 

            this.saveChanges(userGlobals,user);


            
            output.adminState = 1;
            output.isOK = true;
        }

        return output;
    },
    sentInformation:function(roomID = -1){
        let userGlobals = this.getUserByRoomID(roomID);

        if(userGlobals === -1){
            console.log('No user with that id');   
        }else{
            let user = userGlobals.user;

            user.userNotify = '';
            user.orderIdx = 0;
            user.adminState = 2;         

            this.saveChanges(userGlobals,user);
        }
    },
    resetAdminState:function(roomID = -1){
        let userGlobals = this.getUserByRoomID(roomID);

        if(userGlobals === -1){
            console.log('No user with that id');   
        }else{
            let user = userGlobals.user;

            user.adminState = 0;         

            this.saveChanges(userGlobals,user);
        }
    },
    changeWay:function(roomID = -1,way = 1){
        let userGlobals = this.getUserByRoomID(roomID);

        if(userGlobals === -1){
            console.log('No user with that id');   
        }else{
            let user = userGlobals.user;

            user.way = way;         

            this.saveChanges(userGlobals,user);
        }
       
    }

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
    let anotherMe = UserController.createNewUser({name:"NoNameGuy",surname:"NoNameGuy",email:"NoNameGuy@mail.co"});
    UserController.addNewuser(anotherMe);
}

// __initDB();
// text_add();