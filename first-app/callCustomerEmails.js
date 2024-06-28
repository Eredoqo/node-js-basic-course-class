const { getRandomCustomer } = require("./utils/fixtures");

function callCustomerEmail(){
const customerEmail = getRandomCustomer();
console.log(`Sent email to: ${customerEmail.email} `)
 }


 module.exports={
 startEmailing: function(){    setInterval(callCustomerEmail, 7000);}
 }