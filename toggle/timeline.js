CSSPlugin.defaultTransformPerspective = 400;
var playBtn = $("#playBtn"),
    pauseBtn = $("#pauseBtn"),
    resumeBtn = $("#resumeBtn"),
    time = $("#time"),
    progress = $("#progress"),
    timeScale = $("#timeScale"),
    buttons = [playBtn, pauseBtn, resumeBtn],
    tagline = new SplitText(".tagline")
tl = new TimelineLite({onUpdate:updateSlider, delay:0.4});

TweenLite.set("#demo", {visibility:"visible"})

tl.from("#timeline_txt", 0.6, {y:-30, opacity:0})
  .from("#lite_txt", 0.6, {y:30, opacity:0}, "-=0.3")
  .staggerFrom(tagline.chars, 0.3, {rotation:90, scale:0, y:-60, ease:Back.easeOut}, 0.05)
.staggerFrom("li", 0.2, {y:20, opacity:0}, 0.1)
.set(buttons, {opacity:0.2})

// controls

$("#playBtn").on("click", function(){
  //Play the timeline forward from the current position.
  //If tween is complete, play() will have no effect
  tl.play();
});

$("#pauseBtn").on("click", function(){
  tl.pause();
});

$("#resumeBtn").on("click", function(){
  //Resume playback in current direction.
  tl.resume();
});

$("#reverseBtn").on("click", function(){
  tl.reverse();
});

$("#restartBtn").on("click", function(){
  tl.restart();
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




