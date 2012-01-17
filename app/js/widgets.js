/* http://docs.angularjs.org/#!angular.widget */
angular.widget('cube:link', function(compileElement){
  compileElement.text('here it is');
  return function(linkElement){
      linkElement.text('parent is {{parentKey}}');
      angular.compile(linkElement);
  };
});