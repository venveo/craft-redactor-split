(function($R)
{
    var nextRedactorFieldId = null;
    var redactorElementNodesToMigrate = null;

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
            var $button = this.toolbar.addButton('Matrix Split', { title: this.lang.get('split'), api: 'plugin.redactor-split.split' });
            $button.setIcon('<i class="venveo icon redactor-split"></i>');
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
                console.log(self.field)
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
