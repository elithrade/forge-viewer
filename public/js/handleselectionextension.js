// *******************************************
// Handle Selection Extension
// *******************************************
function HandleSelectionExtension(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);
}

HandleSelectionExtension.prototype = Object.create(
  Autodesk.Viewing.Extension.prototype
);
HandleSelectionExtension.prototype.constructor = HandleSelectionExtension;

HandleSelectionExtension.prototype.load = function() {
  // any custom initialization required? add here
  return true;
};

HandleSelectionExtension.prototype.onToolbarCreated = function() {
  var _this = this;

  // prepare to execute the button action
  var handleSelectionToolbarButton = new Autodesk.Viewing.UI.Button(
    "handleSelectionButton"
  );
  handleSelectionToolbarButton.onClick = function(e) {
    /// get current selection
    var selection = _this.viewer.getSelection();
    _this.viewer.clearSelection();
    // anything selected?
    if (selection.length > 0) {
      // create an array to store dbIds to isolate
      var dbIdsToChange = [];

      // iterate through the list of selected dbIds
      selection.forEach(function(dbId) {
        // get properties of each dbId
        _this.viewer.getProperties(dbId, function(props) {
          // output on console, for fun...
          console.log(props);

          // ask if want to isolate
          if (
            confirm("Confirm " + props.name + " (" + props.externalId + ")?")
          ) {
            dbIdsToChange.push(dbId);

            // at this point we know which elements to isolate
            if (dbIdsToChange.length > 0) {
              // isolate selected (and confirmed) dbIds
              _this.viewer.isolate(dbIdsToChange);
            }
          }
        });
      });
    } else {
      // if nothing selected, restore
      _this.viewer.isolate(0);
    }
  };
  // handleSelectionToolbarButton CSS class should be defined on your .css file
  // you may include icons, below is a sample class:
  handleSelectionToolbarButton.addClass("handleSelectionToolbarButton");
  handleSelectionToolbarButton.setToolTip("Handle current selection");

  // SubToolbar
  this.subToolbar = this.viewer.toolbar.getControl("MyAppToolbar")
    ? this.viewer.toolbar.getControl("MyAppToolbar")
    : new Autodesk.Viewing.UI.ControlGroup("MyAppToolbar");
  this.subToolbar.addControl(handleSelectionToolbarButton);

  this.viewer.toolbar.addControl(this.subToolbar);
};

HandleSelectionExtension.prototype.unload = function() {
  if (this.viewer.toolbar) this.viewer.toolbar.removeControl(this.subToolbar);
  return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension(
  "HandleSelectionExtension",
  HandleSelectionExtension
);
