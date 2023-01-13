gsap.registerPlugin(ScrollTrigger);

(function () {
  var locomotive = new LocomotiveScroll({
   el: document.querySelector("[data-scroll-container]"),
   smooth: true,
   smartphone: {
      smooth: true
  },
  tablet: {
      smooth: true
  },
	smoothMobile: 1,
   multiplier: 1.0,
   getDirection: true,
  });

// Wait 2 seconds then calculate the new page height
setTimeout(() => {  
	LocomotiveScroll.update();
}, 2000);

  locomotive.on("scroll", () => {
   ScrollTrigger.update();
  });

  ScrollTrigger.scrollerProxy("[data-scroll-container]", {
   scrollTop(value) {
     return arguments.length
     ? locomotive.scrollTo(value, 0, 0)
     : locomotive.scroll.instance.scroll.y;
   },
   getBoundingClientRect() {
     return {
       top: 0,
       left: 0,
       width: window.innerWidth,
       height: window.innerHeight,
     };
   },
   pinType: document.querySelector("[data-scroll-container]").style.transform
     ? "transform"
     : "fixed",
  });

  ScrollTrigger.defaults({
   scroller: "[data-scroll-container]",
  });

  ScrollTrigger.addEventListener("refresh", () => locomotive.update());
  ScrollTrigger.refresh();


$(".marquee_hero").each(function (index) {
  let track = $(this).find(".marquee_hero_track");
  let items = $(this).find(".marquee_item");
  let tl = gsap.timeline({ repeat: -1, defaults: { ease: "expo.inOut", duration: 1, delay: 1 } });

  items.each(function (index) {
    let distance = (index + 1) * -100;
    tl.to(track, { yPercent: distance });
  });

  items.first().clone().appendTo(track);
});


window.addEventListener("DOMContentLoaded", (event) => {
  // Split text into spans
  let typeSplit = new SplitType("[text-split]", {
    types: "words, chars",
    tagName: "span"
  });

  // Link timelines to scroll position
  function createScrollTrigger(triggerElement, timeline) {
    // Reset tl when scroll out of view past bottom of screen
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top bottom",
      onLeaveBack: () => {
        timeline.progress(0);
        timeline.pause();
      }
    });
    // Play tl when scrolled into view (60% from top of screen)
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top 60%",
      onEnter: () => timeline.play()
    });
  }

  $("[words-slide-up]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this).find(".word"), { opacity: 0, yPercent: 100, duration: 0.5, ease: "back.out(2)", stagger: { amount: 0.5 } });
    createScrollTrigger($(this), tl);
  });

  $("[words-rotate-in]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.set($(this).find(".word"), { transformPerspective: 1000 });
    tl.from($(this).find(".word"), { rotationX: -90, duration: 0.6, ease: "power2.out", stagger: { amount: 0.6 } });
    createScrollTrigger($(this), tl);
  });

  $("[words-slide-from-right]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this).find(".word"), { opacity: 0, x: "1em", duration: 0.6, ease: "power2.out", stagger: { amount: 0.2 } });
    createScrollTrigger($(this), tl);
  });

  $("[letters-slide-up]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this).find(".char"), { yPercent: 100, duration: 0.2, ease: "power1.out", stagger: { amount: 0.6 } });
    createScrollTrigger($(this), tl);
  });

  $("[letters-slide-down]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this).find(".char"), { yPercent: -120, duration: 0.3, ease: "power1.out", stagger: { amount: 0.7 } });
    createScrollTrigger($(this), tl);
  });

  $("[letters-fade-in]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this).find(".char"), { opacity: 0, duration: 0.2, ease: "power1.out", stagger: { amount: 0.8 } });
    createScrollTrigger($(this), tl);
  });

  $("[letters-fade-in-random]").each(function (index) {
    let tl = gsap.timeline({ paused: true });
    tl.from($(this).find(".char"), { opacity: 0, duration: 0.05, ease: "power1.out", stagger: { amount: 0.4, from: "random" } });
    createScrollTrigger($(this), tl);
  });

  $("[scrub-each-word]").each(function (index) {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: $(this),
        start: "top 90%",
        end: "top center",
        scrub: true
      }
    });
    tl.from($(this).find(".word"), { opacity: 0.2, duration: 0.2, ease: "power1.out", stagger: { each: 0.4 } });
  });

  // Avoid flash of unstyled content
  gsap.set("[text-split]", { opacity: 1 });
});
</script>

<script>
const init = () => {
  const marquee = document.querySelector('[wb-data="marquee"]');
  if (!marquee) {
    return;
  }
  const duration = parseInt(marquee.getAttribute("duration"), 30) || 5;
  const marqueeContent = marquee.firstChild;
  if (!marqueeContent) {
    return;
  }

  const marqueeContentClone = marqueeContent.cloneNode(true);
  marquee.append(marqueeContentClone);

  let tween;

  const playMarquee = () => {
    let progress = tween ? tween.progress() : 0;
    tween && tween.progress(0).kill();
    const width = parseInt(
      getComputedStyle(marqueeContent).getPropertyValue("width"),
      10
    );
    const gap = parseInt(
      getComputedStyle(marqueeContent).getPropertyValue("column-gap"),
      10
    );
    const distanceToTranslate = -1 * (gap + width);

    tween = gsap.fromTo(
      marquee.children,
      { x: 0 },
      { x: distanceToTranslate, duration, ease: "none", repeat: -1 }
    );
    tween.progress(progress);
    console.log({ width });
  };
  playMarquee();

  function debounce(func) {
    var timer;
    return function (event) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(
        () => {
          func();
        },
        500,
        event
      );
    };
  }

  window.addEventListener("resize", debounce(playMarquee));

  // console.log({ marquee, marqueeContent });
};

document.addEventListener("DOMContentLoaded", init);


html.has-scroll-smooth {
    overflow: hidden;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;  
}
