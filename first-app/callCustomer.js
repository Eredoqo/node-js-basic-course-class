const { getRandomCustomer } = require("./utils/fixtures");

function callCustomer (){
 const customer = getRandomCustomer();
 console.log(`Called customer: ${customer.name}`,)
}

 module.exports={
  startCalling: function (){setInterval(callCustomer, 5000);},
 }