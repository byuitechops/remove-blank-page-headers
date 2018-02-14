/*eslint-env node, es6*/

/* Module Description */

/* Put dependencies here */

/* Include this line only if you are going to use Canvas API */
const canvas = require('canvas-wrapper');

/* View available course object functions */
// https://github.com/byuitechops/d2l-to-canvas-conversion-tool/blob/master/documentation/classFunctions.md

module.exports = (course, stepCallback) => {

	/********************************
	 *          STARTS HERE         *
	 ********************************/
	canvas.getModules(course.info.canvasOU, (getModulesErr, moduleList) => {
		if (getModulesErr) {
			course.error(`Couldn't retrieve the module list`);
			stepCallback(null, course);
			return;
		}
		var manifest = course.content.find(file => {
			return file.name === 'imsmanifest.xml';
		});

		/* If grades_d2l.xml wasn't found, stop the child module */
		if (!manifest) {
			course.warning('Couldn\'t locate \'imsmanifest.xml\' for this course.');
			stepCallback(null, course);
		}

		/* Use Cheerio.js to parse through myFile to find the grading system (points (0), weights (1), or based on a custom formula(2)) */
		var descriptions = manifest.dom('organization>item');
		console.log(descriptions);
		//			if (description.length > 0)
		//		console.log(description.attr('description'));

		//		var gradingSystem = myFile.dom('configuration>grading_system').html();
	});
};
