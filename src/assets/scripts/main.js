var gsap = require('gsap')
var SplitText = require('./vendor/SplitText.min.js');

document.onreadystatechange = function() {
  if ( document.readyState === 'complete' ) {
    console.log('ready');

    var image = document.getElementById('intro-image'),
        title = document.getElementById('intro-title'),
        subtitle = document.getElementById('intro-subtitle'),
        more = document.getElementById('intro-more');

    var timer = window.setTimeout(function() {
      var tl = new TimelineLite();

      // animate image in
      tl.to(image, 1, {
        opacity: 0.4,
        scale: 0.95,
        ease: Power4.easeIn
      })

      // animate title in
      var mySplitText = new SplitText( title, { type: 'chars' } ),
          chars = mySplitText.chars

      tl.set(title, { opacity: 1 })
      tl.staggerFromTo(chars, 0.3, {
        opacity: 0,
        y: 10
      }, {
        opacity: 1,
        y: 0,
        ease: Power4.easeOut
      },0.03)

      // animate scroll text in
      tl.fromTo(subtitle, 0.3, {
        y: 10
      }, {
        y: 0,
        opacity: 1,
        ease: Power4.easeOut
      })

    }, 250)

  }
}
