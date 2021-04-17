(function($R)
{
    var nextRedactorFieldId = null;
    var redactorElementNodesToMigrate = null;

    /**
     * When the split button is clicked, we'll look at the currently selected node and determine if it should be skipped
     * in favor of the next sibling node.
     * @param node
     * @returns {boolean}
     */
    var shouldSkipNode = function(node) {
        // Nothing to skip to
        if (!node.nextElementSibling) {
            return false
        }

        return node.nodeValue === '\n' ||
            (node.tagName === 'P' && node.textContent === '')
    }

    /**
     * When the split button is clicked, we need to find the upper-most node to avoid splitting within nested nodes,
     * such as lists.
     * @param editor
     * @param node
     * @returns {*}
     */
    var resolveSelectedNode = function(editor, node) {
        var $editor = editor.$editor.nodes[0]
        while(node.parentNode !== $editor) {
            node = node.parentNode
        }
        return node
    }

    $R.add('plugin', 'redactor-split', {
        translations: {
            en: {
                "split": "Split Matrix Block",
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
            this.matrix = this.$root.closest('.matrix').data('matrix')
            this.field = this.$root.closest('.field')
        },
        onstarted: function()
        {
            // Don't try to do anything if we're not in a matrix block for some reason.
            if (!this.shouldMount) {
                return;
            }

            // If this plugin was just initialized on a block that was just spawned from a split, we need to add those
            // elements to this block
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
        start: function()
        {
            if (!this.shouldMount) {
                return;
            }
            var button = this.toolbar.addButton('Matrix Split', { title: this.lang.get('split'), api: 'plugin.redactor-split.split' });
            button.setIcon('<i class="venveo icon redactor-split"></i>');
        },
        _splitMatrix: function() {
            if (!this.matrix.canAddMoreBlocks()) {
                alert('Max blocks reached!');
                return;
            }

            // Get all nodes (elements) through the one we have selected
            redactorElementNodesToMigrate = [];
            var firstNode = this.editor.getFirstNode();
            var lastNode = this.editor.getLastNode();
            var selectedNode = this.selection.getBlock();

            // Editor is completely empty
            if (!firstNode) {
                return;
            }

            // Can't split a single node
            if (firstNode === lastNode) {
                return;
            }

            // If there isn't a node selected, just use the first one
            if (!selectedNode) {
                selectedNode = firstNode
            } else {
                // If an explicit node is selected, we need to ensure its the parent most element so we don't try to split
                // non-splittable nodes (e.g. <li></li>)
                selectedNode = resolveSelectedNode(this.editor, selectedNode)
            }

            // Don't split at newline characters
            while (shouldSkipNode(selectedNode)) {
                selectedNode = selectedNode.nextElementSibling
            }

            // Pointless
            if (selectedNode === lastNode) {
                return;
            }

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
        split: function()
        {
            this._splitMatrix();
        },
    });
})(Redactor);
