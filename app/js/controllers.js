/* App Controllers */

function SystemController(Api){
  this.cubeType = 'system';
  
  wireEvents(this, Api);
  var self = init(this, Api);
}

function ConfigController(Api) {

  this.cubeType = 'types';
  
  wireEvents(this, Api);
  var self = init(this, Api);

  this.addCube = function(){
    createCube(self, {cubeType: self.newType.cubeValue});
    self.newValue = "";
  }
}

function ListSetupController(Api){
  this.cubeType = 'types';
  
  wireEvents(this, Api);
  var self = init(this, Api);

  Api.get({keyName:self.cubeType},function(data){
    self.types = data.cubes;
  });

  this.addCube = function(){
    createCube(self, {cubeType: self.newType.cubeValue});
    self.newValue = "";
  }
}

function ListEntryController(Api){
  this.cubeType = this.params.parentKey;

  var self = this;

  wireEvents(self, Api);

  Api.get({keyName:self.cubeType},function(data){
      self.fields = data.cubes;
  });

  $.ajax({ cache: false
      , type: "GET"
      , dataType: "json"
      , url: "/api/list/" + self.parentKey
      , error: showError
      , success: self.showData
 });

 self.addCube = function(){
    var newRow = {
      keyName: generateKey(),
      parentKey: self.parentKey,
      cubeValue: self.items.length + '',
      cubeType: self.parentKey,
      cubes: []
    };
    
    for (var i = self.fields.length - 1; i >= 0; i--) {
      var field = self.fields[i];
      var $input = $('input[name="' + field.keyName + '"]');

      if ($input.val() && $input.val().length){
        newRow.cubes.push(
          {
            parentKey: newRow.keyName,
            cubeValue: $input.val(),
            cubeType: field.keyName
          }
        );
        $input.val('');
      }
    }

    if (newRow.cubes.length){
      createCube(self, newRow);

      // temporarily don't show data
      var showData = self.showData;
      self.showData = null;
      newRow.cubes.forEach(function(cube){
        createCube(self, cube);
      });
      self.showData = showData;
    }
  }
}

function ListController (Api){
  this.cubeType = 'lists';

  wireEvents(this, Api);
  var self = init(this, Api);

  self.addCube = function(){
    if (self.newValue.length){
      createCube(controller);
      self.newValue = "";
    }
  }
}

function createCube(controller, params){
  var cube = {
      keyName: params.keyName || generateKey(),
      parentKey: params.parentKey || controller.parentKey,
      cubeType: params.cubeType || controller.cubeType,
      cubeValue: params.cubeValue || controller.newValue
  };

  $.ajax({ cache: false
      , type: "GET"
      , dataType: "json"
      , url: "/api/create"
      , data: cube
      , error: showError
      , success: controller.showData
 });

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

function wireEvents(controller, Api){
  
  controller.parentKey = (!!controller.params.parentKey) ? controller.params.parentKey : controller.cubeType;
  controller.items = [];

  controller.removeCube = function(item){
  $.ajax({ cache: false
        , type: "GET"
        , dataType: "json"
        , url: "/api/delete/" + item.keyName
        , data: item
        , error: showError
   });
   controller.items.splice($.inArray(item,controller.items),1);
  }

  controller.showData = function(data){
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
}

function init(controller, Api){

  controller.newValue = "";

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