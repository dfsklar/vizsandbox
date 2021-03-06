Ember.Form = Ember.View.extend(Ember.TargetActionSupport, {
  classNames:      ['ember-form'],
  tagName:         'form',
  target:          '*',            // default target = view itself
  action:          'submitForm',   // default action = submitForm()
  propagateEvents: false,

  // trigger the action bound to this view when the form is submitted
  submit: function(evt) {
    evt.preventDefault();
    this.triggerAction();
    return Ember.get(this, 'propagateEvents');
  }
});
