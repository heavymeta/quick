var creating = false;
var fullscreen = false;
var active;
var objects = new Array();
var found = 0;
var in_grid = "";

// FIND MOUSE POSITION IN ARRAY
$( document ).on( "mousemove", function( event ) {
  if (!creating)
  {
  found = 0;
  if (objects.length > 1) {

    for (var i = 1; i < objects.length; i++) {
      var p1 = objects[i].position();
      var p2 = objects[i-1].position();

      console.log("X: " + event.pageX + " Card: " + (p1.left + 200) + " Card2: " + p2.left);

        if (event.pageX > (p1.left + 250) && event.pageX < p2.left)
        {
          if (event.pageY > (p1.top) && event.pageY < p1.top + 250) {
            found = i;
            console.log("found is "+i);
          }
        }
      }
      if (found > 0){
        var fp1 = objects[found].position();
        var fp2 = objects[found-1].position();
        $("#insertion").css("display", "block");
        $("#insertion").css("top", fp1.top + 35);
        $("#insertion").css("left", fp2.left - 2);

      } else {
        $("#insertion").css("display", "none");
        found = 0;
      }
  }
}
});





// EXPAND TO FS FROM CLICK ON GRID
$(document).on('click', '.in_grid' , function() {
    console.log($(this));
    active = $(this);
    expandMe();
});

// EXPAND TO FS FROM OVERRUN IN CARD
$(document).on('keyup', '.creation_active' , function() {
  var len = $(this).html().length;
  if(len > 100)
  {
    active = $(this);
    expandMe();
  }
});

// EXPAND TO FS
///////////////
function expandMe() {
  active.addClass("fullscreen");
  active.removeClass("creation_active");
  active.removeClass("in_grid");
  active.attr('contenteditable', 'true');
  $(".container").addClass("container_fs");
  $("#expand").css("display", "none");
  $("#footerTrigger").css("display", "none");
  $(".sidebar").css("display", "block");
  $(".in_grid").css("display", "none");
  $("#back").css("display", "block");
  fullscreen = true;
}

// EXIT FS FROM ESC
$(document).keyup(function(e) {
  if (e.keyCode == 27) {
    exitFS();
  }
});

// EXIT FS FROM BACK
$("#back").click(function(e) {
  exitFS();
});

// EXIT FS
//////////
function exitFS() {
  pushToGrid(active);
  $(".sidebar").css("display","none");
  $(".container").removeClass("container_fs");
  $("#footerTrigger").css("display", "block");
  $(".in_grid").css("display", "block");
  $("#back").css("display", "none");
}


// CREATE NEW IDEA
$( document ).keypress(function( event ) {

  if ( event.which == 13 && !fullscreen) {
    if (!creating) {
      in_grid = true;
      active = newIdea();
    } else {
      if(in_grid){
        console.log("push to grid");
        pushToGrid(active);
    } else {
        console.log("insert to grid");
        insertInGrid(active);
    }
    }

  }
});

//CREAT NEW IDEA FROM FOOTER
$("#footerTrigger").click(function() {
  if (!creating) {
    in_grid = true;
    active = newIdea();

  }
});

$("#insertion").click(function(e) {
  in_grid = false;
  active = newIdea();
});

function newIdea()
{
  console.log(in_grid);
  if (!creating){
    creating = true;
    var $newdiv = $( "<div class='idea' contenteditable='true'><img src='img/expand.png' id='expand'></div>")
    $newdiv.addClass("creation_active");
    $newdiv.attr('id', 'working');
    if(in_grid){
      console.log("default into position");
      $( "#container" ).prepend( $newdiv );
    } else {
      console.log("insert into position");
      $( objects[found] ).first().after($newdiv);
    }
    $newdiv.focus();
    addDrop($newdiv);
    return $newdiv;
  }
}

function pushToGrid(obj)
{
  console.log("active " + obj);
  active.attr('contenteditable','false');
  obj.addClass("in_grid");
  active.attr('id', '');
  obj.removeClass("creation_active");
  obj.removeClass("fullscreen");
  obj.children('#expand').css("display", "none");
  creating = false;
  fullscreen = false
  objects.push(obj);
}

function insertInGrid(obj){

  active.attr('contenteditable','false');
  obj.addClass("in_grid");
  active.attr('id', '');
  obj.removeClass("creation_active");
  obj.removeClass("fullscreen");
  obj.children('#expand').css("display", "none");
  creating = false;
  fullscreen = false
  objects.splice(found,0,obj);
  $('#insertion').css("display","none");
}

$("#container").click(function(e) {
  if (creating) {
    switch(e.target.id) {
      case "container":
          active.remove();
          creating = false;
          active = "";
        break;
      case "expand":
          expandMe();
          break;
  }
}
});







// DRAG AND DROP IMAGES
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
