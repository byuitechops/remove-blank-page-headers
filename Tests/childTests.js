/* Dependencies */
const tap = require('tap');
const canvas = require('canvas-wrapper');
const asyncLib = require ('async');
const he = require('he');
const cheerio = require('cheerio');

module.exports = (course, callback) => {
    tap.test('remove-blank-page-headers', (test) => {

         /* get the contents of 'imsmanifest.xml */
         var manifest = course.content.find(file => {
            return file.name === 'imsmanifest.xml';
        });

        /* if 'imsmanifest.xml' wasn't found, stop the child module */
        if (!manifest) {
            test.fail('Couldn\'t locate \'imsmanifest.xml\' for this course');
            test.end();
            callback(null, course);
            return;
        }

        /* assign manifest.dom to '$' to parse through the html */
        var $ = manifest.dom;
        var descriptions = [];

        /* Loop through each <item></item> and look for 'description' attributes with text in them */
        $('item').each((i, eachItem) => {
            /* get the desciption attribute which has an encoded <tag> and decode it, then trim the white spaces off the edges.
			Will likely look like '<p>Whatever the description is</p>' after decoding and trimming */
            var description = he.decode(eachItem.attribs.description).trim();
            descriptions.push(description);
            /* if the description is not empty, then the child module didn't work properly */
            if (description !== '') {
                var title = $(eachItem).find('title').first().html();
                test.fail(`${title} still has a description`);
            }
        });

        /* If the descriptions array is empty, then there are no descriptions and the test passed */
        if (descriptions.length === 0) {
            test.pass('No descriptions found in the course!');
        }
        test.end();
    });

    callback(null, course);
};