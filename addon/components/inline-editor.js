import Ember from 'ember';
import layout from '../templates/components/inline-editor';

export default Ember.Component.extend({
  layout: layout,
  classNames: ['inline-editor'],
  content: '',
  contentId: null,
  editingContent: '',
  inEditMode: false,
  placeholder: '',
  showCancelButton: false,
  showDeleteButton: false,
  showSaveButton: false,
  widthResize: false,
  heightResize: false,

  actions: {
    deleteContent() {
      this.set('editingContent', '');
      this.set('content', '');
      if (this.attrs.onDelete) {
        this.attrs.onDelete(this.get('contentId'));
      }
    },
    onClickOutside() {
      if (this.get('content') === this.get('editingContent')) {
        this.set('editingContent', '');
      }
      this.set('inEditMode', false);
    },
    onEscape() {
      this.send('onClickOutside');
    },
    onFocus() {
      this.$('textarea').select();
    },
    onKeyDown(text, event) {
      if (!event.shiftKey && event.which === 13) {
        event.preventDefault();
        this._updateContent();
      }
    },
    saveContent() {
      this._updateContent();
    },
    startEditing() {
      if (Ember.isEmpty(this.get('editingContent'))) {
        this.set('editingContent', this.get('content'));
      }
      this.set('inEditMode', true);

      if(this.get('cols') === 'auto') {
        this.set('widthResize', true);
        this.set('cols', null);
      }
      if(this.get('rows') === 'auto') {
        this.set('heightResize', true);
        this.set('rows', null);
      }
      Ember.run.scheduleOnce('afterRender', this, 'initTextarea');
    },
    stopEditing() {
      this.set('editingContent', '');
      this.set('inEditMode', false);
    }
  },

  initTextarea() {
    let txt = this.$('textarea');
    if(this.widthResize) {
      txt.width('100%');
    }
    if(this.heightResize) {
      autosize(txt);
    }
    txt.focus();
  },

  _updateContent() {
    let editingContent = this.get('editingContent');
    if (Ember.isPresent(editingContent)) {
      this.set('inEditMode', false);
      this.set('editingContent', '');
      if (editingContent !== this.get('content')) {
        this.set('content', editingContent);
        if (this.attrs.onSave) {
          this.attrs.onSave(editingContent);
        }
      }
    }
  }
});
