/* App Controllers */
function ConfigController() {
}

function ChildController (persistencejs){
    var self = this;

    self.key = this.params.key;

    self.load = function(){
        self.cube = persistencejs.get(self);
    }

    self.load();
}

function CubeController ($xhr){
    var self = this;


    self.newValue = "";
    self.items = [];
    
    $xhr('JSON', 'http://localhost:27080/cube/cube/_find', function(code, data) {
        self.items = JSON.parse(data.results);
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