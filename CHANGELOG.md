# Redactor Split Changelog

## 4.0.0 - 2022-07-10

### Changed
- Redactor Split now requires Craft 4

## 1.1.1 - 2021-04-17

### Changed
- If the split button is clicked when the field doesn't have focus, the first node will be split by default
- When a split is initialized, if the selected node is empty, we'll split at the next meaningful node, skipping empty nodes, such as `<p></p>` and `\nl`
- Improved plugin loading behavior to ensure Redactor is actually enabled before trying to load
- We no longer try to split when the redactor field is a single node, empty, or the selected node is the last node.

### Fixed
- Fix errors that could occur when the split button is clicked without focus on redactor
- Fix errors that could occur if trying to split when the current selected node is a child node (e.g. `<li></li>`)

## 1.1.0 - 2020-04-10
### Fixed
- Plugin not working on Craft 3.4

### Changed
- Redactor Split now requires Craft 3.4 or greater

## 1.0.1 - 2019-03-14
### Changed
- Updated icon and cleaned code for release

## 1.0.0 - 2019-03-13
### Added
- Initial release
