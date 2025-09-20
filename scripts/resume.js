(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      const target = $(this.hash);
      const fallbackTarget = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (fallbackTarget.length) {
        $('html, body').animate({
          scrollTop: (fallbackTarget.offset().top)
        }, 400, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  // https://getbootstrap.com/docs/5.0/components/scrollspy/#methods
  // eslint-disable-next-line no-unused-vars
  const _scrollSpy = new bootstrap.ScrollSpy(document.body, {
    target: '#sideNav'
  })

})(jQuery); // End of use strict
