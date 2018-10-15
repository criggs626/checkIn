var eventID = 0;
var kids = [];

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
    for(var i=0; i<data.length; i++){
      $("#returners").append("<tr><td>"+data[i].fname+"</td><td>"+data[i].lname+"</td><td><button onclick='checkIn(\""+data[i].kid_id+"\")'><i class='material-icons'>add_circle</i></a></td></tr>");
    }
  });
}

function checkedIn(){
  $("#attending").html("");
  $.post("/checkedIn",{"event":eventID},function(data){
    kids=data;
    for(var i=0; i<data.length; i++){
      $("#attending").append("<tr><td>"+data[i].fname+"</td><td>"+data[i].lname+"</td><td><a href='#details/"+i+"'><i class='material-icons'>info</i></a></td></tr>");
    }
  });
}

function checkIn(id){
  $.post("/checkin",{"kid":id,"event":eventID},function(data){
    window.history.back();
    setTimeout(function(data){location.reload();},500);
  });
}

function setDetail(id){
  $("#detailsContent").html("");
  var kid = kids[id];
  $("#detailsContent").append("<h5>Kid: "+kid.fname+" "+kid.lname+"</h5>");
  $("#detailsContent").append("<h6>Parent: "+kid.pname+"</h6>");
  $("#detailsContent").append("<p>Phone: "+kid.phone+"</p>");
  $("#detailsContent").append("<p>Birth Day: "+kid.bday+"</p>");
  $("#detailsContent").append("<p>Email: "+kid.email+"</p>");
  $("#detailsContent").append("<p>Address: "+kid.address+"</p>");
  $("#detailsContent").append("<p>School: "+kid.school+"</p>");
  $("#detailsContent").append("<p>Gender: "+kid.gender+"</p>");
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
