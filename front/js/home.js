var eventID = 0;
var presentKids = [];
var absentKids = [];

$(document).ready(function(){
  $('select').formSelect();
});

$(document).ready(function(){
  $('.datepicker').datepicker();
});

$(document).ready(function(){
  $('.modal').modal();
});

function getEvents(){
  $("#events").html("")
  $.get("/getEvents", function(data){
    for(var i=0; i<data.length; i++){
      $("#events").append("<tr><td>"+data[i].name+"</td><td>"+data[i].date+"</td><td><a href='#checkin/"+data[i].event_id+"'><i class='material-icons'>send</i></a></td></tr>");
    }
  });
}

function notChecked(){
  $("#returners").html("");
  $.post("/notCheckedIn",{"event":eventID},function(data){
    absentKids=data;
    for(var i=0; i<data.length; i++){
      $("#returners").append("<tr><td>"+data[i].fname+"</td><td>"+data[i].lname+"</td><td><button class='btn' onclick='checkIn(\""+data[i].kid_id+"\")'><i class='material-icons'>add_circle</i></a></td></tr>");
    }
  });
}

function checkedIn(){
  $("#attending").html("");
  $.post("/checkedIn",{"event":eventID},function(data){
    presentKids=data;
    for(var i=0; i<data.length; i++){
      $("#attending").append("<tr><td>"+data[i].fname+"</td><td>"+data[i].lname+"</td><td><a href='#details/"+i+"'><i class='material-icons'>info</i></a></td></tr>");
    }
  });
}

function checkIn(id){
  $.post("/checkin",{"kid":id,"event":eventID},function(data){
    for(var i=0;i<absentKids.length;i++){
      if(absentKids[i].kid_id==id){
        var request = confirm(absentKids[i].fname+" "+absentKids[i].lname+" has been checked in.\nWould you like to print a sticker? (Ok for yes, Cancel for no)");
        if (request == true) {
          print(absentKids[i]);
          window.history.back();
          setTimeout(function(data){location.reload();},500);
        } else {
          window.history.back();
          setTimeout(function(data){location.reload();},500);
        }
      }
    }
  });
}

function setDetail(id){
  $("#detailsContent").html("");
  var kid = presentKids[id];
  $("#detailsContent").append("<h5>Kid: "+kid.fname+" "+kid.lname+"</h5>");
  $("#detailsContent").append("<h6>Parent: "+kid.pname+"</h6>");
  $("#detailsContent").append("<p>Phone: "+kid.phone+"</p>");
  $("#detailsContent").append("<p>Birth Day: "+kid.bday+"</p>");
  $("#detailsContent").append("<p>Email: "+kid.email+"</p>");
  $("#detailsContent").append("<p>Address: "+kid.address+"</p>");
  $("#detailsContent").append("<p>School: "+kid.school+"</p>");
  $("#detailsContent").append("<p>Gender: "+kid.gender+"</p>");
}

function print(kid){
  var doc = new jsPDF({
    orientation: 'landscape',
    unit: 'in',
    format: [1.4, 3.5]
  });
  doc.setFontSize(20);
  doc.text(.5, .5,kid.fname+" "+kid.lname);
  doc.setFontSize(15);
  var hashids = new Hashids("saltyness");
  id = hashids.encode(parseInt(kid.kid_id), parseInt(eventID));
  doc.text(.5, 1, "Checkout Number: "+id);
  var string = doc.output('datauristring');
  var iframe = "<iframe width='100%' height='500px' src='" + string + "'></iframe>"
  var x = window.open();
  x.document.open();
  x.document.write(iframe);
  x.document.close();
}

$("#newKid").submit(function(event) {
  $.post("/addKid",$(this).serialize(),function(data){
    window.history.back();
    setTimeout(function(data){location.reload();},500);
  });
  event.preventDefault();
});

var routes = Backbone.Router.extend({
  routes: {
    '': 'home',
    'checkin/:info': 'checkin',
    "returning": "returner",
    "new": "new",
    "here": "here",
    "details/:info": "detail"
  },
  home: function () {
    $('#eventView').show();
    $('#checkinView').hide();
    $('#returningView').hide();
    $('#newView').hide();
    $('#attendeeView').hide();
    $('#details').hide();
    getEvents();
  },
  checkin: function (data) {
    $('#eventView').hide();
    $('#checkinView').show();
    $('#returningView').hide();
    $('#newView').hide();
    $('#attendeeView').hide();
    $('#details').hide();
    eventID = data;
  },
  returner: function () {
    $('#eventView').hide();
    $('#checkinView').hide();
    $('#returningView').show();
    $('#newView').hide();
    $('#attendeeView').hide();
    $('#details').hide();
    notChecked();
  },
  new: function () {
    $('#eventView').hide();
    $('#checkinView').hide();
    $('#returningView').hide();
    $('#newView').show();
    $('#attendeeView').hide();
    $('#details').hide();
    $("#eventID").val(eventID);
  },
  here: function () {
    $('#eventView').hide();
    $('#checkinView').hide();
    $('#returningView').hide();
    $('#newView').hide();
    $('#attendeeView').show();
    $('#details').hide();
    checkedIn();
  },
  detail: function (data) {
    $('#eventView').hide();
    $('#checkinView').hide();
    $('#returningView').hide();
    $('#newView').hide();
    $('#attendeeView').hide();
    $('#details').show();
    setDetail(data);
  }
});
var appRoutes = new routes();
Backbone.history.start();
