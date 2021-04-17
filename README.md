# Redactor Split plugin for Craft CMS 3

This plugin adds a button to redactor fields that are nested within matrix 
blocks that when clicked, spawns a new matrix block of the same type and moves 
the current paragraph/tag on your cursor to the same field in the new block.

Best paired with a [Matrix Content builder](https://nystudio107.com/blog/creating-a-content-builder-in-craft-cms)

[Watch a Demo](https://venveo.d.pr/3ENrS5)

## Requirements

- Craft CMS 3.1.x - 3.7.x
- Redactor for Craft CMS

## Installation

To install the plugin, follow these instructions.

1. Open your terminal and go to your Craft project:

        cd /path/to/project

2. Then tell Composer to load the plugin:

        composer require venveo/craft-redactor-split

3. In the Control Panel, go to Settings → Plugins and click the “Install” button for Redactor Split.

4. Add the plugin to your Redactor configurations in the "plugins" array:
```json
{
    "buttons": [
        "bold",
        "italic",
        "unorderedlist",
        "orderedlist",
        "link",
        "etc"
    ],
    "plugins": ["redactor-split"],
    "toolbarFixed": false
}
```
Brought to you by [Venveo](https://www.venveo.com)
