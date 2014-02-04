(function() {
	'use strict';

var app = angular.module('jsondiff', []);

app.controller('DiffCtrl', function($scope) {
	$scope.diffLines = [];
	$scope.jsonA = "";
	$scope.jsonB = "";

	function updateDiff() {
		var lines = [];

		function recur(key, depth, lval, rval) {
			var lisobj = typeof lval == 'object';
			var risobj = typeof rval == 'object';

			if (lval || lisobj || rval || risobj) {
				var line = {
					key: key,
					depth: depth,
					valueA: lisobj ? '' : JSON.stringify(lval),
					valueB: risobj ? '' : JSON.stringify(rval)
				};

				if (typeof lval == 'undefined' &&
					typeof rval != 'undefined') {
					line.diffType = 'added';
				} else if (typeof lval != 'undefined' &&
				           typeof rval == 'undefined') {
					line.diffType = 'removed';
				} else if (!(lisobj && risobj) && lval != rval) {
					line.diffType = 'changed';
				}

				lines.push(line);
			}

			var lkeys = lval && lisobj && Object.keys(lval) || [];
			var rkeys = rval && risobj && Object.keys(rval) || [];
			var keys = _.union(lkeys, rkeys);

			_.each(keys, function(key) {
				recur(key, depth + 1,
				      lval && lisobj ? lval[key] : undefined,
				      rval && risobj ? rval[key] : undefined);
			});
		}

		var left = null;
		var right = null;

		try { left  = JSON.parse($scope.jsonA); } catch(e) {}
		try { right = JSON.parse($scope.jsonB); } catch(e) {}
		recur('', 0, left, right);
		$scope.diffLines = lines;
	}

	$scope.$watch('jsonA', updateDiff);
	$scope.$watch('jsonB', updateDiff);
});

}());