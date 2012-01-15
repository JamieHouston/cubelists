/* App Controllers */
function ConfigController(Api) {
  var self = this;

  self.cubeTypes = [{value:'string', keyName:'t1'}, {value:'number', keyName:'t2'},{value:'date',keyName:'t3'}];
  self.cubeType = self.cubeTypes[1];

  this.addType = function(){
    var cube = {
      value: self.newValue,
      keyName: generateKey(),
      cubeType: self.cubeType.keyName,
      parentKey: 'master'
    };
  }
}

function ChildController ($xhr){
    var self = this;

    self.keyName = this.params.keyName;

    $xhr('GET', 'api/cubes/' + self.keyName, function(code, data) {
        self.cube = data;
    });
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

  function showError (xhr, ajaxOptions, thrownError){
      //alert(xhr.status);
      // todo: throw this into the view nicely
      alert(thrownError);
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
            cubeType: 'string',
            parentKey: self.parentKey
        };

        //Wcf.save(cube);
        jQuery.ajax({ cache: false
            , type: "POST" // XXX should be POST
            , dataType: "json"
            , url: "/api/cubes"
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