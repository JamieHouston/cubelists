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
  controller.removeCube = function(item){
    jQuery.ajax({ cache: false
        , type: "DELETE" // XXX should be POST
        , dataType: "json"
        , url: "/api/" + controller.cubeType
        , data: item
        , error: showError
   });
   angular.Array.remove(controller.items,item);
  }

  controller.showData = function(data){
    if (controller.parentKey && controller.parentKey.length && controller.parentKey == data.keyName){
      controller.cube = data;
      controller.showData(data.cubes);
    } else {
      if ($.isArray(data)) {
        data.forEach(controller.showData);
      } else {
        controller.items.push(data);
      }
    }
  }

  controller.parentKey = (!!controller.params.parentKey) ? controller.params.parentKey : 'master';

  controller.newValue = "";

  controller.items = [];
  
  if (controller.parentKey == 'master'){
    controller.cube = {value: controller.cubeType, parentKey: ''};
    Api.query({cubeType: controller.cubeType}, controller.showData);
  } else {
    Api.get({keyName: controller.parentKey}, controller.showData);
  }

  return controller;
}