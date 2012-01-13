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

function CubeController ($resource, $xhr){
    var self = this;


    self.newValue = "";
    self.items = [];

    var Wcf = $resource('api/cubes', {},
        {create: {method: 'POST'}}
    );
    
    self.items = Wcf.query();

    self.addCube = function(){
        if (self.newValue.length){
            var cube = {
                value: self.newValue,
                keyName: generateKey(),
                cubeType: 'string',
                parentKey: 'master'
            };

            //Wcf.save(cube);
            jQuery.ajax({ cache: false
                , type: "POST" // XXX should be POST
                , dataType: "json"
                , url: "/api/cubes"
                , data: cube
                , error: function () {
                    alert("error connecting to server");
                }
                , success: function(data) {self.items.push(data);}
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