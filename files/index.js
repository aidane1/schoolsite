
function getDays(month) {
  switch (month) {
    case 0:
      return 31;
      break;
    case 1:
      var currentYear = ((new Date())).getFullYear();
      if (currentYear % 4 === 0 && ((currentYear % 100 != 0) || (currentYear % 400 === 0))) {
        return 29;
      } else {
        return 28;
      }
      break;
    case 2:
      return 31;
      break;
    case 3:
      return 30;
      break;
    case 4:
      return 31;
      break;
    case 5:
      return 30;
      break;
    case 6:
      return 31;
      break;
    case 7:
      return 31;
      break;
    case 8:
      return 30;
      break;
    case 9:
      return 31;
      break;
    case 10:
      return 30;
      break;
    case 11:
      return 31;
      break;
  }
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}



var mongoose = require("mongoose");

var fs = require("fs");

var express = require("express");

var bodyParser = require("body-parser");

var User = require("../models/userchar");

var Course = require("../models/coursechar");

var session = require("express-session");

var Events = require("../models/eventschar");

let socket = require("socket.io")

let cookieParser = require("cookie-parser");

var Texts = require("../models/textchar.js");

var Resources = require("../models/resourcechar.js");

let nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "pvsstudents@gmail.com",
    pass: "AidanEglin2002pvss"
  }
})







// connects to the mongoDB server
mongoose.connect("mongodb://localhost/users");

mongoose.connection.once("open", function() {
  console.log("connection has been made");
}).on("error", function(error) {
  console.log("connection error: " + error);
});





// Events.create({year : 2018, month : 8, day : 3, info : "First Day Back !"});

// Resources.create({url : "https://www.khanacademy.org/science/biology", class : "MBI-11", type: "VIDEO", description: "Khan Academy Video"});

// sets up middleware
var urlencodedParser = bodyParser.urlencoded({extended: false});




const app = express();





app.set("view engine", "ejs");

app.use(session({
  secret: 'a1q2T5-8#1+59',
  resave: true,
  saveUninitialized: false
}));

app.use(express.static('public'));

app.use(cookieParser());


var server = app.listen(3000, function() {
  console.log("listening for requests");
});

//gonna delete this when it goes public, its just for ease of data entry
app.get("/add", function(req, res) {
  res.sendFile(__dirname + "/add.html");
});

app.post("/add", urlencodedParser, function(req, res) {
  var courseData = {
    teacher : req.body.teacher,
    course : req.body.course.toLowerCase(),
    block : req.body.block.toUpperCase(),
    code : req.body.code.toUpperCase()
  }
  Course.create(courseData, function() {
    res.redirect("/add");
  });
});

//for sending today's course data;
function blockToTime(day) {
  // let schedule = [[["A", 2], ["B", 3], ["C",2], ["D", 3]],[["B", 2], ["C", 3], ["D", 2], ["E", 3]],[["C", 2], ["D", 3], ["E", 2], ["A", 3]],[["D", 2], ["E", 3], ["A", 2], ["B", 3]],[["E", 2], ["A",3], ["B",2], ["C",3]]];
  let schedule = [["A", "B", "C", "D", "E"], ["E", "D", "B", "C", "A"], ["D", "A", "C", "B", "E"], ["B", "C", "E", "A", "D"], ["D", "B", "A", "E", "C"]];

  if (day === -1 || day === 5) {
    return false;
  }
  return schedule[day];
}


