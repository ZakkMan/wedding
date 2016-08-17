var gsap = require('gsap')
var SplitText = require('./vendor/SplitText.min.js');

document.onreadystatechange = function() {
  if ( document.readyState === 'complete' ) {
    console.log('ready');

    var image = document.getElementById('intro-image');
    var title = document.getElementById('intro-title');

    var timer = window.setTimeout(function() {

      TweenMax.to(image, 2, {
        opacity: 0.4,
        scale: 0.95,
        ease: Power4.easeOut
      })

      var mySplitText = new SplitText( title, { type: 'chars' } ),
          chars = mySplitText.chars

      console.log(chars);


      TweenMax.set(title, { opacity: 1 })

      TweenMax.staggerFromTo(chars, 2, {
        opacity: 0,
        y: 10
      }, {
        delay: 1,
        opacity: 1,
        y: 0,
        ease: Power4.easeOut
      },0.1)


    }, 250)

  }
}
