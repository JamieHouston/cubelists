/* App Controllers */

function SystemController(Api){
  this.cubeType = 'system';
  
  var self = init(this, Api);
}

function ConfigController(Api) {

  this.cubeType = 'types';
  
  var self = init(this, Api);

  this.addCube = function(){
    var cube = {
      cubeValue: self.newValue,
      keyName: generateKey(),
      cubeType: self.newType.keyName,
      parentKey: self.parentKey
    };
    
    jQuery.ajax({ cache: false
        , type: "GET"
        , dataType: "json"
        , url: "/api/create"
        , data: cube
        , error: showError
        , success: self.showData
   });

   self.newValue = "";
  }
}

function ListController (Api){
  this.cubeType = 'lists';
  var self = init(this, Api);

  self.addCube = function(){
    if (self.newValue.length){
        var cube = {
            cubeValue: self.newValue,
            keyName: generateKey(),
            cubeType: 'string',
            parentKey: self.parentKey
        };

        jQuery.ajax({ cache: false
            , type: "GET"
            , dataType: "json"
            , url: "/api/create"
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
        , type: "DELETE"
        , dataType: "json"
        , url: "/api/" + controller.cubeType
        , data: item
        , error: showError
   });
   controller.items.splice($.inArray(item,controller.items),1);
  }

  controller.showData = function(data){
    //if (controller.parentKey && controller.parentKey.length && controller.parentKey == data.keyName){
    if (data.cubes){
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

  controller.parentKey = (!!controller.params.parentKey) ? controller.params.parentKey : controller.cubeType;

  controller.newValue = "";

  controller.items = [];
  
  if (controller.parentKey == 'master'){

    // cube value is displayed as header... for master just showing type
    var headerName = controller.parentKey + ' ' + controller.cubeType;
    controller.cube = {cubeValue: headerName, parentKey: ''};

    Api.query({cubeType: controller.cubeType}, controller.showData);

  } else {
    Api.get({keyName: controller.parentKey}, controller.showData);
  }

  return controller;
}