//gives today's LC's
function lcSchedule(day) {
  let schedule = [["Mr. Austin, room 31", "Mr. Fraser, room 28", "Open foods, room 17", "Mr. foxx, room 30", "Mme. Arthurson, room 41", "Open shop, room 50"], ["Mr. Austin, room 31", "Mr. Fraser, room 28", "Open foods, room 17", "Mr. foxx, room 30", "Mme. Arthurson, room 41", "Open shop, room 50"], ["Mr. Austin, room 31", "Mr. Fraser, room 28", "Open foods, room 17", "Mr. foxx, room 30", "Mme. Arthurson, room 41", "Open shop, room 50"], ["Mr. Austin, room 31", "Mr. Fraser, room 28", "Open foods, room 17", "Mr. foxx, room 30", "Mme. Arthurson, room 41", "Open shop, room 50"], ["Mr. Austin, room 31", "Mr. Fraser, room 28", "Open foods, room 17", "Mr. foxx, room 30", "Mme. Arthurson, room 41", "Open shop, room 50"]];
  if (day === -1 || day === 5) {
    return false;
  }
  return schedule[day];
}
// handles get requests for / (home)
app.get("/", function(req, res) {

  let currentDate = new Date();
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  if (req.session.userId) {
    User.findOne({_id : req.session.userId}, function(err, user) {
      if (!user) {
        res.redirect("/login");
      } else {
        var courseCodes = [];
        user.courses.forEach(function(theCourse) {
          courseCodes.push(theCourse._id);
        });
        Course.find({_id : courseCodes}, function(err, foundCourse) {
          var homeworkList = [];
          foundCourse.forEach(function(homeworkCourse) {
            homeworkList.push([homeworkCourse.course, homeworkCourse.homework]);
          });
          // var todaysBlocks = blockToTime((currentDate).getDay() -1);
          var todaysBlocks = blockToTime(0);
          var todaysOrderedClasses = [];

          for (var i = 0; i < todaysBlocks.length; i++) {
            var foundBlock = false;
            for (var j = 0; j < user.courses.length; j++) {
              if (user.courses[j].block === todaysBlocks[i]) {

                todaysOrderedClasses.push(user.courses[j].course);
                foundBlock = true;
              }
            }
            if (!foundBlock) {
              todaysOrderedClasses.push("LC's");
            }
          }

          Events.find({month : (currentDate).getMonth(), year : (currentDate).getFullYear()}, function(err, monthEvent) {
            let daysArray = [];
            let dayEvents = [];
            for (var i = 0; i < getDays(currentDate.getMonth()); i++) {
              let todayArray = [];
              let eventToday = false;
              dayEvents = [];
              for (var j = 0; j < monthEvent.length; j++) {
                if (monthEvent[j].day === i) {
                  eventToday = true;
                  dayEvents.push(monthEvent[j].time + ": " + monthEvent[j].info);
                }
              }
              if (!eventToday) {
                todayArray.push([]);
              } else {
                todayArray.push(dayEvents);
              }

              todayArray.push(i);
              todayArray.push(((new Date(months[currentDate.getMonth()] + "1" + currentDate.getFullYear())).getDay()+i)%7);
              daysArray.push(todayArray);

            }
            var courseCodes = [];
            for (var i = 0; i < user.courses.length; i++) {
              courseCodes.push(user.courses[i].code);
            }
            Resources.find({class : courseCodes}, function(err, resource) {
              // res.render("index",  {courses : user.courses, homework : homeworkList, todaysCourses : blockToTime((currentDate).getDay() -1)});

              user.courses.forEach(function(userCourse) {
                userCourse.resource = [];
                for (var i = 0; i < resource.length; i++) {
                  if (userCourse.code === resource[i].class) {

                    userCourse.resource.push(resource[i]);
                  }
                }

              });

              res.render("index",  {courses : user.courses, homework : homeworkList, todaysCourses : blockToTime(3), blockOrder : todaysOrderedClasses, calendar : daysArray, month: months[currentDate.getMonth()], lcSchedule : lcSchedule(3)});
            });

          });
        });
      }
    });
  } else {
    res.redirect("/login");
  }
});

