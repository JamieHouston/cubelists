angular.formatter('keyname', {
	parse: function(value){
		return 'instance:' + keypath;
	},
	format: function(value){
		return value.substring(value.indexOf(':'));
	}
});