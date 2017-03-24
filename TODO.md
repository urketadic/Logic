#CLICK RAW TO READ THIS

# ADD AN ACTIVE CLASS TO THE HEADER ONLY WHEN THE PAGE IS SCROLLED
  - I've tried this but it didn't work: 
              [JAVASCRIPT]
                            $(function() {
                                $(window).on("scroll", function() {
                                    if($(window).scrollTop() > 50) {
                                        $(".header").addClass("active");
                                    } else {
                                        //remove the background property so it comes transparent again (defined in your css)
                                       $(".header").removeClass("active");
                                    }
                                });
                            });
               [CSS]
                          .active { background-color: #fff}

     
               =================

#FIX MOBILE NAVIGATION THAT IS NOT WORKING ON CERTAIN PAGES
  - Clicking on mobile nav menu doesn't react at all on pages like 4 steps and realtalk finder
