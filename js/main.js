var creating = false;
var fullscreen = false;
var active;
var objects = new Array();
var found = 0;
var last_found = 0;
var in_grid = "";
var opened=false;
var closed=false;
var cursor = false;
var length_text = 0;


// FIND MOUSE POSITION IN ARRAY
$( document ).on( "mousemove", function( event ) {
  if (!creating)
  {
    found = 0;
    if (objects.length > 1) {

      for (var i = 1; i < objects.length; i++) {
        var p1 = objects[i].position();
        var p2 = objects[i-1].position();

        //console.log("X: " + event.pageX + " Card: " + (p1.left + 200) + " Card2: " + p2.left);

        if (event.pageX > (p1.left + 250) && event.pageX < p2.left + 15)
        {
          if (event.pageY > (p1.top) && event.pageY < p1.top + 250) {
            found = i;
            last_found = i;
            openInsert();
          }
        }
      }
      if (found > 0){
        var fp1 = objects[found].position();
        var fp2 = objects[found-1].position();
        if (!cursor){
          $("#insertion").css("display", "block");
          $("#insertion").css("top", fp1.top + 35);
          $("#insertion").css("left", fp2.left - 15);
          cursor = true;
        }

      } else {
        $("#insertion").css("display", "none");
        found = 0;
        if (opened){
          closeInsert();
          cursor = false;

        }

      }
    }
  }
});

function openInsert() {
  if(!opened){
    objects[found].animate({
      right: "+=5"
    }, 300, 'easeOutExpo', function() {
      // Animation complete.
    });
    objects[found - 1].animate({
      left: "+=5"
    }, 300, 'easeOutExpo', function() {
      // Animation complete.
    });
    opened = true;
  }
}

function closeInsert() {
  console.log(last_found);
  if(!closed){
    objects[last_found].animate({
      right: "-=5"
    }, 300, 'easeOutExpo', function() {
      // Animation complete.
    });
    objects[last_found - 1].animate({
      left: "-=5"
    }, 300, 'easeOutExpo', function() {
      // Animation complete.
    });
    closed=true;
    opened = false;
  }
}

// EXPAND TO FS FROM CLICK ON GRID
$(document).on('click', '.in_grid' , function() {
  console.log($(this));
  active = $(this);
  expandMe();
});

// EXPAND TO FS FROM OVERRUN IN CARD
$(document).on('keyup', function(event) {

  switch(event.target.id) {
    case "":
      containerKey(event);
    break;
    case "textarea":
      textboxKey(event);
    break;
  }

});

function containerKey(e){
  if ( e.which == 13 && !fullscreen && !creating) {
    in_grid = true;
    length = 0;
    active = newIdea();
  }

  if (e.keyCode == 27 && fullscreen) {
    exitFS();
  }
}

function textboxKey(e){
  console.log("creating " + creating);
  if ( e.which == 13 && !fullscreen && creating) {

    if(in_grid){
      creating = false;

      if(length_text < 50)
      {
        console.log("in here");
        active.children('.text_area').removeClass('center_idea');
        active.children('.text_area').addClass('center_idea_ingrid');
      } else {
        active.children('.text_area').removeClass('left_idea');
        active.children('.text_area').addClass('left_idea_ingrid');
      }
      pushToGrid(active);
    } else {
      creating = false;

      if(length_text < 50)
      {
        console.log("in here");
        active.children('.text_area').removeClass('center_idea');
        active.children('.text_area').addClass('center_idea_ingrid');
      } else {
        active.children('.text_area').removeClass('left_idea');
        active.children('.text_area').addClass('left_idea_ingrid');
      }
      insertInGrid(active);
    }
  }

  length_text = active.children('.text_area').html().length;

  console.log("length " + length_text);
  if(length_text > 25)
  {
    console.log("in here");
    active.children('.text_area').removeClass('center_idea');
    active.children('.text_area').addClass('left_idea');
  } else {
    active.children('.text_area').removeClass('left_idea');
    active.children('.text_area').addClass('center_idea');
  }

  if(length_text > 80)
  {
    expandMe();
  }


}


// EXPAND TO FS
///////////////
function expandMe() {
  active.addClass("fullscreen");
  active.removeClass("creation_active");
  active.removeClass("in_grid");
  active.children('.text_area').attr('contenteditable', 'true');
  $("#container").addClass("container_fs");
  $("#expand").css("display", "none");
  $("#footerTrigger").css("display", "none");
  $(".sidebar").css("display", "block");
  $(".in_grid").css("display", "none");
  $("#back").css("display", "block");
  fullscreen = true;
}

// EXIT FS FROM BACK
$("#back").click(function(e) {
  exitFS();
});

// EXIT FS
//////////
function exitFS() {
  pushToGrid(active);
  $(".sidebar").css("display","none");
  $("#container").removeClass("container_fs");
  $("#footerTrigger").css("display", "block");
  $(".in_grid").css("display", "block");
  $("#back").css("display", "none");
}

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
  if (!creating){
    creating = true;
    var $newdiv = $( "<div class='idea'><div class='text_area' id='textarea' contenteditable='true'></div><img src='img/expand.png' id='expand'></div>")
    $newdiv.addClass("creation_active");
    $newdiv.addClass("center_idea");
    $newdiv.attr('id', 'working');
    if(in_grid){
      console.log("default into position");
      $( "#container" ).prepend( $newdiv );
    } else {
      console.log("insert into position");
      $( objects[found] ).first().after($newdiv);
    }
    addDrop($newdiv);
    $newdiv.children('.text_area').focus();
    return $newdiv;
  }
}

function pushToGrid(obj)
{
  console.log("active " + obj);
  active.children('.text_area').attr('contenteditable','false');
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

  active.children('.text_area').attr('contenteditable','false');
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
