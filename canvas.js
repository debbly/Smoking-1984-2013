var smokingData = [24.9, 26.7, 25.6, 21.4, 
                   22.7, 21.1, 19.4, 19.2,
                   20, 18.2, 16.6, 15.9,
                   17.8, 17.4, 17.5, 17.1,
                   16.3, 16.4, 15.8, 15.4,
                   14.6, 14, 13.3, 13.8,
                   13.3, 13.1, 11.9, 12,
                   12.7, 11.7];
var years = ['1984', '1985', '1986', '1987', 
                   '1988', '1989', '1990', '1991',
                   '1992', '1993', '1994', '1995',
                   '1996', '1997', '1998', '1999',
                   '2000', '2001', '2002', '2003',
                   '2004', '2005', '2006', '2007',
                   '2008', '2009', '2010', '2011',
                   '2012', '2013'];
// var smoke = {'1984': 24.9, '1985': 26.7, '1986': 25.6, '1987': 21.4,
//              '1988': 22.7, '1989': 21.2, '1990': 19.4, '1991': 19.2,
//              '1992': 20.0, '1993': 18.2, '1994': 16.6, '1995': 15.9,
//              '1996': 17.8, '1997': 17.4, '1998': 17.5, '1999': 17.1,
//              '2000': 16.3, '2001': 16.4, '2002': 15.8, '2003': 15.4,
//              '2004': 14.6, '2005':};

//make a checker to set Velocty
var setVel = false;

// Create an array to store our particles
var particles = [];

// The amount of particles to render
var particleCount = Math.floor(smokingData[0]) * 100;

var prevPart = particleCount;

// The maximum velocity in each direction
var maxVelocity = 20;

// The target frames per second (how often do we want to update / redraw the scene)
var targetFPS = 33;

// Set the dimensions of the canvas as variables so they can be used.
var canvasWidth = $(document).width() + 15;
var canvasHeight = $(document).height();
var halfWidth = canvasWidth/2.0;

// Create an image object (only need one instance)
var imageObj = new Image();

// Once the image has been downloaded then set the image on all of the particles
imageObj.onload = function() {
  particles.forEach(function(particle) {
    particle.setImage(imageObj);
  });
};

// Once the callback is arranged then set the source of the image
imageObj.src = "Smoke10.png";

// A function to create a particle object.
function Particle(context) {

  // Set the initial x and y positions
  this.x = 0;
  this.y = 0;

  // Set the initial velocity
  this.xVelocity = 0;
  this.yVelocity = 0;

  // Set the radius
  this.radius = 5;

  // Store the context which will be used to draw the particle
  this.context = context;

  // The function to draw the particle on the canvas.
  this.draw = function() {

    // If an image is set draw it
    if (this.image) {
      this.context.drawImage(this.image, this.x - 128, this.y - 128);
      // If the image is being rendered do not draw the circle so break out of the draw function                
      return;
    }
    // Draw the circle as before, with the addition of using the position and the radius from this object.
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    this.context.fillStyle = "rgba(0, 255, 255, 1)";
    this.context.fill();
    this.context.closePath();
  };

  // Update the particle.
  this.update = function() {
    // Update the position of the particle with the addition of the velocity.
    this.x += this.xVelocity;
    this.y += this.yVelocity;

    // Check if has crossed the right edge
    if (this.x >= canvasWidth) {
      this.xVelocity = -this.xVelocity;
      this.x = canvasWidth;
    }
    // Check if has crossed the left edge
    else if (this.x <= 0) {
      this.xVelocity = -this.xVelocity;
      this.x = 0;
    }

    // Check if has crossed the bottom edge
    if (this.y >= canvasHeight) {
      this.yVelocity = -this.yVelocity;
      this.y = canvasHeight;
    }

    // Check if has crossed the top edge
    else if (this.y <= 0) {
      this.yVelocity = -this.yVelocity;
      this.y = 0;
    }
  };

  // A function to set the position of the particle.
  this.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
  };

  // Function to set the velocity.
  this.setVelocity = function(x, y) {
    this.xVelocity = x;
    this.yVelocity = y;
  };

  this.setImage = function(image) {
    this.image = image;
  }
}

// A function to generate a random number between 2 values
function generateRandom(min, max) {
  return Math.random() * (max - min) + min;
}

// The canvas context if it is defined.
var context;

