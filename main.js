/*eslint-env node, es6*/
/*eslint no-console:1*/

/* Module Description */

/* Put dependencies here */

/* Include this line only if you are going to use Canvas API */
/*const canvas = require('canvas-wrapper'); np*/
const he = require('he');

/* View available course object functions */
// https://github.com/byuitechops/d2l-to-canvas-conversion-tool/blob/master/documentation/classFunctions.md

module.exports = (course, stepCallback) => {

    /**********************************************
     * 	getDescriptions()				  
     *  Parameters: none
     **********************************************/
    function getDescriptions() {
        var manifest = course.content.find(file => {
            return file.name === 'imsmanifest.xml';
        });

        /* If grades_d2l.xml wasn't found, stop the child module */
        if (!manifest) {
            course.warning('Couldn\'t locate \'imsmanifest.xml\' for this course.');
            stepCallback(null, course);
        }

        // var descriptionedItems = [];

        var $ = manifest.dom;
        /* Make an array of each description that isn't empty */
        $('item').each((i, eachItem) => {
            //            console.log('before encode:' + eachItem.attribs.description)
            var description = he.decode(eachItem.attribs.description);
            // if the description is not empty, check for the number of words in it
            if (description !== '') {
                //number of words in the description
                var numWords = description.split(/\s+|&nbsp;/).length;
                //if description <=5 words, append to title
                if (numWords < 6) {
                    //get the title name, then add the description to it;
                    var title = $(eachItem).find('title').html();
                    console.log(title);
                    title.concat(description);
                    //need to get rid of html tags and just get the text
                    console.log(title.concat(description));
                    //else delete the description
                }
                // delete the description after adding it to the title, if applicable
                console.log(`delete the description here`);
            }
        });
    }

    /********************************
     *          STARTS HERE         *
     ********************************/
    getDescriptions();
};
