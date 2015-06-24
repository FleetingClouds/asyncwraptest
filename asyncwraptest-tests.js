Tinytest.add('example', function (test) {
  test.equal(true, true);
});

var Swagger = Npm.require('swagger-client');

var swaggerSpecURL = 'http://petstore.swagger.io/v2/swagger.json';

Tinytest.add('Get "Fido" in console.log. Always returns PASS !', function (test) {
  var swagger = new Swagger({
    url: swaggerSpecURL,
    success: function() {
      swagger.pet.getPetById({petId:1991928426},{responseContentType: 'application/json'},function(pet){
        console.log('pet', pet.data);
      });
    }
  });
  test.equal(true, true);
});
/*  ~      ~      ~      ~      ~      ~      ~      ~      ~    */


var aPet = {petId:1991928426};
var mimeType = {responseContentType: 'application/json'};
var callbackGetPetById = function(pet) {  console.log('pet', pet.data);  };

Tinytest.add('Get "Fido" test function but with more succinct command!', function (test) {

  var swagger = new Swagger({
    url: swaggerSpecURL,
    success: function() {
      swagger.pet.getPetById(  aPet, mimeType, callbackGetPetById  );
      swagger.store.getOrderById.help()
    }
  });

  test.equal(true, true);
});
/*  ~      ~      ~      ~      ~      ~      ~      ~      ~    */



var getSwaggerProxy = Meteor._wrapAsync( function (swaggerSpecURL, callback) {
  var prxySwagger = new Swagger({
      url: swaggerSpecURL
    , success : function() {
        callback(null, prxySwagger);
      }
    , error : function() {
        callback(null, prxySwagger);
      }
  });
});

var swagger = getSwaggerProxy(swaggerSpecURL);

var getPetById = function (arguments, headers, success, error) {
  swagger["pet"]["getPetById"](
      arguments
    , headers
    , function ( theResult ) {  success(null, theResult);  }
    , function (  theError ) {    error(null, theError );  }
  )
}

var wrappedGetPetById = Meteor._wrapAsync(  getPetById  );


Tinytest.add('Get "Fido" test function ::  Try with Async.wrap()!', function (test) {

  var jsonPet = wrappedGetPetById ( aPet, mimeType );
  var pet = JSON.parse(jsonPet.data)
  console.log('pet', pet); 
  test.equal(pet.name, "Fido");
});
/*  ~      ~      ~      ~      ~      ~      ~      ~      ~    */

var getSwaggerProxy = Meteor._wrapAsync( function (swaggerSpecURL, callback) {
  var prxySwagger = new Swagger({
      url: swaggerSpecURL
    , success : function() {
        callback(null, prxySwagger);
      }
    , error : function() {
        callback(null, prxySwagger);
      }
  });
});

var swagger = getSwaggerProxy(swaggerSpecURL);

var wrappedGetPetById = Meteor._wrapAsync(  
  function (arguments, headers, success, error) {
    swagger["pet"]["getPetById"](
        arguments
      , headers
      , function ( theResult ) {  success(null, theResult);  }
      , function (  theError ) {    error(null, theError );  }
    )
  }
);


Tinytest.add('Get "Fido" test function ::  Try with Async.wrap() succinct!', function (test) {

  var jsonPet = wrappedGetPetById ( aPet, mimeType );
  var pet = JSON.parse(jsonPet.data)
  console.log('pet', pet); 
  test.equal(pet.name, "Fido");

});

/*  ~      ~      ~      ~      ~      ~      ~      ~      ~    */


var getUserByName = function (arguments, headers, success, error) {
  swagger["user"]["getUserByName"](
      arguments
    , headers
    , function ( theResult ) {  console.log("xxxx returning success result (single) xxxx"); success(null, theResult);  }
    , function (  theError ) {  console.log("zzzz returning  error  result (single) zzzz");   error(null, theError);  }
  )
}

var wrappedGetUserByName = Meteor._wrapAsync(  getUserByName  );
var theUser = {username: "bob"};
Tinytest.add('Get user, "Bob" test function with Async.wrap()!', function (test) {

  var jsonUser = wrappedGetUserByName ( theUser, mimeType );
  var usr = JSON.parse(jsonUser.data)
  console.log('usr', usr); 
  test.equal(usr.username, "bob");
});
/*  ~      ~      ~      ~      ~      ~      ~      ~      ~    */

function getMethodsByEntities(host) {
   return {"user":["getUserByName", "foo", "xhuxk"], "pet":["getPetById", "bar"], "store":["getOrderById", "bloo"]}
}