// Initialise the scene and set the context if possible
function init() {
  var canvas = document.getElementById('myCanvas');
  if (canvas.getContext) {

    // Set the context variable so it can be re-used
    context = canvas.getContext('2d');

    // Create the particles and set their initial positions and velocities
    for (var i = 0; i < particleCount; ++i) {
      var particle = new Particle(context);

      // Set the position to be inside the canvas bounds
      particle.setPosition(generateRandom(0, canvasWidth), generateRandom(0, canvasHeight));

      // Set the initial velocity to be either random and either negative or positive
      particle.setVelocity(generateRandom(-maxVelocity, maxVelocity), generateRandom(-maxVelocity, maxVelocity));
      particles.push(particle);
    }
  } else {
    alert("Please use a modern browser");
  }
}

var playBtn = $("#playBtn"),
    pauseBtn = $("#pauseBtn"),
    resumeBtn = $("#resumeBtn"),
    time = $("#time"),
    percentage = $("#percent"),
    year = $("#year_"),
    progress = $("#progress"),
    timeScale = $("#timeScale"),
    buttons = [playBtn, pauseBtn, resumeBtn]
tl = new TimelineLite({onUpdate:updateSlider, delay:1.5});

TweenLite.set("#demo", {visibility:"visible"})

tl.from("#timeline_txt", 90.0, {y:-30, opacity:0})
  .from("#lite_txt", 90.3, {y:30, opacity:0}, "-=0.3")
.staggerFrom("li", 10.0, {y:20, opacity:0}, 0.1)
.set(buttons, {opacity:0.2});

$('#progressSlider').append('<div class="my-handle ui-slider-handle"><svg height="18" width="14"><rect width="5" height="20"/></svg></div>');
$('#timeScaleSlider').append('<div class="my-handle ui-slider-handle"><svg height="18" width="14"><rect width="5" height="20"/></svg></div>');


$( "#progressSlider" ).slider({
  range: false,
  min: 0,
  max: 1,
  step:.001,
  slide: function ( event, ui ) {
    tl.progress( ui.value ).pause();
  }
}); 

function updateSlider() {
  time.html(Math.floor(tl.time().toFixed(2)));
  progress.html(tl.progress().toFixed(2));

  var percentageD = smokingData[Math.floor(tl.progress()/0.0334)];
  percentage.html(percentageD + '%');
  year.html(years[Math.floor(tl.progress()/0.0334)]);
  particleCount = Math.floor(percentageD) * 100;

  if (percentageD > 24) {
      maxVelocity = 20;
  } else if (percentageD > 20) {
      maxVelocity = 15;
  } else if (percentageD > 17) {
      maxVelocity = 10;
  } else if (percentageD > 13) {
      maxVelocity = 5;
  } else if (percentageD > 5) {
      maxVelocity = 2;
  }

  $("#progressSlider").slider("value", tl.progress());

  if (prevPart != particleCount) {
      //console.log(true);
      particles = [];
      prevPart = particleCount;

      init();
      update();
  }
 // Draw the scene
  draw();
} 


// The function to draw the scene
function draw() {
  // Clear the drawing surface and fill it with a black background
  context.fillStyle = "rgba(0, 0, 0, 0.5)";
  context.fillRect(0, 0, $(document).width(), $(document).height());

  // Go through all of the particles and draw them.
  particles.forEach(function(particle) {
    particle.draw();
  });
}

// Update the scene
function update() {
  particles.forEach(function(particle) {
    particle.setImage(imageObj);
    particle.update();
  });
}

// Initialize the scene
init();

// If the context is set then we can draw the scene (if not then the browser does not support canvas)
if (context) {
  setInterval(function() {
    // Update the scene befoe drawing
    update();

    // // Draw the scene
    // draw();
  }, 1000 / targetFPS);
}

// controls

$("#playBtn").on("click", function(){
  //Play the timeline forward from the current position.
  //If tween is complete, play() will have no effect
  tl.play();
});

$("#pauseBtn").on("click", function(){
  tl.pause();
});


$("#reverseBtn").on("click", function(){
  tl.reverse();
});

$("#timeScaleSlider").slider({
  value:1,
  range: false,
  min: 0.25,
  max: 4,
  step:0.25,
  slide: function ( event, ui ) {
    tl.timeScale(ui.value );
    timeScale.html(ui.value)
  },
  change: function() {
    if(tl.paused()){
      tl.resume();
    }
    
    if (tl.progress() == 1){
      tl.restart();
    }
    
    if(tl.reversed() && tl.progress() === 0){
      tl.restart();
    }
  }
  
}); 