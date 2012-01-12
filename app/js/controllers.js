/* App Controllers */
function ConfigController() {
}

function ChildController ($xhr){
    var self = this;

    self.key = this.params.key;

    $xhr('GET', 'api/cubes/' + self.key, function(code, data) {
        self.cube = data;
    });

}

function CubeController ($xhr){
    var self = this;


    self.newValue = "";
    self.items = [];

    $xhr('GET', 'api/cubes/', function(code, data) {
        self.items = data;
    });

    self.addCube = function(){
        if (self.newValue.length){
            var cube = {
                value: self.newValue,
                keyName: generateKey(),
                columnType: 'string',
                parentKey: null
            };

            $xhr('POST', 'api/cubes/', cube, function(code, data) {
                cube.id = data.id;
                self.items.push(cube);
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