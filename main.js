/*eslint-env node, es6*/

/* Module Description */
/* The purpose of this child module is to delete each module's 
description attribute before importing the course into Canvas */

/* HE is used to convert escaped characters into HTML */
const he = require('he');
const cheerio = require('cheerio');

module.exports = (course, stepCallback) => {

    /**********************************************
	 * 	getModuleDescriptions()				  
	 *  Parameters: none
	 **********************************************/
    function getModuleDescriptions() {
        /* get the contents of 'imsmanifest.xml */
        var manifest = course.content.find(file => {
            return file.name === 'imsmanifest.xml';
        });

        /* if 'imsmanifest.xml' wasn't found, stop the child module */
        if (!manifest) {
            var err = new Error('Couldn\'t locate \'imsmanifest.xml\' for this course');
            course.error(err);
            stepCallback(err, course);
            return;
        }

        /* assign manifest.dom to '$' to parse through the html */
        var $ = manifest.dom;
        /* loop through each 'organization>item' */
        $('organization>item').each((i, eachItem) => {
            /* get the desciption attribute which has an encoded <tag> and decode it, then trim the white spaces off the edges.
			Will likely look like '<p>Whatever the description is</p>' after decoding and trimming */
            var description = he.decode(eachItem.attribs.description).trim();
            /* if the description is not empty, check for the number of words in it */
            if (description !== '') {
                /* number of words in the description, splitting the string on white spaces */
                var numWords = description.split(/\s+|&nbsp;/).length;
                /* if description <= 5 words, append to title, else just delete the title */
                if (numWords < 6) {
                    var title = $(eachItem).find('title').first().html();
                    /* load the description as a cheerio object since it is within a <tag> */
                    var $$ = cheerio.load(description);
                    /* use '*' in case it doesn't always put the description in a <p> tag */
                    /* unsure why .first() is needed, but it duplicates the text otherwise */
                    var descriptionText = $$('*').first().text();
                    var concatTitle = `${title}: ${descriptionText}`;
                    var newTitle = `<title>${concatTitle}</title>`;
                    /* replace the old title with the new title */
                    $(eachItem).find('title').first().replaceWith(newTitle);
                    course.log('Module titles with merged descriptions', {'New Module Title': concatTitle, 'Original Title': title});
                }
                /* set the description to be an empty string (i.e. delete it), whether it was appended to the title or not */
                $(eachItem).attr('description', '').html();
                course.log('Module Descriptions Deleted', {'Module Title': title, 'Description': description});
            }
        });

        course.message('Successfully removed module descriptions');
        stepCallback(null, course);
        return;
    }

    /********************************
	 *          STARTS HERE         *
	 ********************************/
    getModuleDescriptions();
};