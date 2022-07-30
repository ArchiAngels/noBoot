module.exports = function support(){
    let MAIN_EMAIL = process.env.support_EMAIL;
    console.log(MAIN_EMAIL);
    return {message:MAIN_EMAIL}
}