const customerList = [
    {
        name: "Custome 1",
        cel: "123456789",
        email: "example1@test1.com"
    }, {
        name: "Custome 2",
        cel: "123456789",
        email: "example1@test2.com"
    }, {
        name: "Custome 3",
        cel: "123456789",
        email: "example1@test3.com"
    }, {
        name: "Custome 4",
        cel: "123456789",
        email: "example1@test4.com"
    }]

function getRandomCustomer() {
  const index = Math.floor(Math.random() * customerList.length);
  return customerList[index];
}

 module.exports= {
getRandomCustomer
 }