function wrapIt( asyncEntities, nameEntity, nameMethod, entity ) {

  asyncEntities[nameEntity][nameMethod] = Meteor._wrapAsync(
      function (arguments, headers, success, error) {
        entity[nameMethod](
            arguments
          , headers
          , function ( theResult ) {  console.log("xxxx returning success result (multiple) xxxx"); success(null, theResult);  }
          , function (  theError ) {  console.log("zzzz returning  error  result (multiple) zzzz");   error(null, theError);  }
        )
      }
  );
}

function collectMethods(host, mode) {
  var entity_methods = getMethodsByEntities(host);
  var collectedMethods = {}
  for (elem in host) {
    console.log( "    ..    ..    ..    ..    ..    ..    ..    ..    ..    ..    ..    ..    ..    ..    .." );
    if ("object" === typeof host[elem]  && entity_methods.hasOwnProperty(elem)) {
      var entity = host[elem];
      var required_methods = entity_methods[elem];
      collectedMethods[elem] = {}
//      console.log('\n\nEntity :: ' + entity );
      for (idx in required_methods) {
        var nameMethod = required_methods[idx];
        console.log(">>>>>> " + nameMethod + " >> " + entity[nameMethod]);
        if ("function" === typeof entity[nameMethod]) {
          _self = this;
          console.log( "entity method is " +  nameMethod);
          console.log( entity[nameMethod] );
          if (mode === "async") {

            collectedMethods[elem][nameMethod] = entity[nameMethod]

          } else if (mode === "sync") {

            wrapIt(collectedMethods, elem, nameMethod, entity);
          } else {
            console.log( "bad mode" );
          }
        }
      }
    };
  };
  return collectedMethods
};

Tinytest.add('Get "Fido" test function ::  Try with Async.wrap() around pointer to function !', function (test) {

  var asynchronous_functions = collectMethods(swagger, "async");
  var asyncGetPetById = function (arguments, headers, done) {
    asynchronous_functions["pet"]["getPetById"](
        arguments
      , headers
      , function ( theResult ) {  done(null, theResult);  }
      , function (  theError ) {  done(null,  theError);  }
    )
  }

  var getPetById = Meteor._wrapAsync(  asyncGetPetById  );

  var jsonPet = getPetById ( aPet, mimeType );
  var pet = JSON.parse(jsonPet.data)
  console.log('pet', pet); 
  test.equal(pet.name, "Fido");
});

/*  ~      ~      ~      ~      ~      ~      ~      ~      ~    */

Tinytest.add('Get "Fido" test function ::  Try with Async.wrap() around anonymous pointer to function !', function (test) {

  var asynchronous_functions = collectMethods(swagger, "async");

  var getPetById = Meteor._wrapAsync(  function (arguments, headers, success, error) {
    asynchronous_functions["pet"]["getPetById"](
        arguments
      , headers
      , function ( theResult ) {  success(null, theResult);  }
      , function (  theError ) {  error(null,  theError);  }
    )
  });

  var jsonPet = getPetById ( aPet, mimeType );
  var pet = JSON.parse(jsonPet.data)
  console.log('pet', pet); 
  test.equal(pet.name, "Fido");
});

/*  ~      ~      ~      ~      ~      ~      ~      ~      ~    */
/*                PASS functions above  ^ ^ ^                    */
/*                FAIL functions below  . . .                    */
/*  ~      ~      ~      ~      ~      ~      ~      ~      ~    */

var theOrder = {orderId: 11};

Tinytest.add('Get "S.O. #11" test function ::  Try with one of several bulk pre-wrapped functions !', function (test) {

  var synchronous_functions = collectMethods(swagger, "sync");

  var jsonOrder = synchronous_functions["store"]["getOrderById"] ( theOrder, mimeType );
  var order = JSON.parse(jsonOrder.data)
  console.log('order', order); 
  test.equal(order.status, "placed");

});


//  ~      ~      ~      ~      ~      ~      ~      ~      ~    


Tinytest.add('Get "Bob" test function ::  Try with one of several bulk pre-wrapped functions !', function (test) {

  var synchronous_functions = collectMethods(swagger, "sync");

  var jsonUser = synchronous_functions["user"]["getUserByName"] ( theUser, mimeType );
  var usr = JSON.parse(jsonUser.data)
  console.log('usr', usr); 
  test.equal(usr.username, "bob");
});


//  ~      ~      ~      ~      ~      ~      ~      ~      ~    


var otherPet = {petIc:1991928426};
Tinytest.add('Get "Fido" test function ::  Try with one of several bulk pre-wrapped functions !', function (test) {

  var synchronous_functions = collectMethods(swagger, "sync");

  var jsonPet = synchronous_functions["pet"]["getPetById"] ( otherPet, mimeType );
  var pet = JSON.parse(jsonPet.data)
  console.log('pet', pet); 
  test.equal(pet.name, "Fido");
});

/*  ~      ~      ~      ~      ~      ~      ~      ~      ~    */
/*  ~      ~      ~      ~      ~      ~      ~      ~      ~    */


