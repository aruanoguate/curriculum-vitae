(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
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
    // Use Bootstrap 5's Collapse API
    const navbarCollapse = document.getElementById('navbarSupportedContent');
    if (navbarCollapse) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      if (bsCollapse) {
        bsCollapse.hide();
      } else {
        // Create new collapse instance if it doesn't exist
        const collapse = new bootstrap.Collapse(navbarCollapse, {
          toggle: false
        });
        collapse.hide();
      }
    }
  });

  // Activate scrollspy to add active class to navbar items on scroll
  // https://getbootstrap.com/docs/5.0/components/scrollspy/#methods
  const scrollSpy = new bootstrap.ScrollSpy(document.body, {
    target: '#sideNav'
  });

  // Export for potential testing or debugging
  window.ResumeApp = {
    scrollSpy: scrollSpy
  };

})(jQuery); // End of use strict
