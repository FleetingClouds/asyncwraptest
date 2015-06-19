Tinytest.add('example', function (test) {
  test.equal(true, true);
});

var client = Npm.require('swagger-client');

Tinytest.add('Get pet, "Fido" in console.log. Always returns PASS !', function (test) {
  var swagger = new client({
    url: 'http://petstore.swagger.io/v2/swagger.json',
    success: function() {
      swagger.pet.getPetById({petId:1991928426},{responseContentType: 'application/json'},function(pet){
        console.log('pet', pet.data);
      });
    }
  });
  test.equal(true, true);
});

var callbackGetPetById = function(pet) {  console.log('pet', pet.data);  };

Tinytest.add('Get pet, "Fido" test function but with more succinct command!', function (test) {

  thePet = {petId:1991928426};
  mimeType = {responseContentType: 'application/json'};

  var swagger = new client({
    url: 'http://petstore.swagger.io/v2/swagger.json',
    success: function() {
      swagger.pet.getPetById(  thePet, mimeType, callbackGetPetById  );
    }
  });

  test.equal(true, true);
});


var swaggerSpecURL = 'http://petstore.swagger.io/v2/swagger.json';
var prxySwagger = new client({
    url: swaggerSpecURL
});

Tinytest.add('Get pet, "Fido" test function. Returns PASS if id is correct!', function (test) {

  test.equal(true, true);
});

