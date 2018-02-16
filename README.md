# Remove Descriptions
### *Package Name*: remove-descriptions
### *Child Type*: pre import
### *Platform*: all
### *Required*: Recommended

This child module is built to be used by the Brigham Young University - Idaho D2L to Canvas Conversion Tool. It utilizes the standard `module.exports => (course, stepCallback)` signature and uses the Conversion Tool's standard logging functions. You can view extended documentation [Here](https://github.com/byuitechops/d2l-to-canvas-conversion-tool/tree/master/documentation).

## Purpose

The purpose of this child module is to delete each module's description. As Canvas imports each course, if a module has a description then there is a module item that is created for the description. We do not want Canvas to create a module item for this, and will therefore remove the description before importing the course into Canvas.

## How to Install

```
npm install remove-descriptions
```

## Run Requirements

None

## Options

None
 
## Outputs

None

## Process

1. Get the contents of the 'imsmanifest.xml'
2. Read each 'organization>item'
3. Check if the 'item' has a 'description' attribute that is empty or not
	- If empty, move to the next item
	- If not empty, check if the description length is five words or less
4. If the description length is five words or less:
	- Append the description to the 'item' title
	- Then delete the description
5. Else if the description length is more than five words:
	- Delete the description

## Log Categories

None

## Requirements
 
1. The child module will append module descriptions to the module titles if descriptions are five words or less
2. The child module will not append module descriptions to the module titles if descriptions are more than five words
3. The child module will delete the descriptions