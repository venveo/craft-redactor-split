(function($R)
{
    var nextRedactorFieldId = null;
    var redactorElementNodesToMigrate = null;

    $R.add('plugin', 'redactor-split', {
        translations: {
            en: {
                "split": "Split Matrix Block",
                "auto-split": "Auto-split",
            }
        },
        init: function(app)
        {
            this.app = app;
            this.opts = app.opts;
            this.lang = app.lang;
            this.toolbar = app.toolbar;
            this.block = app.block;
            this.component = app.component;
            this.editor = app.editor;
            this.insertion = app.insertion;
            this.selection = app.selection;
            this.source = app.source;
            this.shouldMount = true;
            this.fieldProvider = 'matrix';

            var container = app.container;
            this.$root = $(container.element.rootElement)
            var $fields = this.$root.closest('.fields');
            if (!$fields.parent().hasClass('matrixblock')) {
                this.shouldMount = false;
                return false;
            }

            this.$matrixblock = this.$root.closest('.matrixblock')
            this.matrixblock = this.$matrixblock.data('block');
            this.matrixblocktype = this.$matrixblock.data('type');
            this.matrix = this.$root.closest('.matrix').data('matrix');
            this.field = this.$root.closest('.field');
        },
        onstarted: function()
        {
            if (!this.shouldMount) {
                return;
            }
            var myId = this.$root.attr('id');
            if (myId == nextRedactorFieldId && redactorElementNodesToMigrate.length) {
                var fragment = new DocumentFragment();
                for(var i = 0; i < redactorElementNodesToMigrate.length; i++) {
                    fragment.appendChild(redactorElementNodesToMigrate[i]);
                }
                var div = document.createElement('div');
                div.appendChild(fragment)
                this.source.setCode(div.innerHTML);
                // Reset for the next split!
                nextRedactorFieldId = null;
                redactorElementNodesToMigrate = [];
            }
        },
        // public
        start: function()
        {
            if (!this.shouldMount) {
                return;
            }
            var $splitButton = this.toolbar.addButton('Matrix Split', { title: this.lang.get('split'), api: 'plugin.redactor-split.split' });
            if (window.redactorSplitMapping) {
                var $autoSplit = this.toolbar.addButton('Auto Split', {
                    title: this.lang.get('auto-split'),
                    api: 'plugin.redactor-split.autoSplit'
                });
            }
            $splitButton.setIcon('<i class="venveo icon redactor-split"></i>');
        },
        _splitMatrix: function() {
            if (!this.matrix.canAddMoreBlocks()) {
                alert('Max blocks reached!');
                return;
            }

            // Get all nodes (elements) through the one we have selected
            redactorElementNodesToMigrate = [];
            var firstNode = this.editor.getFirstNode();
            var selectedNode = this.selection.getElement();

            redactorElementNodesToMigrate.push(firstNode);

            var currentNode = firstNode;
            while (currentNode !== selectedNode) {
                currentNode = currentNode.nextElementSibling;
                redactorElementNodesToMigrate.push(currentNode)
            }

            var self = this;
            var cb = function(e) {
                var $block = e.$block;
                self.matrix.off('blockAdded', cb);
                var fieldId = self.field.attr('id');
                var split = fieldId.split('-')
                var fieldHandle = split[split.length - 2]; // Get the field handle
                // We'll probably need to modify this to make things like Neo and supertable work.
                var id = e.target.inputIdPrefix + '-blocks-' + $block[0].dataset.id + '-fields-' + fieldHandle;

                // Tell the init method what field to target for setting the content
                nextRedactorFieldId = id;
            }


            this.matrix.on('blockAdded', cb)
            this.matrix.addBlock(this.matrixblocktype, this.$matrixblock)
        },

        _autoSplitMatrix: function() {
            if (!this.matrix.canAddMoreBlocks()) {
                alert('Max blocks reached!');
                return;
            }

            var fieldId = this.matrix.id;
            var split = fieldId.split('-')
            var fieldHandle = split[split.length - 1]; // Get the field handle

            // Get all nodes (elements) through the one we have selected
            var selectedElement = this.selection.getElement();

            var tag = selectedElement.tagName.toLowerCase();
            if (window.redactorSplitMapping && window.redactorSplitMapping.hasOwnProperty(fieldHandle) && window.redactorSplitMapping[fieldHandle].hasOwnProperty(tag)) {
                var mapping = window.redactorSplitMapping[fieldHandle][tag];
            }
            if(!mapping) {
                alert('No valid mapping for field');
            }
            var blockTypes = Object.keys(mapping);
            if (!blockTypes) {
                alert('No valid block type found for '+ tag);
            }
            var fieldMap = mapping[blockTypes[0]];
            var self = this;
            // var self = this;
            var cb = function(e) {
                var $block = e.$block;
                self.matrix.off('blockAdded', cb);
                // fields[contentBuilder][new2][fields][headingType]
                var fieldNamePrefix = e.target.inputNamePrefix + '[blocks][' + $block[0].dataset.id + '][fields]';
                for (var key in mapping[blockTypes[0]]) {
                    // skip loop if the property is from prototype
                    if (!mapping[blockTypes[0]].hasOwnProperty(key)) continue;
                    var fieldHandle = key;
                    var fieldValue = mapping[blockTypes[0]][key];
                    var fieldName = fieldNamePrefix + '[' + fieldHandle + ']';
                    var $field = document.querySelector("[name='"+fieldName+"']");
                    var processFieldValue = self._processFieldValue(fieldValue, selectedElement);
                    $($field).val(processFieldValue);
                    selectedElement.remove();
                }
            }

            this.matrix.on('blockAdded', cb)
            this.matrix.addBlock(blockTypes[0], this.$matrixblock);

        },

        _processFieldValue: function(valueFromMap, $targetElement) {
            if (valueFromMap === '%text%') {
                return $targetElement.textContent;
            }
            return valueFromMap;
        },

        split: function()
        {
            this._splitMatrix();
        },
        autoSplit: function()
        {
            this._autoSplitMatrix();
        },
    });
})(Redactor);
