var creating = false;
var active;

$( document ).keypress(function( event ) {

  if ( event.which == 13 ) {
    if (!creating) {
      active = newIdea();
    } else {
      pushToGrid(active);
    }

  }
});

$("#footerTrigger").click(function() {
  if (!creating) {
    active = newIdea();
  }
});

$(".container").click(function(e) {
  console.log(e.target.id);
  if (creating) {
    if (e.target.id != "working") {
      active.remove();
      creating = false;
      active = "";
  }
  }
});


function newIdea()
{
  if (!creating){
    creating = true;
    var $newdiv = $( "<div class='idea' contenteditable='true'>")
    $newdiv.addClass("creation_active");
    $newdiv.attr('id', 'working');
    var new_idea = $( ".container" ).prepend( $newdiv );
    $newdiv.focus();
    addDrop($newdiv);
    return $newdiv;
  }
}

function pushToGrid(obj)
{
  active.attr('contenteditable','false');
  obj.addClass("in_grid");
  active.attr('id', '');
  obj.removeClass("creation_active");


  creating = false;
}


function addDrop(obj) {
  var handleDrag = function(e) {
      //kill any default behavior
      e.stopPropagation();
      e.preventDefault();
  };
  var handleDrop = function(e) {
      //kill any default behavior
      e.stopPropagation();
      e.preventDefault();
      //console.log(e);
      //get x and y coordinates of the dropped item
      x = e.clientX;
      y = e.clientY;
      //drops are treated as multiple files. Only dealing with single files right now, so assume its the first object you're interested in
      var file = e.dataTransfer.files[0];
      //don't try to mess with non-image files
      if (file.type.match('image.*')) {
          //then we have an image,

          //we have a file handle, need to read it with file reader!
          var reader = new FileReader();

          // Closure to capture the file information.
          reader.onload = (function(theFile) {
              //get the data uri
              var dataURI = theFile.target.result;
              //make a new image element with the dataURI as the source
              var img = document.createElement("img");
              img.src = dataURI;

              //Insert the image at the carat

              // Try the standards-based way first. This works in FF
              if (document.caretPositionFromPoint) {
                  var pos = document.caretPositionFromPoint(x, y);
                  range = document.createRange();
                  range.setStart(pos.offsetNode, pos.offset);
                  range.collapse();
                  range.insertNode(img);
              }
              // Next, the WebKit way. This works in Chrome.
              else if (document.caretRangeFromPoint) {
                  range = document.caretRangeFromPoint(x, y);
                  range.insertNode(img);
              }
              else
              {
                  //not supporting IE right now.
                  console.log('could not find carat');
              }


          });
          //this reads in the file, and the onload event triggers, which adds the image to the div at the carat
          reader.readAsDataURL(file);
      }
  };

  var dropZone = document.getElementById("working");
  dropZone.addEventListener('dragover', handleDrag, false);
  dropZone.addEventListener('drop', handleDrop, false);
};
