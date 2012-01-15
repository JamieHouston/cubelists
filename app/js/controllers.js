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

  self.cubeTypes = [];
  self.items = [];

  Api.query(
    {cubeType: 'type'}, 
    showData
  );

  this.addType = function(){
    var cube = {
      value: self.newValue,
      keyName: generateKey(),
      cubeType: self.cubeType.keyName,
      parentKey: 'master'
    };

    //Api.save(cube,{cubeType:'type'});
    // TODO : make this work with api (.create or .save)
    jQuery.ajax({ cache: false
        , type: "POST" // XXX should be POST
        , dataType: "json"
        , url: "/api/type"
        , data: cube
        , error: showError
        , success: showData
   });
  }

  this.removeType = function(item){
    jQuery.ajax({ cache: false
        , type: "DELETE" // XXX should be POST
        , dataType: "json"
        , url: "/api/type"
        , data: item
        , error: showError
        , success: showData
   });
    self.items.$remove(item);
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

  var self = this;

  self.parentKey = self.params.parentKey;

  self.newValue = "";

  self.items = [];
  
  if (self.parentKey && self.parentKey.length){
    Api.get({keyName: self.parentKey}, showData);
  } else {
    self.cube = {value:"Lists"};
    Api.query(showData);
  }
  
  self.addCube = function(){
    if (self.newValue.length){
        var cube = {
            value: self.newValue,
            keyName: generateKey(),
            cubeType: 'string', // TODO: pass correct cubeType here
            parentKey: self.parentKey
        };

        // TODO : make this work with api (.create or .save)
        jQuery.ajax({ cache: false
            , type: "POST" // XXX should be POST
            , dataType: "json"
            , url: "/api/list"
            , data: cube
            , error: showError
            , success: showData
       });

        self.newValue = "";
    }
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