//handles post requests for /submit
app.post("/submit", urlencodedParser, function(req, res) {
  var tampered = false;
  for (var key in req.body) {
    if (key != "courseID" && key != "page" && key != "questions" && key != "assignment" && key != "notes" && key != "submittedBy" && key != "confirmed") {
      tampered = true;

    }
  }
  if (req.session.userId && !tampered) {
    Course.findOne({_id : req.body.courseID}, function(err, course) {
        req.body.date = new Date;
        var newWork = course.homework;
        newWork.push(req.body);

        Course.findOneAndUpdate({_id : req.body.courseID}, {homework : newWork}).then(function() {

        });
    });
    res.redirect("/");
  } else if (!req.session.userId) {
    res.redirect("/login");
  } else if (tampered) {
    //gonna add a ban function
    User.findOneAndUpdate({_id : req.session.userId}, {banned : true}).then(function() {
        res.redirect("/login?banned=true");
    });
  }
});

//handles get requests for /calendar
app.get("/calendar", function(req, res) {
  let currentDate = new Date();
  let monthsArray = [];
  let monthsNames = ["September", "October", "November", "December", "January", "February", "March", "April", "May", "June"];
  Events.find({year : (currentDate).getFullYear()}, function(err, yearEvent) {
    let theDay = new Date("september 1" + currentDate.getFullYear().toString()).getDay();
    let daysArray = [];
    let sumDays = 0;
    let foundEvent = false;
    for (var i = 0; i < 10; i++) {
      let currentMonth = [];
      for (var j = 0; j < getDays((i+8)%12); j++) {
        let dayEvents = [];
        foundEvent = false;
        for (var k = 0; k < yearEvent.length; k++) {
          if (yearEvent[k].month === (i+8)%12 && yearEvent[k].day === j) {
            foundEvent = true;
            dayEvents.push(yearEvent[k].time + ": " + yearEvent[k].info);
          }
        }
        currentMonth.push([dayEvents, j, (theDay%7)]);
        theDay++;
      }
      monthsArray.push(currentMonth);
    }

    res.render("calendar", {calendar : monthsArray, months : monthsNames});
  });

});

// handles get requests for /submit
app.get("/submit", function(req, res) {
  if (req.session.userId) {
    User.findOne({_id : req.session.userId}, function(err, user) {
        res.render("submitWork", {user : user.username, courses : user.courses, error : ""});
    });
  } else {
    res.redirect("/login");
  }
});

// handles get request for courses
app.get("/courses", function(req, res) {
    if (req.session.userId) {
      res.render("addCourses");
    } else {
      res.redirect("/login");
    }
});
// app.get("/courses", function(req, res) {
//   res.render("addCourses");
// });


//handles get requests for signup
app.get("/signup", function(req, res) {
  res.render("signup", {error : "", data : ["", "", "", ""]});
});



// handles get requests for login
app.get("/login", function(req, res) {
  // res.sendFile(__dirname + "/login.html");
  if (req.query.banned === "true" && req.session.userId) {
    res.render("login", {error : "The ban hammer has spoken. You can view content but can no longer edit."});
  } else {
      res.render("login", {error : ""});
  }

});

// handles post requests for courses
app.post("/courses", urlencodedParser, function(req, res) {


  if (req.session.userId) {
    Course.find({ code: req.body.coursesCode, block: req.body.coursesBlock }, (err, theCourse) => {

      let badCourses = [];
      let goodCourses = [];
      if (typeof req.body.coursesCode === "string") {
        goodCourses.push(theCourse);
      } else {
        for (var i = 0; i < req.body.coursesBlock.length; i++) {
          var currentCheck = req.body;
          theCourse.forEach(function(course) {
            if (course.code === currentCheck.coursesCode[i] && course.block === currentCheck.coursesBlock[i]) {
              goodCourses.push(course);
            }
          });
        }
      }
      theCourse = goodCourses;



      if (typeof req.body.coursesCode === "string") {
        if (theCourse === undefined || theCourse.length == 0) {
          badCourses.push(req.body.coursesCode);
        }
      } else {

        if (req.body.coursesCode.length != theCourse.length) {
          for (var i = 0; i < req.body.coursesCode.length; i++) {
            var found = false;
            for (var j = 0; j < theCourse.length; j++) {
              if (theCourse[j].code === req.body.coursesCode[i]) {
                found = true;
              }
            }
            if (!found) {
              badCourses.push(req.body.coursesCode[i]);
            }
          }
        } else {

        }
      }

      User.findOneAndUpdate({_id : req.session.userId}, {courses : theCourse}).then(function() {

      });
    });


    res.redirect("/");
  } else {
    res.redirect("/login");
  }


});


