/* App Controllers */
function ConfigController(Api) {
  function showData(data){
    if (self.parentKey && self.parentKey.length && self.parentKey == data.keyName){
      self.cube = data;
      showData(data.cubes);
    } else {
      if ($.isArray(data)) {
        data.forEach(showData);
        self.cubeType = self.cubeTypes[0];
      } else {
        self.items.push(data);
        self.cubeTypes.push(data);
      }
    }
  }
  var self = this;
  var cubeType = 'type';
  
  self.parentKey = self.params.parentKey;
  self.cubeTypes = [];
  self.items = [];

  if (self.parentKey && self.parentKey.length){
    Api.get({keyName: self.parentKey}, showData);
  } else {
    self.cube = {value:cubeType};
    Api.query({cubeType: cubeType}, showData);
  }

  this.addCube = function(){
    var cube = {
      value: self.newValue,
      keyName: generateKey(),
      cubeType: self.cubeType.keyName,
      parentKey: self.parentKey
    };

    //Api.save(cube,{cubeType:'type'});
    // TODO : make this work with api (.create or .save)
    jQuery.ajax({ cache: false
        , type: "POST" // XXX should be POST
        , dataType: "json"
        , url: "/api/" + cubeType
        , data: cube
        , error: showError
        , success: showData
   });
  }

  this.removeCube = function(item){
    jQuery.ajax({ cache: false
        , type: "DELETE" // XXX should be POST
        , dataType: "json"
        , url: "/api/" + cubeType
        , data: item
        , error: showError
   });
   
    //self.items.$remove(item);
  }
}

function ListController (Api){
  function showData(data){
    if (self.parentKey && self.parentKey.length && self.parentKey == data.keyName){
      self.cube = data;
      showData(data.cubes);
    } else {
      if ($.isArray(data)) {
        data.forEach(showData);
      } else {
        self.items.push(data);
      }
    }
  }
  var cubeType = 'list';

  var self = this;

  self.parentKey = self.params.parentKey;

  self.newValue = "";

  self.items = [];
  
  if (self.parentKey && self.parentKey.length){
    Api.get({keyName: self.parentKey}, showData);
  } else {
    self.cube = {value: cubeType};
    Api.query({cubeType: cubeType}, showData);
  }
  
  self.addCube = function(){
    if (self.newValue.length){
        var cube = {
            value: self.newValue,
            keyName: generateKey(),
            cubeType: 'string',
            parentKey: self.parentKey
        };

        // TODO : make this work with api (.create or .save)
        jQuery.ajax({ cache: false
            , type: "POST" // XXX should be POST
            , dataType: "json"
            , url: "/api/" + cubeType
            , data: cube
            , error: showError
            , success: showData
       });

        self.newValue = "";
    }
  }

  this.removeCube = function(cube){
    jQuery.ajax({ cache: false
        , type: "DELETE" // XXX should be POST
        , dataType: "json"
        , url: "/api/" + cubeType
        , data: cube
        , error: showError
   });
    self.items.$remove(item);
  }
}

function generateKey(){
  var keyChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var keyLength = 8;
  function randomString() {
      var results = '';
      for (var i=0; i<keyLength; i++){
          var randomPoz = Math.floor(Math.random() * keyChars.length);
          results += keyChars.substring(randomPoz, randomPoz+1);
      }
      return results;
  }
  return randomString();
}

function showError (xhr, ajaxOptions, thrownError){
    //alert(xhr.status);
    // TODO: throw this into the view nicely
    alert(thrownError);
}