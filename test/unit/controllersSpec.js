/* jasmine specs for controllers go here */

describe('CubeController', function(){
  var cubeController,
      $persistence,
      scope;

  beforeEach(function(){
    scope = angular.scope();
    $persistence = scope.$service('persistencejs');
    $persistence.expectfetchAll();
    cubeController = scope.$new(CubeController);
  });


  it('should ....', function() {
    //spec body
  });
});