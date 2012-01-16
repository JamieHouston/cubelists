/* App Controllers */
function ConfigController(Api) {

  this.cubeType = 'type';
  
  var self = init(this, Api);

  this.addCube = function(){
    var cube = {
      value: self.newValue,
      keyName: generateKey(),
      cubeType: self.newType.keyName,
      parentKey: self.parentKey
    };

    //Api.save(cube,{cubeType:'type'});
    // TODO : make this work with api (.create or .save)
    jQuery.ajax({ cache: false
        , type: "POST" // XXX should be POST
        , dataType: "json"
        , url: "/api/" + self.cubeType
        , data: cube
        , error: showError
        , success: self.showData
   });

   self.newValue = "";
  }

  this.removeCube = function(item){
    jQuery.ajax({ cache: false
        , type: "DELETE" // XXX should be POST
        , dataType: "json"
        , url: "/api/" + self.cubeType
        , data: item
        , error: showError
   });
   angular.Array.remove(self.items,item);
  }

  self.showData = function(data){
    if (self.parentKey && self.parentKey.length && self.parentKey == data.keyName){
      self.cube = data;
      self.showData(data.cubes);
    } else {
      if ($.isArray(data)) {
        data.forEach(self.showData);
        self.newType = self.items[0];
      } else {
        self.items.push(data);
      }
    }
  }

}

function ListController (Api){
  this.cubeType = 'list';
  var self = init(this, Api);

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
            , url: "/api/" + self.cubeType
            , data: cube
            , error: showError
            , success: self.showData
       });

        self.newValue = "";
    }
  }

  self.showData = function(data){
    if (self.parentKey && self.parentKey.length && self.parentKey == data.keyName){
      self.cube = data;
      self.showData(data.cubes);
    } else {
      if ($.isArray(data)) {
        data.forEach(self.showData);
      } else {
        self.items.push(data);
      }
    }
  }

  self.removeCube = function(cube){
    jQuery.ajax({ cache: false
        , type: "DELETE" // XXX should be POST
        , dataType: "json"
        , url: "/api/" + self.cubeType
        , data: cube
        , error: showError
   });
    angular.Array.remove(self.items,item);
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

function init(controller, Api){
  controller.parentKey = (!!controller.params.parentKey) ? controller.params.parentKey : 'master';

  controller.newValue = "";

  controller.items = [];
  
  if (controller.parentKey == 'master'){
    controller.cube = {value: controller.cubeType, parentKey: ''};
    Api.query({cubeType: controller.cubeType}, self.showData);
  } else {
    Api.get({keyName: controller.parentKey}, self.showData);
  }

  return controller;
}