// handles post requests for login
app.post("/login", urlencodedParser, async (req, res, next) => {

  try {
    let response = await User.authenticate(req.body.logname, req.body.logword);
    req.session.userId = response._id;
    res.cookie("sessionID", response._id);
    res.redirect('/');
  } catch(e) {
    console.log(e);
    res.render("login", {error : "Username or Password incorrect. Please try again."});
  }

});


//handles logout
app.get("/logout", function(req, res) {
  req.session.destroy();
  res.redirect("/login");
});



// handles post requests for signup
app.post("/signup", urlencodedParser, function(req, res) {
  if (req.body.password != req.body.passwordConf) {
    res.render("signup", {error : "Error : passwords do not match", data : [req.body.email, req.body.firstName, req.body.lastName]});
  } else if (req.body.username && req.body.firstName && req.body.lastName && req.body.password && (req.body.password === req.body.passwordConf)) {
    var userData = {
      firstName: req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1),
      lastName: req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1),
      username: req.body.username,
      password: req.body.password,
      email: req.body.username
    }
    try {
      User.create(userData,function(error, user) {
        if (error) {
          console.log(error);
          res.render("signup", {error : "Username is already being used. Please try again.", data : ["", req.body.firstName, req.body.lastName]});
        } else {
          req.session.userId = user._id;
          res.cookie("sessionID", req.session.userId);
          return res.redirect("/courses");
        }
      });
    } catch(e) {
      console.log(e);
    }


  } else {
    res.redirect("/signup");
  }
});

//handles get requests for /suggestions
app.get("/suggestions", function(req, res) {
  if (req.session.userId) {
    res.sendFile(__dirname + "/public/html/suggestions.html");
  } else {
    res.redirect("/login");
  }
});


//handles post requests for /suggestions
app.post("/suggestions", urlencodedParser, function(req, res) {

  if (req.session.userId) {
    User.findOne({_id : req.session.userId}, function(err, user) {
      if (((new Date()).getTime() - user.suggestions[user.suggestions.length-1][1].getTime())/1000 < 900) {
        
        res.redirect("/");
      } else {

        let mailOptions = {
          from: "pvsstudents@gmail.com",
          to: "aidaneglin@gmail.com",
          subject: "user suggestion",
          text: req.body.body + "\n\n\nsubmitted by: " + user.firstName + " " + user.lastName + " (" + user.username + ")"
        }
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
              console.log(error)
            res.redirect("/")
          } else {
            let suggestions = user.suggestions;
            suggestions.push([req.body.body, new Date()]);
            User.findOneAndUpdate({_id : req.session.userId}, {suggestions: suggestions}).then(function() {
              res.redirect("/");
            });
          }
        });
      }
    });



  } else {
    res.redirect("/login");
  }
});

//socket setup
app.get("/chatroom", function(req,res) {
  if (req.session.userId) {
    res.sendFile(__dirname + "/public/html/chatroom.html");

  } else {
    res.redirect("/login");
  }
});

let io = socket(server);

io.on("connection", function(socket) {


  socket.on("chat", function(data) {

    let id = mongoose.Types.ObjectId(data.id);
    User.findOne({_id : id}, function(err, user) {
      if (err) {

      } else {

        let userTextArray = user.texts;
        userTextArray.push(data.message);
        Texts.create({date : new Date(), body: data.message, submittedBy : user.username}, function(error, text) {
          if (error) {

          } else {

          }
        });
        User.findOneAndUpdate({_id : user._id}, {texts : userTextArray}).then(function() {
          data = {message : data.message, username : user.username, firstName: user.firstName, lastName:user.lastName};
          io.emit("chat", data);
        });
      }
    });
  });
});
