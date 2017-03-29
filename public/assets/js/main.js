//
// main js
// --------------------------------------------------
//

var $ = jQuery.noConflict();

(function($) {
  'use strict';

//
// function start
// --------------------------------------------------
//

//
// variable
// --------------------------------------------------
//

  var $html = $('html');
  var $body = $('body');
  var $linkBtn = $('.btn[data-link]');
  var $linkMenu = $('.site-nav__menu').find('[data-link]');
  var $link = $linkBtn.add($linkMenu);
  var imgPath = 'assets/img';

//
// ie10 viewport fix
// --------------------------------------------------
//

  (function() {
    'use strict';
    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
      var msViewportStyle = document.createElement('style')
      msViewportStyle.appendChild(
        document.createTextNode(
          '@-ms-viewport{width:auto!important}'
        )
      )
      document.querySelector('head').appendChild(msViewportStyle)
    }
  })();

//
// core
// --------------------------------------------------
//
  // device detect
  if (!$html.hasClass('desktop')) {
    var isMobile = true;
    $html.addClass('is-mobile');
  } else {
    var isMobile = false;
    $html.addClass('is-desktop');
  }

  // browser detect
  if ($html.hasClass('ie9')) {
    var isIE9 = true;
  }

//
// init
// --------------------------------------------------
//

  function fn_init() {
    var id;    

    id = '#' + $('.section').filter('.is-active').attr('id');
    $('[data-link="' + id + '"]').addClass('is-active');


    if ($html.hasClass('cssanimations')) {
      $(id).find('[data-animation-in]').each(function() {
        var $this = $(this);
        var animationIn = 'fadeIn';
        var animationInDelay = 1;

        if ($this.data('animation-in')) {
          animationIn = $this.data('animation-in');
        }

        if ($this.data('animation-in-delay')) {
          animationInDelay = $this.data('animation-in-delay');
        }

        $this.css('animation-delay', animationInDelay + 500 + 'ms').addClass('animated').addClass(animationIn);
      });
    }

    // add loader class
    if (!_section_change_loader) {
      $body.addClass('is-site-loader-off');
    }

    // overlay
    if (_site_bg_overlay_toggle) {
      $body.addClass('is-overlay-on');
    } else {
      $body.addClass('is-overlay-off');
    }

    $('.site-bg__overlay').css('background-color', _site_bg_overlay_color);

    // add active class
    $body.addClass(id.replace('#', '') + '-in');

    // click event
    $('a[href=#]').on('click', function(e) {
      e.preventDefault();
    });

    // clone social
    $('.site-footer__social').clone().removeClass('site-footer__social').addClass('site-nav__social').insertAfter('.site-nav__menu');

    // border
    if (_site_border) {
      $body.addClass('is-border-on');
    } else {
      $body.addClass('is-border-off');
    }
  }
  $(document).on('ready', function() {
    fn_init();

    var isaudio;
    if($("body").hasClass("is-audio-on")) {
    	isaudio = true;
    } else {
    	isaudio = false;
    }

    if(isaudio = true) {
    	$("#videoPlayer").mute = false; 
    } else {
    	$("body").addClass("is-audio-off")
    	$("#videoPlayer").mute = true;
    }

  });

//
// countdown
// --------------------------------------------------
//

  function fn_countdown() {
    var $countdown = $('#countdown_dashboard');

    if (_countdown) {
      if ($countdown.length) {
        $body.addClass('is-countdown-on');

        $countdown.countDown({
          targetDate: {
            'day':      _countdown_date[2],
            'month':    _countdown_date[1],
            'year':     _countdown_date[0],
            'hour':     0,
            'min':      0,
            'sec':      0,
            'utc':      _countdown_utc // time set as UTC
          },
          omitWeeks: true // 3-digit days
        });
      }
    } else {
      $body.addClass('is-countdown-off');
    }
  }
  fn_countdown();

//
// size
// --------------------------------------------------
//

  function fn_size() {
    var $size = $('[data-size]');

    $size.each(function() {
      var $this = $(this);

      $this.css({'width': $this.data('size'), 'height': $this.data('size')});
    });
  }
  fn_size();

//
// site loader
// --------------------------------------------------
//


  function fn_siteLoader() {
    $('.site-loader').velocity('fadeOut', {
      queue: false,
      delay: 0,
      duration: 0,
      complete: function() {
        $body.addClass('is-loaded');
        $(document).trigger('is-loaded');
      }
    });
  }

//
// nav
// --------------------------------------------------
//

  function fn_siteNav() {
    $('.site-header__icon__nav').find('a').add($linkMenu).on('click', function(e) {
      e.preventDefault();

      fn_siteNavAnimation();
    });
  }

  function fn_siteNavAnimation() {
    var $siteNav = $('.site-nav');

    $body.toggleClass('nav-in');

    if ($body.hasClass('nav-in')) {
      $siteNav.velocity('stop', true)
      .velocity('fadeIn', {
        duration: 100
      });

      $('.site-nav__inner').velocity('stop', true)
      .velocity({
        translateY: ['0', '-25%'],
        rotateX: ['0deg', '35deg'],
        opacity: ['1', '.4']
      }, {
        duration: 100
      });
    } else {
      $siteNav.velocity('stop', true)
      .velocity('fadeOut', {
        duration: 100
      });

      $('.site-nav__inner').velocity('stop', true)
      .velocity({
        translateY: ['25%', '0'],
        rotateX: ['-35deg', '0deg'],
        opacity: ['.4', '1']
      }, {
        duration: 100
      });
    }
  }
  fn_siteNav();

//
// menu
// --------------------------------------------------
//

  function fn_menu() {
    var $section = $('.section');
    var ids = [];

    $section.each(function() {
      ids.push(this.id);
    });

    $link.on('click', function(e) {
      var $this = $(this);
      var id = $this.data('link');
      var animationDelay = 1;

      e.preventDefault();

      if (!$(id).length || $this.hasClass('is-active')) {
        return false;
      }

      if ($body.hasClass('is-loaded')) {
        if (!$body.hasClass('animating')) {
          $link.filter('.is-active').removeClass('is-active');

          fn_animationOut();

          if ($html.hasClass('cssanimations')) {
            $section.filter('.is-active').find('[data-animation-out]').each(function() {
              var animationOutDelay = $(this).data('animation-out-delay');

              if (animationOutDelay) {
                animationDelay = animationOutDelay > animationDelay ? animationOutDelay : animationDelay
              }
            });
          }

          $('.site-loader').velocity('fadeIn', {
            queue: false,
            delay: animationDelay + 400,
            duration: 300,
            complete: function() {
              $body.removeClass('animating');

              $('.site-wrap').scrollTop(0);
              $('.site-wrap').perfectScrollbar('update');

              $('.section').filter('.is-active').removeClass('is-active');
              $(id).addClass('is-active');
              $('[data-link="' + id + '"]').addClass('is-active');
              $.each(ids, function(i, v) {
                $body.removeClass(v + '-in');
              });
              $body.addClass(id.replace('#', '') + '-in');
              $('.form-group').removeClass('error');
              $('.form-notify').removeClass('success error').html('').hide();

              if (_section_change_loader) {
                $(this).velocity('fadeOut', {
                  delay: 100,
                  duration: 800,
                });
              } else {
                $(this).velocity('fadeOut', {
                  delay: 100,
                  duration: 100,
                });
              }


              setTimeout(function() {
                fn_animationIn();
              }, 0);
            }
          });
        }
      }
    });
  }
  fn_menu();

//
// animation
// --------------------------------------------------
//

  function fn_animationIn() {
    var $activeSection = $('.section').filter('.is-active');

    $activeSection.find('[data-animation-in]').each(function() {
      var $this = $(this);
      var animationIn = 'fadeIn';
      var animationInDelay = 100;

      if ($this.data('animation-in')) {
        animationIn = $this.data('animation-in');
      }

      if ($this.data('animation-in-delay')) {
        animationInDelay = $this.data('animation-in-delay');
      }

      $this.css('animation-delay', animationInDelay + 'ms').addClass('animated').addClass(animationIn);
    });
  }

  function fn_animationOut() {
    var animationDelay = 1;

    $body.addClass('animating');

    $('[data-animation-out]').each(function() {
      var $this = $(this);
      var animationIn = 'fadeIn';
      var animationOut = 'fadeOut';
      var animationInDelay = 100;
      var animationOutDelay = 1;

      if ($this.data('animation-in')) {
        animationIn = $this.data('animation-in');
      }

      if ($this.data('animation-out')) {
        animationOut = $this.data('animation-out');
      }

      if ($this.data('animation-in-delay')) {
        animationInDelay = $this.data('animation-in-delay');
      }

      if ($this.data('animation-out-delay')) {
        animationOutDelay = $this.data('animation-out-delay');
      }

      $this.css('animation-delay', animationInDelay + 'ms');

      if ($this.closest('.section').hasClass('is-active')) {
        $this.removeClass(animationIn).addClass(animationOut);

        if ($this.data('animation-out-delay')) {
          $this.css('animation-delay', animationOutDelay + 'ms');
        } else {
          $this.css('animation-delay', '1ms');
        }
      } else {
        $this.removeClass(animationIn).removeClass(animationOut).removeAttr('style', 'animation-delay');
      }
    });
  }

//
// mfp
// --------------------------------------------------
//

  function fn_mfp() {
    var $modalMix = $('[data-mfp-type="mix"]');
    var $modalInline = $('[data-mfp-type="inline"]');

    $modalInline.magnificPopup({
      midClick: true,
      removalDelay: 150,
      preloader: false,
      callbacks: {
        beforeOpen: function() {
          this.st.mainClass = this.st.el.attr('data-mfp-effect');
        }
      }
    });

    $modalMix.each(function() {
      $(this).magnificPopup({
        delegate: 'a[data-mfp-type]',
        type: 'image',
        gallery: {
          enabled: true,
          preload: [0,2],
          navigateByImgClick: true,
          arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
          tPrev: 'Previous (Left arrow key)',
          tNext: 'Next (Right arrow key)',
          tCounter: '<span class="mfp-counter">%curr% of %total%</span>'
        },
        image: {
          cursor: 'mfp-zoom-out-cur',
          titleSrc: 'title',
          verticalFit: true,
          tError: '<a href="%url%">The image</a> could not be loaded.',
        },
        mainClass: 'mfp-effect',
        midClick: true,
        removalDelay: 150,
        preloader: false
      });
    });
  }
  fn_mfp();


//
// contact
// --------------------------------------------------
//

  function fn_contact() {
    var $form = $('#formContact');
    var $formNotify = $form.find('.form-notify');

    $form.validate({
      onclick: false,
      onfocusout: false,
      onkeyup: false,
      rules: {
        name: {
          required: true
        },
        email: {
          required: true,
          email: true
        },
        message: {
          required: true
        }
      },
      errorPlacement: function(error, element) {},
      highlight: function(element) {
        $(element).parent('.form-group').addClass('error');
      },
      unhighlight: function(element) {
        $(element).parent('.form-group').removeClass('error');
      },
      submitHandler: function(form) {
        $.ajax({
          type: 'POST',
          dataType: 'json',
          url: 'assets/php/contact.php',
          cache: false,
          data: $form.serialize(),
          success: function(data) {
            if (data.type != 'success') {
              $formNotify.html(data.msg).show();
            } else {
              $form.validate().resetForm();
              $form[0].reset();
              $form.find('.error').removeClass('error');
              $form.find('button').blur();
              $formNotify.html(data.msg).show();
            }
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            $formNotify.html('<i class="error"></i> An error occurred. Please try again later.').show();
          },
        });
      },
      invalidHandler: function(event, validator) {
        var errors = validator.numberOfInvalids();

        if (errors) {
          var message = errors == 1 ?
          '<i class="error"></i> You missed 1 field. It has been highlighted.' :
          '<i class="error"></i> You missed ' + errors + ' fields. They have been highlighted.';
          $formNotify.html(message).show();
        }
      }
    });
  }
  fn_contact();

  function fn_subscribe() {
    var $form = $('#formSubscribe');
    var $formNotify = $form.find('.form-notify');

    $form.validate({
      onclick: false,
      onfocusout: false,
      onkeyup: false,
      rules: {
        email: {
          required: true,
          email: true
        }
      },
      errorPlacement: function(error, element) {},
      highlight: function(element) {
        $(element).parent('.form-group').addClass('error');
      },
      unhighlight: function(element) {
        $(element).parent('.form-group').removeClass('error');
      },
      submitHandler: function(form) {
        $.ajax({
          type: 'POST',
          dataType: 'json',
          url: 'assets/php/subscribe.php',
          cache: false,
          data: $form.serialize(),
          success: function(data) {
            if (data.type != 'success') {
              $formNotify.html(data.msg).show();
            } else {
              $form.validate().resetForm();
              $form[0].reset();
              $form.find('.error').removeClass('error');
              $form.find('button').blur();
              $formNotify.html(data.msg).show();
            }
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            $formNotify.html('<i class="error"></i> An error occurred. Please try again later.').show();
          },
        });
      },
      invalidHandler: function(event, validator) {
        var errors = validator.numberOfInvalids();

        if (errors) {
          var message = errors == 1 ?
          '<i class="error"></i> You missed 1 field. It has been highlighted.' :
          '<i class="error"></i> You missed ' + errors + ' fields. They have been highlighted.';
          $formNotify.html(message).show();
        }
      }
    });
  }
  fn_subscribe();

//
// site background
// --------------------------------------------------
//

  function fn_siteBg() {
    // mobile
    if (isMobile) {
      if (_bg_style_mobile == 3 || _bg_style_mobile == 4) {
        fn_siteBgImg();
      }
      else if (_bg_style_mobile == 5 || _bg_style_mobile == 6 || _bg_style_mobile == 7 || _bg_style_mobile == 8) {
        $(window).on('load', function() {
          fn_siteBgSlideshow();
        });
      }
    }

    // desktop
    else {
      if (_bg_style_desktop == 3 || _bg_style_desktop == 4) {
        fn_siteBgImg();
      }
      else if (_bg_style_desktop == 5 || _bg_style_desktop == 6 || _bg_style_desktop == 7 || _bg_style_desktop == 8) {
        fn_siteBgSlideshow();
      }
      else if (_bg_style_desktop == 9 || _bg_style_desktop == 10 || _bg_style_desktop == 11) {
        fn_siteBgVideo();
      }
      else if (_bg_style_desktop == 12 || _bg_style_desktop == 13 || _bg_style_desktop == 14) {
        fn_siteBgVideoYoutube();
      }
    }
  }
  fn_siteBg();

//
// image background
// --------------------------------------------------
//

  function fn_siteBgImg() {
    $('.site-bg__video').remove();

    $body.addClass('is-site-bg-img');
  }

//
// slideshow background
// --------------------------------------------------
//

  function fn_siteBgSlideshow() {
    var $siteBgImg = $('.site-bg__img');

    $('.site-bg__video').remove();

    $body.addClass('is-site-bg-slideshow');
    for (var i = 1; i <= _bg_slideshow_image_amount; i++) {
      $siteBgImg.append('<img src="assets/img/bg/site-bg-slideshow-' + (i < 10 ? '0' + i : i) + '.jpg">');
    }

    if (isMobile) {
      if (_bg_style_mobile == 5 || _bg_style_mobile == 6) {
        fn_ss();
      } else if (_bg_style_mobile == 7 || _bg_style_mobile == 8) {
        fn_kenburnsy();
      }
    }
    else {
      if (_bg_style_desktop == 5 || _bg_style_desktop == 6) {
        fn_ss();
      } else if (_bg_style_desktop == 7 || _bg_style_desktop == 8) {
        fn_kenburnsy();
      }
    }

    function fn_ss() {
      $siteBgImg.ss({
        fullscreen: true,
        duration: _bg_slideshow_duration,
        fadeInDuration: 1500
      });
    }

    function fn_kenburnsy() {
      $siteBgImg.kenburnsy({
        fullscreen: true,
        duration: _bg_slideshow_duration,
        fadeInDuration: 1500
      });
    }
  }

//
// html5 video background
// --------------------------------------------------
//

  function fn_siteBgVideo() {
    var $video = $('.site-bg__video');
    var $audio = $('.site-header__icon__audio');

    $body.addClass('is-site-bg-video');

    $video.append('<video id="videoPlayer" autoplay loop>' +
                  '<source src="assets/video/video.mp4" type="video/mp4">' +
                  '</video>');

    var videoPlayer = document.getElementById('videoPlayer');

    if (_bg_style_desktop == 9) {
      videoPlayer.muted = true;
      $audio.remove();
    } else if (_bg_style_desktop == 10) {
      $body.addClass('is-audio-on');

      $audio.on('click', function() {
        if ($body.hasClass('is-audio-on')) {
          videoPlayer.muted = true;
          $body.removeClass('is-audio-on').addClass('is-audio-off');
        } else if ($body.hasClass('is-audio-off')) {
          videoPlayer.muted = false;
          $body.removeClass('is-audio-off').addClass('is-audio-on');
        }
      });
    }
  }

//
// youtube video background
// --------------------------------------------------
//

  function fn_siteBgVideoYoutube() {
    var $video = $('.site-bg__video');
    var $audio = $('.site-header__icon__audio');

    $body.addClass('is-site-bg-video-youtube');
    if (_bg_style_desktop == 12 || _bg_style_desktop == 14) {
      $video.attr('data-property', '{videoURL: _bg_video_youtube_url, autoPlay: true, loop: _bg_video_youtube_loop, startAt: _bg_video_youtube_start, stopAt: _bg_video_youtube_end, mute: true, quality: _bg_video_youtube_quality, realfullscreen: true, optimizeDisplay: true, addRaster: false, showYTLogo: false, showControls: false, stopMovieOnBlur: false, containment: "self"}');
      $video.YTPlayer();
    } else {
      $video.attr('data-property', '{videoURL: _bg_video_youtube_url, autoPlay: true, loop: _bg_video_youtube_loop, startAt: _bg_video_youtube_start, stopAt: _bg_video_youtube_end, mute: false, quality: _bg_video_youtube_quality, realfullscreen: true, optimizeDisplay: true, addRaster: false, showYTLogo: false, showControls: false, stopMovieOnBlur: false, containment: "self"}');
      $video.YTPlayer();

      $body.addClass('is-audio-on');

      $audio.on('click', function() {
        if ($body.hasClass('is-audio-on')) {
          $video.YTPMute()
          $body.removeClass('is-audio-on').addClass('is-audio-off');
        } else if ($body.hasClass('is-audio-off')) {
          $video.YTPUnmute()
          $body.removeClass('is-audio-off').addClass('is-audio-on');
        }
      });
    }
  }

//
// background audio
// --------------------------------------------------
//

  function fn_siteBgAudio() {
    if (_bg_style_mobile == 2 || _bg_style_mobile == 4 || _bg_style_mobile == 6 || _bg_style_mobile == 8 || _bg_style_desktop == 2 || _bg_style_desktop == 4 || _bg_style_desktop == 6 || _bg_style_desktop == 8 || _bg_style_desktop == 11 || _bg_style_desktop == 14) {
      $body.append('<audio id="audioPlayer" loop>' +
                   '<source src="assets/audio/audio.mp3" type="audio/mpeg">' +
                   '</audio>');
    }

    if (isMobile) {
      if (_bg_style_mobile == 2 || _bg_style_mobile == 4 || _bg_style_mobile == 6 || _bg_style_mobile == 8) {
        $body.addClass('is-audio-off');
        fn_siteBgAudioControl();
      }
    } else {
      if (_bg_style_desktop == 2 || _bg_style_desktop == 4 || _bg_style_desktop == 6 || _bg_style_desktop == 8 || _bg_style_desktop == 11 || _bg_style_desktop == 14) {
        var $audioPlayer = document.getElementById('audioPlayer');

        $body.addClass('is-audio-off');
        $audioPlayer.pause();
        fn_siteBgAudioControl();
      }
    }

    function fn_siteBgAudioControl() {
      var $audio = $('.site-header__icon__audio');
      var $audioPlayer = document.getElementById('audioPlayer');
        
      $audio.on('click', function() {
        var $this = $(this);

        if ($body.hasClass('is-audio-off')) {
          $audioPlayer.play();
          $body.removeClass('is-audio-off').addClass('is-audio-on');
        } else if ($body.hasClass('is-audio-on')) {
          $audioPlayer.pause();
          $body.removeClass('is-audio-on').addClass('is-audio-off');
        }
      });
    }
  }
  fn_siteBgAudio();

//
// background effect
// --------------------------------------------------
//

  function fn_siteBgEffect() {
    if (_bg_effect == 0) {
    } else if (_bg_effect == 1) {
      $(window).on('load', function() {
        fn_siteBgCloud();
      });
    } else if (_bg_effect == 2) {
      $(window).on('load', function() {
        fn_siteBgParallaxStar();
      });
    } else if (_bg_effect == 3) {
      $(window).on('load', function() {
        fn_siteBgStar();
      });
    } else if (_bg_effect == 4) {
      $(window).on('load', function() {
        fn_siteBgBubble();
      });
    } else if (_bg_effect == 5) {
      $(window).on('load', function() {
        fn_siteBgSnow();
      });
    } else if (_bg_effect == 6) {
      $(window).on('load', function() {
        fn_siteBgParticles();
      });
    }
  }

  function fn_siteBgCloud() {
    var $siteBgEffect = $('.site-bg__effect');

    if ($siteBgEffect.length) {
      $siteBgEffect.append(
        '<div class="cloud"></div>' +
        '<div class="cloud"></div>' +
        '<div class="cloud"></div>'
      )

      $body.addClass('is-site-bg-cloud');

      fn_cloud01();
      fn_cloud02();
      fn_cloud03();

      $siteBgEffect.velocity({
        translateZ: '0',
        opacity: [_cloud_opacity, '0'],
      }, {
        display: 'block',
        duration: 3000
      });
    }
    $(document).trigger('is-bg-animation-loaded');
  }

  function fn_cloud01() {
    var $cloud = $('.cloud:nth-child(1)');

    $cloud.velocity({
      translateZ: '0',
      translateX: ['-100%', '100%']
    }, {
      duration: 25000,
      easing: 'linear',
      queue: false,
      complete: function() {
        $(this).velocity({
          translateX: '100%'
        }, {
          duration: 0,
          queue: false,
          complete: fn_cloud01
        });
      }
    });
  }

  function fn_cloud02() {
    var $cloud = $('.cloud:nth-child(2)');

    $cloud.velocity({
      translateZ: '0',
      translateX: ['-100%', '100%']
    }, {
      duration: 35000,
      easing: 'linear',
      queue: false,
      complete: function() {
        $(this).velocity({
          translateX: '100%'
        }, {
          duration: 0,
          queue: false,
          complete: fn_cloud02
        });
      }
    });
  }

  function fn_cloud03() {
    var $cloud = $('.cloud:nth-child(3)');

    $cloud.velocity({
      translateZ: '0',
      translateX: ['-100%', '100%']
    }, {
      duration: 45000,
      easing: 'linear',
      queue: false,
      complete: function() {
        $(this).velocity({
          translateX: '100%'
        }, {
          duration: 0,
          queue: false,
          complete: fn_cloud03
        });
      }
    });
  }

  function fn_siteBgParallaxStar() {
    var $siteBgEffect = $('.site-bg__effect');

    if ($siteBgEffect.length) {
      $siteBgEffect.append(
        '<div class="star"></div>' +
        '<div class="star"></div>' +
        '<div class="star"></div>'
      )

      $body.addClass('is-site-bg-parallax-star');

      fn_star01();
      fn_star02();
      fn_star03();

      $siteBgEffect.velocity({
        translateZ: '0',
        opacity: [_parallax_star_opacity, '0'],
      }, {
        display: 'block',
        duration: 3000
      });
    }
    $(document).trigger('is-bg-animation-loaded');
  }

  function fn_star01() {
    var $star = $('.star:nth-child(1)');

    $star.velocity({
      translateZ: '0',
      translateY: ['-2000px', '0']
    }, {
      duration: 50000,
      easing: 'linear',
      queue: false,
      complete: function() {
        $(this).velocity({
          translateY: '0'
        }, {
          duration: 0,
          queue: false,
          complete: fn_star01
        });
      }
    });
  }

  function fn_star02() {
    var $star = $('.star:nth-child(2)');

    $star.velocity({
      translateZ: '0',
      translateY: ['-2000px', '0']
    }, {
      duration: 100000,
      easing: 'linear',
      queue: false,
      complete: function() {
        $(this).velocity({
          translateY: '0'
        }, {
          duration: 0,
          queue: false,
          complete: fn_star02
        });
      }
    });
  }

  function fn_star03() {
    var $star = $('.star:nth-child(3)');

    $star.velocity({
      translateZ: '0',
      translateY: ['-2000px', '0']
    }, {
      duration: 150000,
      easing: 'linear',
      queue: false,
      complete: function() {
        $(this).velocity({
          translateY: '0'
        }, {
          duration: 0,
          queue: false,
          complete: fn_star03
        });
      }
    });
  }

  function fn_siteBgStar() {
    $body.addClass('is-site-bg-star');
    $('.site-bg__effect').remove();

    particlesJS("siteBg", {
      "particles": {
        "number": {
          "value": 80,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#ffffff"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 3
          },
          "image": {
            "src": "",
            "width": 100,
            "height": 100
          }
        },
        "opacity": {
          "value": _star_opacity,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 2,
          "random": true,
          "anim": {
            "enable": true,
            "speed": 1,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": false,
          "distance": 150,
          "color": "#ffffff",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 1,
          "direction": _star_direction,
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": false,
            "mode": "repulse"
          },
          "onclick": {
            "enable": false,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 400,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });
    $(document).trigger('is-bg-animation-loaded');
  }

  function fn_siteBgBubble() {
    $body.addClass('is-site-bg-bubble');
    $('.site-bg__effect').remove();

    particlesJS("siteBg", {
      "particles": {
        "number": {
          "value": 6,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#fff"
        },
        "shape": {
          "type": "polygon",
          "stroke": {
            "width": 0,
            "color": "#000"
          },
          "polygon": {
            "nb_sides": 6
          },
          "image": {
            "src": "",
            "width": 100,
            "height": 100
          }
        },
        "opacity": {
          "value": _bubble_opacity,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 160,
          "random": false,
          "anim": {
            "enable": true,
            "speed": 10,
            "size_min": 40,
            "sync": false
          }
        },
        "line_linked": {
          "enable": false,
          "distance": 200,
          "color": "#ffffff",
          "opacity": 1,
          "width": 2
        },
        "move": {
          "enable": true,
          "speed": 8,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": false,
            "mode": "grab"
          },
          "onclick": {
            "enable": false,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 400,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });
    $(document).trigger('is-bg-animation-loaded');
  }

  function fn_siteBgSnow() {
    $body.addClass('is-site-bg-snow');
    $('.site-bg__effect').remove();

    particlesJS("siteBg", {
      "particles": {
        "number": {
          "value": 200,
          "density": {
            "enable": true,
            "value_area": 1000
          }
        },
        "color": {
          "value": "#fff"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          },
          "image": {
            "src": "",
            "width": 100,
            "height": 100
          }
        },
        "opacity": {
          "value": 0.84,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 5,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": false,
          "distance": 500,
          "color": "#ffffff",
          "opacity": 0.4,
          "width": 2
        },
        "move": {
          "enable": true,
          "speed": _snow_speed,
          "direction": "bottom",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": false,
            "mode": "bubble"
          },
          "onclick": {
            "enable": false,
            "mode": "repulse"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 400,
            "line_linked": {
              "opacity": 0.5
            }
          },
          "bubble": {
            "distance": 400,
            "size": 4,
            "duration": 0.3,
            "opacity": 1,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });
    $(document).trigger('is-bg-animation-loaded');
  }

  function fn_siteBgParticles() {
    $body.addClass('is-site-bg-particles');
    $('.site-bg__effect').remove();

    particlesJS("siteBg", {
      "particles": {
        "number": {
          "value": 60,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#ffffff"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          },
          "image": {
            "src": "",
            "width": 100,
            "height": 100
          }
        },
        "opacity": {
          "value": _particles_opacity,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#ffffff",
          "opacity": _particles_line_opacity,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": _particles_speed,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": false,
            "mode": "repulse"
          },
          "onclick": {
            "enable": false,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 400,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });
    $(document).trigger('is-bg-animation-loaded');
  }
  fn_siteBgEffect();

//
// image each
// --------------------------------------------------
//

  function fn_imgLoaded() {
    if (isMobile) {
      if (_bg_style_mobile == 1 || _bg_style_mobile == 2) {
        fn_imgLoad();
      } else {
        fn_siteLoader();
      }
    } else {
      if (_bg_style_desktop == 1 || _bg_style_desktop == 2) {
        fn_imgLoad();
      } else {
        fn_siteLoader();
      }
    }

    function fn_imgLoad() {
      var imgSet = [];

      $('.section').each(function() {
        imgSet.push(imgPath + '/bg/' + this.id + '.jpg');
      });

      var imgArray = [];

      var i;
      for (i = 0; i < imgSet.length; i++) {
        var img = new Image();
        img.src = imgSet[i];
        imgArray[i] = img;
      }

      var imgLoad = imagesLoaded(imgArray);

      $body.addClass('is-each');
      $('.site-bg__video').remove();

      imgLoad.on('always', function (instance) {
        fn_siteLoader();
      });
    }
  }
  $(window).on('load', function() {
    fn_imgLoaded();
  });

//
// parallax
// --------------------------------------------------
//

  function fn_parallax() {
    if (_bg_animation_parallax && !isMobile && !isIE9 && _bg_effect != 0) {
      $body.addClass('is-bg-animation-parallax-on');

      $(document).one('is-bg-animation-loaded', function() {
        var $particles = $('.particles-js-canvas-el');
        var $parallax = $('.site-bg');

        $('.site-bg__effect').add($particles).each(function() {
          var $this = $(this);

          if ($this.length) {
            $this.addClass('layer').attr('data-depth', _bg_animation_parallax_depth);
          }
        });
        $parallax.parallax('enable');
      });
    }
  }
  fn_parallax();

//
// carousel
// --------------------------------------------------
//

  function fn_carousel() {
    $.fn.ccarousel = function(navContainer) {
      this.owlCarousel({
        rewind: true,
        nav: true,
        navText: ['' , ''],
        navContainer: navContainer,
        navContainerClass: 'carousel-nav',
        navClass: [ 'carousel-prev', 'carousel-next' ],
        dots: false,
        margin: 30,
        responsive: {
          0: {
            items: 1
          },
          768: {
            items: 2
          },
          992: {
            items: 3
          }
        }
      });
    }

    var $carousel = $('#serviceCarousel, #portfolioCarousel');

    $carousel.each(function() {
      var $this = $(this);

      $this.ccarousel('#' + $this.attr('id') + '__control');
    });

    $('.carousel__item-figure').on('mouseenter', function() {
      var $this = $(this);

      $this.addClass('hover');
      $this.parents('.carousel').addClass('carousel-hover');
    });

    $('.carousel__item-figure').on('mouseleave', function() {
      var $this = $(this);

      $this.removeClass('hover');
      $this.parents('.carousel').removeClass('carousel-hover');
    });
  }
  fn_carousel();

//
// function end
// --------------------------------------------------
//

})(jQuery);
// .modal-backdrop classes



// 4 steps page
var timelines = $('.cd-horizontal-timeline'),
    eventsMinDistance = 60;

  (timelines.length > 0) && initTimeline(timelines);

  function initTimeline(timelines) {
    timelines.each(function(){
      var timeline = $(this),
        timelineComponents = {};
      //cache timeline components 
      timelineComponents['timelineWrapper'] = timeline.find('.events-wrapper');
      timelineComponents['eventsWrapper'] = timelineComponents['timelineWrapper'].children('.events');
      timelineComponents['fillingLine'] = timelineComponents['eventsWrapper'].children('.filling-line');
      timelineComponents['timelineEvents'] = timelineComponents['eventsWrapper'].find('a');
      timelineComponents['timelineDates'] = parseDate(timelineComponents['timelineEvents']);
      timelineComponents['eventsMinLapse'] = minLapse(timelineComponents['timelineDates']);
      timelineComponents['timelineNavigation'] = timeline.find('.cd-timeline-navigation');
      timelineComponents['eventsContent'] = timeline.children('.events-content');

      //assign a left postion to the single events along the timeline
      setDatePosition(timelineComponents, eventsMinDistance);
      //assign a width to the timeline
      var timelineTotWidth = setTimelineWidth(timelineComponents, eventsMinDistance);
      //the timeline has been initialize - show it
      timeline.addClass('loaded');

      //detect click on the next arrow
      timelineComponents['timelineNavigation'].on('click', '.next', function(event){
        event.preventDefault();
        updateSlide(timelineComponents, timelineTotWidth, 'next');
        showNewContent(timelineComponents, timelineTotWidth, 'next')
      });

      $(".nextbtn").on('click', function(event){
        event.preventDefault();
        updateSlide(timelineComponents, timelineTotWidth, 'next');
        showNewContent(timelineComponents, timelineTotWidth, 'next')
        document.getElementById('topofpage').scrollIntoView();  
      });

      //detect click on the prev arrow
      timelineComponents['timelineNavigation'].on('click', '.prev', function(event){
        event.preventDefault();
        updateSlide(timelineComponents, timelineTotWidth, 'prev');
        showNewContent(timelineComponents, timelineTotWidth, 'prev');
      });
      //detect click on the a single event - show new event content
      timelineComponents['eventsWrapper'].on('click', 'a', function(event){
        event.preventDefault();
        timelineComponents['timelineEvents'].removeClass('selected');
        $(this).addClass('selected');
        updateOlderEvents($(this));
        updateFilling($(this), timelineComponents['fillingLine'], timelineTotWidth);
        updateVisibleContent($(this), timelineComponents['eventsContent']);
      });

      //on swipe, show next/prev event content
      timelineComponents['eventsContent'].on('swipeleft', function(){
        var mq = checkMQ();
        ( mq == 'mobile' ) && showNewContent(timelineComponents, timelineTotWidth, 'next');
      });
      timelineComponents['eventsContent'].on('swiperight', function(){
        var mq = checkMQ();
        ( mq == 'mobile' ) && showNewContent(timelineComponents, timelineTotWidth, 'prev');
      });

      //keyboard navigation
      $(document).keyup(function(event){
        if(event.which=='37' && elementInViewport(timeline.get(0)) ) {
          showNewContent(timelineComponents, timelineTotWidth, 'prev');
        } else if( event.which=='39' && elementInViewport(timeline.get(0))) {
          showNewContent(timelineComponents, timelineTotWidth, 'next');
        }
      });
    });
  }

  function updateSlide(timelineComponents, timelineTotWidth, string) {
    //retrieve translateX value of timelineComponents['eventsWrapper']
    var translateValue = getTranslateValue(timelineComponents['eventsWrapper']),
      wrapperWidth = Number(timelineComponents['timelineWrapper'].css('width').replace('px', ''));
    //translate the timeline to the left('next')/right('prev') 
    (string == 'next') 
      ? translateTimeline(timelineComponents, translateValue - wrapperWidth + eventsMinDistance, wrapperWidth - timelineTotWidth)
      : translateTimeline(timelineComponents, translateValue + wrapperWidth - eventsMinDistance);
  }

  function showNewContent(timelineComponents, timelineTotWidth, string) {
    //go from one event to the next/previous one
    var visibleContent =  timelineComponents['eventsContent'].find('.selected'),
      newContent = ( string == 'next' ) ? visibleContent.next() : visibleContent.prev();

    if ( newContent.length > 0 ) { //if there's a next/prev event - show it
      var selectedDate = timelineComponents['eventsWrapper'].find('.selected'),
        newEvent = ( string == 'next' ) ? selectedDate.parent('li').next('li').children('a') : selectedDate.parent('li').prev('li').children('a');
      
      updateFilling(newEvent, timelineComponents['fillingLine'], timelineTotWidth);
      updateVisibleContent(newEvent, timelineComponents['eventsContent']);
      newEvent.addClass('selected');
      selectedDate.removeClass('selected');
      updateOlderEvents(newEvent);
      updateTimelinePosition(string, newEvent, timelineComponents);
    }
  }

  function updateTimelinePosition(string, event, timelineComponents) {
    //translate timeline to the left/right according to the position of the selected event
    var eventStyle = window.getComputedStyle(event.get(0), null),
      eventLeft = Number(eventStyle.getPropertyValue("left").replace('px', '')),
      timelineWidth = Number(timelineComponents['timelineWrapper'].css('width').replace('px', '')),
      timelineTotWidth = Number(timelineComponents['eventsWrapper'].css('width').replace('px', ''));
    var timelineTranslate = getTranslateValue(timelineComponents['eventsWrapper']);

        if( (string == 'next' && eventLeft > timelineWidth - timelineTranslate) || (string == 'prev' && eventLeft < - timelineTranslate) ) {
          translateTimeline(timelineComponents, - eventLeft + timelineWidth/2, timelineWidth - timelineTotWidth);
        }
  }

  function translateTimeline(timelineComponents, value, totWidth) {
    var eventsWrapper = timelineComponents['eventsWrapper'].get(0);
    value = (value > 0) ? 0 : value; //only negative translate value
    value = ( !(typeof totWidth === 'undefined') &&  value < totWidth ) ? totWidth : value; //do not translate more than timeline width
    setTransformValue(eventsWrapper, 'translateX', value+'px');
    //update navigation arrows visibility
    (value == 0 ) ? timelineComponents['timelineNavigation'].find('.prev') : timelineComponents['timelineNavigation'].find('.prev').removeClass('inactive');
    (value == totWidth ) ? timelineComponents['timelineNavigation'].find('.next') : timelineComponents['timelineNavigation'].find('.next').removeClass('inactive');
  }

  function updateFilling(selectedEvent, filling, totWidth) {
    //change .filling-line length according to the selected event
    var eventStyle = window.getComputedStyle(selectedEvent.get(0), null),
      eventLeft = eventStyle.getPropertyValue("left"),
      eventWidth = eventStyle.getPropertyValue("width");
    eventLeft = Number(eventLeft.replace('px', '')) + Number(eventWidth.replace('px', ''))/2;
    var scaleValue = eventLeft/totWidth;
    setTransformValue(filling.get(0), 'scaleX', scaleValue);
  }

  function setDatePosition(timelineComponents, min) {
    for (i = 0; i < timelineComponents['timelineDates'].length; i++) { 
        var distance = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][i]),
          distanceNorm = Math.round(distance/timelineComponents['eventsMinLapse']) + 2;
        timelineComponents['timelineEvents'].eq(i).css('left', distanceNorm*min+'px');
    }
  }

  function setTimelineWidth(timelineComponents, width) {
    var timeSpan = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][timelineComponents['timelineDates'].length-1]),
      timeSpanNorm = timeSpan/timelineComponents['eventsMinLapse'],
      timeSpanNorm = Math.round(timeSpanNorm) + 4,
      totalWidth = timeSpanNorm*width;
    timelineComponents['eventsWrapper'].css('width', totalWidth+'px');
    updateFilling(timelineComponents['eventsWrapper'].find('a.selected'), timelineComponents['fillingLine'], totalWidth);
    updateTimelinePosition('next', timelineComponents['eventsWrapper'].find('a.selected'), timelineComponents);
  
    return totalWidth;
  }

  function updateVisibleContent(event, eventsContent) {
    var eventDate = event.data('date'),
      visibleContent = eventsContent.find('.selected'),
      selectedContent = eventsContent.find('[data-date="'+ eventDate +'"]'),
      selectedContentHeight = selectedContent.height();

    if (selectedContent.index() > visibleContent.index()) {
      var classEnetering = 'selected enter-right',
        classLeaving = 'leave-left';
    } else {
      var classEnetering = 'selected enter-left',
        classLeaving = 'leave-right';
    }

    selectedContent.attr('class', classEnetering);
    visibleContent.attr('class', classLeaving).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
    visibleContent.removeClass('leave-right leave-left');
    selectedContent.removeClass('enter-left enter-right');
    });
    eventsContent.css('height', selectedContentHeight+'px');
  }

  function updateOlderEvents(event) {
    event.parent('li').prevAll('li').children('a').addClass('older-event').end().end().nextAll('li').children('a').removeClass('older-event');
  }

  function getTranslateValue(timeline) {
    var timelineStyle = window.getComputedStyle(timeline.get(0), null),
      timelineTranslate = timelineStyle.getPropertyValue("-webkit-transform") ||
            timelineStyle.getPropertyValue("-moz-transform") ||
            timelineStyle.getPropertyValue("-ms-transform") ||
            timelineStyle.getPropertyValue("-o-transform") ||
            timelineStyle.getPropertyValue("transform");

        if( timelineTranslate.indexOf('(') >=0 ) {
          var timelineTranslate = timelineTranslate.split('(')[1];
        timelineTranslate = timelineTranslate.split(')')[0];
        timelineTranslate = timelineTranslate.split(',');
        var translateValue = timelineTranslate[4];
        } else {
          var translateValue = 0;
        }

        return Number(translateValue);
  }

  function setTransformValue(element, property, value) {
    element.style["-webkit-transform"] = property+"("+value+")";
    element.style["-moz-transform"] = property+"("+value+")";
    element.style["-ms-transform"] = property+"("+value+")";
    element.style["-o-transform"] = property+"("+value+")";
    element.style["transform"] = property+"("+value+")";
  }

  //based on http://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
  function parseDate(events) {
    var dateArrays = [];
    events.each(function(){
      var singleDate = $(this),
        dateComp = singleDate.data('date').split('T');
      if( dateComp.length > 1 ) { //both DD/MM/YEAR and time are provided
        var dayComp = dateComp[0].split('/'),
          timeComp = dateComp[1].split(':');
      } else if( dateComp[0].indexOf(':') >=0 ) { //only time is provide
        var dayComp = ["2000", "0", "0"],
          timeComp = dateComp[0].split(':');
      } else { //only DD/MM/YEAR
        var dayComp = dateComp[0].split('/'),
          timeComp = ["0", "0"];
      }
      var newDate = new Date(dayComp[2], dayComp[1]-1, dayComp[0], timeComp[0], timeComp[1]);
      dateArrays.push(newDate);
    });
      return dateArrays;
  }

  function daydiff(first, second) {
      return Math.round((second-first));
  }

  function minLapse(dates) {
    //determine the minimum distance among events
    var dateDistances = [];
    for (i = 1; i < dates.length; i++) { 
        var distance = daydiff(dates[i-1], dates[i]);
        dateDistances.push(distance);
    }
    return Math.min.apply(null, dateDistances);
  }

  /*
    How to tell if a DOM element is visible in the current viewport?
    http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
  */
  function elementInViewport(el) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    while(el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
    }

    return (
        top < (window.pageYOffset + window.innerHeight) &&
        left < (window.pageXOffset + window.innerWidth) &&
        (top + height) > window.pageYOffset &&
        (left + width) > window.pageXOffset
    );
  }

  function checkMQ() {
    //check if mobile or desktop device
    return window.getComputedStyle(document.querySelector('.cd-horizontal-timeline'), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
  }


function removeHash () { 
    var scrollV, scrollH, loc = window.location;
    if ("pushState" in history)
        history.pushState("", document.title, loc.pathname + loc.search);
    else {
        // Prevent scrolling by storing the page's current scroll offset
        scrollV = document.body.scrollTop;
        scrollH = document.body.scrollLeft;

        loc.hash = "";

        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scrollV;
        document.body.scrollLeft = scrollH;
    }
}


//Modal
var Modal = {

  selector: '[data-modal]',
  content: '[data-modal-content]',
  btnOpen: '[data-modal-open]',
  btnClose: '[data-modal-close]',

  classVisible: 'is-visible',

  currBtnOpen: {},

  init: function() {
    // return if no selectors found
    if (!document.querySelectorAll(this.selector).length) return;
    // otherwise loop through selectors
    this.loopSelectors();
  },
  loopSelectors: function() {
    // get node list of 'open' buttons
    var btnNodelist = document.querySelectorAll(this.btnOpen);
    // loop through each button
    for (var i = 0; i < btnNodelist.length; i++) {
      // run bindClick passing through button
      this.bindOpenClickEvent(btnNodelist[i]);
    }
  },

  // binding events
  bindOpenClickEvent: function(btnOpen) {
    // set event, save globally to remove when needed
    window.modalOpenClickEvent = function() {
        Modal.openEvent(btnOpen);
      }
      // bind click event to toggle
    btnOpen.addEventListener('click', modalOpenClickEvent);
  },
  bindCloseClickEvent: function(btnClose) {
    // set event, save globally to remove when needed
    window.modalCloseClickEvent = function() {
        Modal.closeEvent(btnClose);
        removeHash();
      }
      // bind click event to toggle
    btnClose.addEventListener('click', modalCloseClickEvent);
  },
  bindCloseKeyEvent: function(modal, btnClose) {
    document.onkeydown = function(e) {
      if (e.keyCode === 27) {
        Modal.closeModal(modal);
        Modal.setOpenEventBindings(btnClose);
        if(window.location.hash.indexOf('modal') === 1) {
          removeHash();
        }
      }
    }
  },
  unbindClickEvent: function(element, handler) {
    // remove click event from element
    element.removeEventListener('click', handler);
  },
  unbindKeyEvent: function() {
    document.onkeydown = null;
  },
  setCloseEventBindings: function(modal, btnOpen, btnClose) {
    // unbind click event from open button
    this.unbindClickEvent(btnOpen, window.modalOpenClickEvent);
    // get close button and bind close event
    this.bindCloseClickEvent(btnClose);
    this.bindCloseKeyEvent(modal, btnClose);
  },
  setOpenEventBindings: function(btnClose) {
    // unbind click event from close button and keyup from document
    this.unbindClickEvent(btnClose, window.modalCloseClickEvent);
    this.unbindKeyEvent();
    // bind click event on open button and focus
    this.bindOpenClickEvent(this.currBtnOpen);
    this.currBtnOpen.focus();
  },

  // events
  openEvent: function(btnOpen) {
    // get modal window from target and close button
    var target = btnOpen.dataset.modalOpen,
      modal = this.getModal(target),
      btnClose = modal.querySelector(this.btnClose);
    // save current button so available to focus when closing
    this.currBtnOpen = btnOpen;
    // open modal and bind/unbind relevant events
    this.openModal(modal);
    this.setCloseEventBindings(modal, btnOpen, btnClose);
  },
  closeEvent: function(btnClose) {
    // get modal window from target
    var target = btnClose.dataset.modalClose,
      modal = this.getModal(target);
    this.closeModal(modal);
    this.setOpenEventBindings(btnClose);
  },

  // modal show/hide
  openModal: function(modal) {
    // scroll to top of modal
    modal.querySelector(this.content).scrollTop = 0;
    // add visible class to modal
    modal.classList.add(this.classVisible);
    
    // focus modal, setTimeout required for focus() as modal may not be visible when called
    setTimeout(function() {
      modal.tabIndex = 0;
      modal.focus();
    }, 150);
  },
  closeModal: function(modal) {
    // remove visible class from modal
    modal.classList.remove(this.classVisible);
  },
  getModal: function(target) {
    // return matching modal window from target
    return document.querySelector('[data-modal="' + target + '"]');
  }
};

Modal.init();


$(".modal").click(function() {
    $(this).removeClass(Modal.classVisible);
    removeHash();
});
$(".modal__content").click(function(e) {
     e.stopPropagation(); // This is the preferred method.
    return false;        // This should not be used unless you do not want
                         // any click events registering inside the div
});


$(".modal__content").scroll(function(e) {
   e.stopPropagation(); // This is the preferred method.
   return false;        // This should not be used unless you do not want
                         // any click events registering inside the div
});



$(".navigationbutton").on('click', function() {
  $("#container").show();
  $(".branch").hide();
  $("#backbutton").hide();
});

$(".backbutton").on('click', function () {
  $("#container").show();
  $(".branch").hide();
  $("#backbutton").hide();
});

// Phone fix
$("#reality").on('click', function () {
 $("#container").hide();
 $("#realitybranch").show();
 $("#backbutton").show();
});

$("#neuroscience").on('click', function () {
$("#container").hide();
$("#neurosciencebranch").show();
$("#backbutton").show();
});

$("#identity").on('click', function () {
$("#container").hide();
$("#identitybranch").show();
$("#backbutton").show();
});

$("#eintelligence").on('click', function () {
$("#container").hide();
$("#eintelligencebranch").show();
$("#backbutton").show();
});

 function fn_siteNavAnimation() {
    var $siteNav = $('.site-nav');

    $("body").toggleClass('nav-in');

    if ($("body").hasClass('nav-in')) {
      $siteNav.velocity('stop', true)
      .velocity('fadeIn', {
        duration: 100
      });

      $('.site-nav__inner').velocity('stop', true)
      .velocity({
        translateY: ['0', '-25%'],
        rotateX: ['0deg', '35deg'],
        opacity: ['1', '.4']
      }, {
        duration: 100
      });
    } else {
      $siteNav.velocity('stop', true)
      .velocity('fadeOut', {
        duration: 100
      });

      $('.site-nav__inner').velocity('stop', true)
      .velocity({
        translateY: ['25%', '0'],
        rotateX: ['-35deg', '0deg'],
        opacity: ['.4', '1']
      }, {
        duration: 100
      });
    }
  }

$(".site-nav__table").on('click', function () {
 fn_siteNavAnimation()
}); 


  //URL on modals
  $(window).bind('hashchange', function () {
    // check if url contains 'gallery'
    if (window.location.hash.indexOf('modal') === -1 || location.hash == null) {
      // url doesnt contains 'gallery', so we will close the gallery modal
      $(".modal").removeClass(Modal.classVisible);
    }
  });


function openModal() {
	if(window.location.hash.indexOf('modal') === 1 && window.location.pathname === "/insights") {
  var hashIndex = window.location.href.indexOf('#'); 
  var stringBeforeHash = window.location.href.slice(hashIndex);
  console.log(stringBeforeHash); 
  var aelement = $('a[href=' + stringBeforeHash + ']').children()[0];
  	console.log("run");
  	aelement.click();
}
}


// Trying to toggle the modal depending on url

$(document).ready(function() {
openModal();

$(window).on('hashchange', openModal);

});
