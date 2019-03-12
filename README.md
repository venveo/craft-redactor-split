# Redactor Split plugin for Craft CMS 3.x

Split a matrix block into two blocks at your cursor.

**NOTE:** This plugin will cost $7 when released.

## Requirements

- Craft CMS 3.1.x
- Redactor Craft CMS plugin 2.3.x

## Installation

To install the plugin, follow these instructions.

1. Open your terminal and go to your Craft project:

        cd /path/to/project

2. Then tell Composer to load the plugin:

        composer require venveo/craft-redactor-split

3. In the Control Panel, go to Settings → Plugins and click the “Install” button for Redactor Split.

4. Add the plugin to your Redactor configurations:
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
