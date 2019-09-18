function is_touch_device() {
    return ('ontouchstart' in document.documentElement);
}
jQuery.exists = function(selector) {
    return (jQuery(selector).length > 0);
};

(function($) {

    $(document).ready(function() {
        mk_animated_contents();
        mk_lightbox_init();
        mk_gallery_lightbox_init();
        mk_backgrounds_parallax();
        mk_flexslider_init();
        mk_event_countdown();
        mk_skill_meter();
        mk_charts();
        mk_milestone();
        mk_swipe_slider();
        mk_ajax_search();
        mk_hover_events();
        mk_portfolio_ajax();
        mk_love_post();
        product_loop_add_cart();
        mk_social_share();
        mk_newspaper_comments_share();
        mk_responsive_fix();
        loop_audio_init();
        mk_portfolio_widget();
        mk_contact_form();
        mk_blog_carousel();
        mk_responsive_nav();
        mk_header_searchform();
        mk_click_events();
        mk_theme_toggle_box();
        mk_google_maps();
        mk_edge_slider_init();
        mk_edge_slider_resposnive();
        mk_smooth_scroll_events();
    });

    $(window).load(function() {
        mk_blur_boxes();
        mk_parallax();
        shop_isotop_init();
        mk_tabs();
        mk_accordion_toggles_tooltip();
        section_to_full_height();
    });


    $(window).on("debouncedresize", function() {
        section_to_full_height();
        mk_responsive_fix();
        setTimeout(function() {
            mk_edge_slider_resposnive();
        }, 200);

    });


    $(window).scroll(function() {
        mk_skill_meter();
        mk_charts();
        mk_milestone();
        mk_animated_contents();
    });



    /* Blog, Portfolio Audio */
    /* -------------------------------------------------------------------- */

    function loop_audio_init() {

        "use strict";

        if ($.exists('.jp-jplayer')) {
            $('.jp-jplayer.mk-blog-audio').each(function() {
                var css_selector_ancestor = "#" + $(this).siblings('.jp-audio').attr('id');
                var ogg_file, mp3_file, mk_theme_js_path;
                ogg_file = $(this).attr('data-ogg');
                mp3_file = $(this).attr('data-mp3');
                $(this).jPlayer({
                    ready: function() {
                        $(this).jPlayer("setMedia", {
                            mp3: mp3_file,
                            ogg: ogg_file
                        });
                    },
                    play: function() { // To avoid both jPlayers playing together.
                        $(this).jPlayer("pauseOthers");
                    },
                    swfPath: mk_theme_js_path,
                    supplied: "mp3, ogg",
                    cssSelectorAncestor: css_selector_ancestor,
                    wmode: "window"
                });
            });
        }
    }



    /* jQuery prettyPhoto lightbox */
    /* -------------------------------------------------------------------- */

    function mk_lightbox_init() {

        "use strict";

        $('.mk-lightbox').iLightBox();
    }


    /* jQuery prettyPhoto lightbox */
    /* -------------------------------------------------------------------- */

    function mk_gallery_lightbox_init() {

        "use strict";

        $('.mk-gallery-shortcode').each(function() {
            var item = $(this).find('.gallery-lightbox');

            $(item).iLightBox();

        });
    }



    /* Event Count Down */
    /* -------------------------------------------------------------------- */

    function mk_event_countdown() {

        "use strict";

        if ($.exists('.mk-event-countdown')) {
            $('.mk-event-countdown').each(function() {
                var $this = $(this),
                    $date = $this.attr('data-date'),
                    $offset = $this.attr('data-offset');

                $this.downCount({
                    date: $date,
                    offset: $offset
                });
            });
        }
    }



    /* Flexslider init */
    /* -------------------------------------------------------------------- */

    function mk_flexslider_init() {

        "use strict";

        $('.mk-flexslider.mk-script-call').each(function() {

            if ($(this).parents('.mk-tabs').length || $(this).parents('.mk-accordion').length) {
                $(this).removeData("flexslider");
            }


            var $this = $(this),
                $selector = $this.attr('data-selector'),
                $animation = $this.attr('data-animation'),
                $easing = $this.attr('data-easing'),
                $direction = $this.attr('data-direction'),
                $smoothHeight = $this.attr('data-smoothHeight') == "true" ? true : false,
                $slideshowSpeed = $this.attr('data-slideshowSpeed'),
                $animationSpeed = $this.attr('data-animationSpeed'),
                $controlNav = $this.attr('data-controlNav') == "true" ? true : false,
                $directionNav = $this.attr('data-directionNav') == "true" ? true : false,
                $pauseOnHover = $this.attr('data-pauseOnHover') == "true" ? true : false,
                $isCarousel = $this.attr('data-isCarousel') == "true" ? true : false;

            if ($selector != undefined) {
                var $selector_class = $selector;
            } else {
                var $selector_class = ".mk-flex-slides > li";
            }

            if ($isCarousel == true) {
                var $itemWidth = parseInt($this.attr('data-itemWidth')),
                    $itemMargin = parseInt($this.attr('data-itemMargin')),
                    $minItems = parseInt($this.attr('data-minItems')),
                    $maxItems = parseInt($this.attr('data-maxItems')),
                    $move = parseInt($this.attr('data-move'));
            } else {
                var $itemWidth = $itemMargin = $minItems = $maxItems = $move = 0;
            }

            $this.flexslider({
                selector: $selector_class,
                animation: $animation,
                easing: $easing,
                direction: $direction,
                smoothHeight: $smoothHeight,
                slideshow: true,
                slideshowSpeed: $slideshowSpeed,
                animationSpeed: $animationSpeed,
                controlNav: $controlNav,
                directionNav: $directionNav,
                pauseOnHover: $pauseOnHover,
                prevText: "",
                nextText: "",

                itemWidth: $itemWidth,
                itemMargin: $itemMargin,
                minItems: $minItems,
                maxItems: $maxItems,
                move: $move,
            });

        });

    }



    /* Background Parallax Effects */
    /* -------------------------------------------------------------------- */

    function mk_backgrounds_parallax() {

        "use strict";

        if (mk_header_parallax == true) {
            $('.mk-header-bg').addClass('mk-parallax-enabled');
        }
        if (mk_body_parallax == true) {
            $('body').addClass('mk-parallax-enabled');
        }
        if (mk_banner_parallax == true) {
            $('#mk-header').addClass('mk-parallax-enabled');
        }
        if (mk_page_parallax == true) {
            $('#theme-page').addClass('mk-parallax-enabled');
        }
        if (mk_footer_parallax == true) {
            $('#mk-footer').addClass('mk-parallax-enabled');
        }

        $('.mk-parallax-enabled').each(function() {
            if (!is_touch_device()) {
                $(this).parallax("49%", -0.2);
            }
        });

        $('.mk-fullwidth-slideshow.parallax-slideshow').each(function() {
            if (!is_touch_device()) {
                var speed_factor = $(this).attr('data-speedFactor');
                $(this).parallax("49%", speed_factor);
            }
        });

    }



    /* Animated Contents */
    /* -------------------------------------------------------------------- */

    function mk_animated_contents() {

        "use strict";

        if (is_touch_device() || $(window).width() < 780) {
            $('body').addClass('no-transform').find('.mk-animate-element').removeClass('mk-animate-element');
        }

        if ($.exists('.mk-animate-element')) {
            $(".mk-animate-element:in-viewport").each(function(i) {
                var $this = $(this);
                if (!$this.hasClass('mk-in-viewport')) {
                    setTimeout(function() {
                        $this.addClass('mk-in-viewport');
                    }, 100 * i);
                }
            });
        }
    }

    /* Box Blur effect */
    /* -------------------------------------------------------------------- */

    function mk_blur_boxes() {

        "use strict";

        if ($.exists('.icon-box-boxed.blured-box, .mk-employee-item.employee-item-blur') && !is_touch_device()) {

            $('.icon-box-boxed.blured-box, .mk-employee-item.employee-item-blur').blurjs({
                source: '.mk-blur-parent',
                radius: 18,
                overlay: "rgba(255,255,255,0.6)",
            });

        }
    }

    /* Tabs */
    /* -------------------------------------------------------------------- */

    function mk_tabs() {

        "use strict";

        if ($.exists('.mk-tabs, .mk-news-tab, .mk-woo-tabs')) {
            $(".mk-tabs, .mk-news-tab, .mk-woo-tabs").tabs();

            $('.mk-tabs').on('click', function() {
                     $('.mk-theme-loop').isotope('reLayout');
            });

            $('.mk-tabs.vertical-style').each(function() {
                $(this).find('.mk-tabs-pane').css('minHeight', $(this).find('.mk-tabs-tabs').height() - 1);
            });
        }
    }

    /* Parallx for page sections */
    /* -------------------------------------------------------------------- */

    function mk_parallax() {

        "use strict";

        if (!is_touch_device()) {
            $('.mk-page-section.parallax-true').each(function() {
                var $this = $(this),
                    $speedFactor = $this.attr('data-speedFactor');
                $($this).parallax("49%", $speedFactor);
            });
        }
    }


    /* Ajax Search */
    /* -------------------------------------------------------------------- */

    function mk_ajax_search() {

        "use strict";

        if ($.exists('.main-nav-side-search') && mk_ajax_search_option == "beside_nav") {
            $("#mk-ajax-search-input").autocomplete({
                delay: 50,
                minLength: 2,
                appendTo: $("#mk-nav-search-wrapper"),
                search: function(event, ui) {
                    $(this).parent('form').addClass('ajax-searching');
                },
                source: function(req, response) {
                    $.getJSON(ajaxurl + '?callback=?&action=mk_ajax_search', req, response);
                },
                select: function(event, ui) {
                    window.location.href = ui.item.link;
                },
                response: function(event, ui) {
                    $(this).parent('form').removeClass('ajax-searching').addClass('ajax-search-complete');
                }

            }).data("ui-autocomplete")._renderItem = function(ul, item) {


                return $("<li>").append("<a>" + item.image + "<span class='search-title'>" + item.label + "</span><span class='search-date'>" + item.date + "</span></a>").appendTo(ul);

            };
        }
    }


    /* Hover Events */
    /* -------------------------------------------------------------------- */

    function mk_hover_events() {

        "use strict";

        $('.shopping-cart-header').stop(true, true).hover(

            function() {
                $('.mk-shopping-cart-box').fadeIn(200);
            }, function() {
                $('.mk-shopping-cart-box').fadeOut(200);
            });
    }


    /* Ajax portfolio */
    /* -------------------------------------------------------------------- */

    function mk_portfolio_ajax() {

        "use strict";
        
        $('.portfolio-grid.portfolio-ajax-enabled').ajaxPortfolio();
    }


    /* Love This */
    /* -------------------------------------------------------------------- */

    function mk_love_post() {

        "use strict";

        $('body').on('click', '.mk-love-this', function() {
            var $this = $(this),
                $id = $this.attr('id');

            if ($this.hasClass('item-loved')) return false;

            if ($this.hasClass('item-inactive')) return false;

            var $sentdata = {
                action: 'mk_love_post',
                post_id: $id
            }

            $.post(ajaxurl, $sentdata, function(data) {
                $this.find('span').html(data);
                $this.addClass('item-loved');
            });

            $this.addClass('item-inactive');
            return false;
        });

    }



    /* Woocommerce Add to card */
    /* -------------------------------------------------------------------- */

    function product_loop_add_cart() {

        "use strict";

        var $body = $('body');
        $body.on('click', '.add_to_cart_button', function() {
            var product = $(this).parents('.product:eq(0)').addClass('adding-to-cart').removeClass('added-to-cart');
        })

        $body.bind('added_to_cart', function() {
            $('.adding-to-cart').removeClass('adding-to-cart').addClass('added-to-cart');
        });
    }



    /* Woocommerce Loop Scripts */
    /* -------------------------------------------------------------------- */

    function shop_isotop_init() {

        "use strict";

        if ($.exists('.products') && !$('.products').hasClass('related')) {
            $('.products').each(function() {

                if (!$(this).parents('.mk-woocommerce-carousel').length) {
                    var $woo_container = $(this),
                        $container_item = '.products .product';

                    $woo_container.isotope({
                        itemSelector: $container_item,
                        masonry: {
                            columnWidth: 1
                        }

                    });

                    $(window).on("debouncedresize", function(event) {
                        $woo_container.isotope('reLayout');
                    });

                    $('.products > .product').each(function(i) {
                        $(this).delay(i * 200).animate({
                            'opacity': 1
                        }, 'fast');

                    }).promise().done(function() {
                        setTimeout(function() {
                            $woo_container.isotope('reLayout');
                        }, 1000);
                    });
                }
            });
        }
    }



    /* Social Share */
    /* -------------------------------------------------------------------- */

    function mk_social_share() {

        "use strict";

        $('.twitter-share').on('click', function() {
            var $url = $(this).attr('data-url'),
                $title = $(this).attr('data-title');

            window.open('http://twitter.com/intent/tweet?text=' + $title + ' ' + $url, "twitterWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
            return false;
        });

        $('.pinterest-share').on('click', function() {
            var $url = $(this).attr('data-url'),
                $title = $(this).attr('data-title'),
                $image = $(this).attr('data-image');
            window.open('http://pinterest.com/pin/create/button/?url=' + $url + '&media=' + $image + '&description=' + $title, "twitterWindow", "height=320,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
            return false;
        });

        $('.facebook-share').on('click', function() {
            var $url = $(this).attr('data-url');
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + $url, "facebookWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
            return false;
        });

        $('.googleplus-share').on('click', function() {
            var $url = $(this).attr('data-url');
            window.open('https://plus.google.com/share?url=' + $url, "googlePlusWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
            return false;
        });

        $('.linkedin-share').on('click', function() {
            var $url = $(this).attr('data-url'),
                $title = $(this).attr('data-title'),
                $desc = $(this).attr('data-desc');
            window.open('http://www.linkedin.com/shareArticle?mini=true&url=' + $url + '&title=' + $title + '&summary=' + $desc, "linkedInWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
            return false;
        });
    }



    /* Floating Go to top Link */
    /* -------------------------------------------------------------------- */

    function mk_smooth_scroll_events() {


        "use strict";

        $('.mk-go-top, .mk-back-top-link, .single-back-top a, .divider-go-top, .comments-back-top').click(function() {
            $("html, body").animate({
                scrollTop: 0
            }, 800);
            return false;
        });

        $('.mk-classic-comments').click(function() {
            $("html, body").animate({
                scrollTop: $('#comments').offset().top
            }, 800);

        });


        $(".mk-smooth").bind('click', function(event) {
            if ($.exists("#wpadminbar")) {
                var wp_admin_height = $("#wpadminbar").height();
            } else {
                wp_admin_height = 0;
            }

            var header_height = $('.mk-header-inner').height();
            $("body, html").animate({
                scrollTop: $($(this).attr("href")).offset().top - (header_height + wp_admin_height) + "px"
            }, {
                duration: 1200,
                easing: "easeInOutExpo"
            });

            event.preventDefault();
        });


    }
    $(window).scroll(function() {
        if ($(this).scrollTop() > 400) {
            $('.mk-go-top, .mk-quick-contact-wrapper').removeClass('off').addClass('on');
        } else {
            $('.mk-go-top, .mk-quick-contact-wrapper').removeClass('on').addClass('off');
        }
    });



    /* Page Section full height feature */
    /* -------------------------------------------------------------------- */

    function section_to_full_height() {


        "use strict";

        $('.full-height-true.mk-page-section').each(function() {
            var $this = $(this),
                $content_height = $this.find('.page-section-content').outerHeight(),
                $window_height = $(window).height();

            if ($.exists("#wpadminbar")) {
                var $wp_admin_height = $("#wpadminbar").height();
            } else {
                var $wp_admin_height = 0;
            }

            if (mk_header_sticky == true) {
                var mk_header = parseInt($("#mk-header").attr('data-sticky-height'));
            } else {
                var mk_header = 0;
            }

            $window_height = $window_height - $wp_admin_height - mk_header;


            if ($content_height > $window_height) {
                $this.css('height', 'auto');
                $this.find('.page-section-content').css({
                    'padding-top': 30,
                    'padding-bottom': 30
                });
            } else {
                $this.css('height', $window_height);
                var $this_height_half = $this.find('.page-section-content').outerHeight() / 2,
                    $window_half = $window_height / 2;

                $this.find('.page-section-content').css('marginTop', ($window_half - $this_height_half));
            }

        });

    }



    /* Accordions & Toggles */
    /* -------------------------------------------------------------------- */


    /* Accordions */

    function mk_accordion_toggles_tooltip() {

        "use strict";

        if ($.exists('.mk-accordion')) {

            $.tools.toolsTabs.addEffect("slide", function(i, done) {
                this.getPanes().slideUp(250);
                this.getPanes().eq(i).slideDown(250, function() {
                    done.call();
                });
            });

            $(".mk-accordion").each(function() {

                if ($(this).hasClass('accordion-action')) {


                    var $initialIndex = $(this).attr('data-initialIndex');
                    if ($initialIndex == undefined || $initialIndex == 0) {
                        $initialIndex = 0;
                    }
                    $(this).toolsTabs("div.mk-accordion-pane", {
                        toolsTabs: '.mk-accordion-tab',
                        effect: 'slide',
                        initialIndex: $initialIndex,
                        slideInSpeed: 400,
                        slideOutSpeed: 400
                    });
                } else {
                    $(".toggle-action .mk-accordion-tab").toggle(

                        function() {
                            $(this).addClass('current');
                            $(this).siblings('.mk-accordion-pane').slideDown(150);
                        }, function() {
                            $(this).removeClass('current');
                            $(this).siblings('.mk-accordion-pane').slideUp(150);
                        });
                }
            });

        }



        /* Toggles */

        if ($.exists('.mk-toggle-title')) {
            $(".mk-toggle-title").toggle(

                function() {
                    $(this).addClass('active-toggle');
                    $(this).siblings('.mk-toggle-pane').slideDown(200);
                }, function() {
                    $(this).removeClass('active-toggle');
                    $(this).siblings('.mk-toggle-pane').slideUp(200);
                });
        }


        /* Message Boxes */
        /* -------------------------------------------------------------------- */

        $('.box-close-btn').on('click', function() {
            $(this).parent().fadeOut(300);
            return false;

        });



        $('.mk-tooltip').each(function() {
            $(this).find('.tooltip-init').hover(function() {
                $(this).siblings('.tooltip-text').animate({
                    'opacity': 1
                }, 400);

            }, function() {
                $(this).siblings('.tooltip-text').animate({
                    'opacity': 0
                }, 400);
            });
        });

    }



    /* Newspaper Comments & Share section */
    /* -------------------------------------------------------------------- */

    function mk_newspaper_comments_share() {

        "use strict";

        $('.newspaper-item-footer').each(function() {

            $(this).find('.newspaper-item-comment').click(function() {

                $(this).parents('.newspaper-item-footer').find('.newspaper-social-share').slideUp(200).end().find('.newspaper-comments-list').slideDown(200);
                setTimeout(function() {
                    $('.mk-theme-loop').isotope('reLayout');
                }, 300);
            });

            $(this).find('.newspaper-item-share').click(function() {

                $(this).parents('.newspaper-item-footer').find('.newspaper-comments-list').slideUp(200).end().find('.newspaper-social-share').slideDown(200);
                setTimeout(function() {
                    $('.mk-theme-loop').isotope('reLayout');
                }, 300);

            });

        });

    }


    /* Main Navigation */
    /* -------------------------------------------------------------------- */

    function mk_main_navigation_init() {

        "use strict";

        var $menu_called;
        if ($menu_called != true) {
            $(".main-navigation-ul").dcMegaMenu({
                rowItems: '6',
                speed: 200,
                effect: 'fade',
                fullWidth: true
            });
            $menu_called = true;

            if ($(window).width() < mk_grid_width) {
                $('.main-navigation-ul .sub-container.mega, .main-navigation-ul .sub-container.mega .row').each(function() {
                    $(this).css('width', $(window).width());
                });
            }
        }

    }


    function mk_main_navigation() {

        "use strict";

        var nav_height = $('#mk-main-navigation').height();
        $('.main-navigation-ul div.sub-container').css('top', nav_height);
        if ($('.mk-header-inner').hasClass('mk-fixed')) {
            $('#mk-nav-search-wrapper').css('top', nav_height);
            $('.modern-style-nav .mk-shopping-cart-box').css('top', nav_height);

        } else {
            $('#mk-nav-search-wrapper').css('top', nav_height);
            $('.modern-style-nav .mk-shopping-cart-box').css('top', nav_height - 18);
        }
    }


    function mk_responsive_nav() {

        "use strict";


        $('.mk-nav-responsive-link').click(function() {
            if ($('body').hasClass('mk-opened-nav')) {
                $('body').removeClass('mk-opened-nav').addClass('mk-closed-nav');
                $('#mk-responsive-nav').slideUp(300);
            } else {
                $('body').removeClass('mk-closed-nav').addClass('mk-opened-nav');
                $('#mk-responsive-nav').slideDown(300);
            }
        });

        $('.mk-toolbar-resposnive-icon').click(function() {
            if ($('body').hasClass('toolbar-oppend')) {
                $('body').removeClass('toolbar-oppend').addClass('toolbar-closed');
                $('.mk-header-toolbar').slideUp();
            } else {
                $('body').removeClass('toolbar-closed').addClass('toolbar-oppend');
                $('.mk-header-toolbar').slideDown();
            }
        });


    }



    /* Responsive Fixes */
    /* -------------------------------------------------------------------- */


    function mk_responsive_fix() {


        "use strict";


        if ($(window).width() > mk_responsive_nav_width) {
            $('body').removeClass('mk-responsive').addClass('mk-desktop');
            $('#mk-responsive-nav').hide();
            setTimeout(function() {
                mk_main_navigation_init();
                mk_main_navigation();
            }, 200);


            $('.main-navigation-ul .sub-container.mega').each(function() {
                $(this).css('width', mk_grid_width);
            });

        } else {
            if (!$.exists('#mk-responsive-nav')) {
                $('.main-navigation-ul').clone().attr({
                    id: "mk-responsive-nav",
                    "class": ""
                }).insertAfter('.mk-header-inner');

                $('#mk-responsive-nav > li > ul, #mk-responsive-nav > li > div').each(function() {
                    $(this).siblings('a').append('<span class="mk-moon-arrow-down mk-nav-arrow mk-nav-sub-closed"></span>');
                });


                $('.mk-header-inner').attr('style', '');

                $('#mk-responsive-nav').append($('.responsive-searchform'));


                $('.mk-nav-arrow').click(function(e) {

                    if ($(this).hasClass('mk-nav-sub-closed')) {
                        $(this).parent().siblings('ul').slideDown(300);
                        $(this).parent().siblings('div').slideDown(300);
                        $(this).removeClass('mk-nav-sub-closed').addClass('mk-nav-sub-opened');
                    } else {
                        $(this).parent().siblings('ul').slideUp(300);
                        $(this).parent().siblings('div').slideUp(300);
                        $(this).removeClass('mk-nav-sub-opened').addClass('mk-nav-sub-closed');
                    }
                    e.preventDefault();
                });

            }
            $('#mk-responsive-nav li, #mk-responsive-nav li a, #mk-responsive-nav ul, #mk-responsive-nav div').attr('style', '');
            $('body').removeClass('mk-desktop').addClass('mk-responsive');
            $('mk-header-padding-wrapper').css('padding', 0);
        }


        $(window).load(function() {
            $('.modern-style-nav .header-logo, .modern-style-nav .header-logo a').css('width', $('.header-logo img').width());
        });
    }



    /* Initialize isiotop for newspaper style */
    /* -------------------------------------------------------------------- */

    function loops_iosotop_init() {

        "use strict";

        $('.loop-main-wrapper').each(function() {
            var $this = $(this),
                $mk_container = $this.find('.mk-theme-loop'),
                $mk_container_item = '.mk-' + $mk_container.attr('data-style') + '-item',
                $load_button = $this.find('.mk-loadmore-button'),
                $pagination_items = $this.find('.mk-pagination');

            $mk_container.isotope({
                itemSelector: $mk_container_item,
                animationEngine: "best-available",
                masonry: {
                    columnWidth: 1
                }

            });



            $('#mk-filter-portfolio ul li a').click(function() {
                var $this;
                $this = $(this);

                /* Removes ajax container when filter items get triggered */
                $this.parents('.portfolio-grid').find('.ajax-container').animate({
                    'height': 0,
                    opacity: 0
                }, 500);

                if ($this.hasClass('.current')) {
                    return false;
                }
                var $optionSet = $this.parents('#mk-filter-portfolio ul');
                $optionSet.find('.current').removeClass('current');
                $this.addClass('current');

                var selector = $(this).attr('data-filter');

                $mk_container.isotope({
                    filter: ''
                });
                $mk_container.isotope({
                    filter: selector
                });


                return false;
            });



            $load_button.hide();

            if ($this.find('.mk-theme-loop').hasClass('scroll-load-style') || $this.find('.mk-theme-loop').hasClass('load-button-style')) {
                if ($pagination_items.length > 0) {
                    $load_button.css('display', 'block');
                }
                $pagination_items.hide();


                $load_button.on('click', function() {
                    if (!$(this).hasClass('pagination-loading')) {
                        $(this).addClass('pagination-loading');
                    }

                });

                $mk_container.infinitescroll({
                        navSelector: $pagination_items,
                        nextSelector: $this.find('.mk-pagination a:first'),
                        itemSelector: $mk_container_item,
                        bufferPx: 70,
                        loading: {
                            finishedMsg: "",
                            img: mk_images_dir + "/load-more-loading.gif",
                            msg: null,
                            msgText: "",
                            selector: $load_button,
                            speed: 300,
                            start: undefined
                        },
                        errorCallback: function() {

                            $load_button.html(mk_no_more_posts).addClass('disable-pagination');

                        },

                    },

                    function(newElements) {

                        var $newElems = $(newElements);
                        $newElems.imagesLoaded(function() {
                            $load_button.removeClass('pagination-loading');


                            var selected_item = $('#mk-filter-portfolio ul').find('.current').attr('data-filter');

                            $mk_container.isotope('appended', $newElems);
                            $mk_container.isotope({
                                filter: ''
                            });
                            $mk_container.isotope({
                                filter: selected_item
                            });

                            $mk_container.isotope('reLayout');
                            loop_audio_init();
                            mk_portfolio_ajax();
                            mk_newspaper_comments_share();
                            mk_ajax_lightbox_init();
                            mk_ajax_gallery_lightbox_init();
                            mk_social_share();
                            mk_theme_toggle_box();
                        });
                    }

                );



                /* Loading elements based on scroll window */
                if ($this.find('.mk-theme-loop').hasClass('load-button-style')) {
                    $(window).unbind('.infscr');
                    $load_button.click(function() {

                        $mk_container.infinitescroll('retrieve');

                        return false;

                    });
                }

            } else {
                $load_button.hide();
            }
        });
    }


    $('.filter-faq li a').click(function() {

        $(this).parent().siblings().children().removeClass('current');
        $(this).addClass('current');

        var filterVal = $(this).attr('data-filter');

        if (filterVal === '') {
            $('.mk-faq-container .mk-faq-toggle').slideDown(200).removeClass('hidden');
        } else {
            $('.mk-faq-container .mk-faq-toggle').each(function() {
                if (!$(this).hasClass(filterVal)) {
                    $(this).slideUp(200).addClass('hidden');
                } else {
                    $(this).slideDown(200).removeClass('hidden');
                }
            });
        }
        return false;
    });



    /* reload elements on reload */
    /* -------------------------------------------------------------------- */

    if ($.exists('.mk-blog-container') || $.exists('.mk-portfolio-container') || $.exists('.mk-news-container') || $.exists('.mk-gallery-shortcode')) {
        $(window).load(function() {
            $(window).unbind('keydown');
            loops_iosotop_init();
            isotop_load_fix();

        });

    }



    /* Fix isotop layout */
    /* -------------------------------------------------------------------- */

    function isotop_load_fix() {

        "use strict";

        if ($.exists('.mk-blog-container') || $.exists('.mk-portfolio-container') || $.exists('.mk-news-container') || $.exists('.mk-gallery-shortcode')) {
            $('.mk-blog-container>article, .mk-portfolio-container>article, .mk-news-container>article, .mk-gallery-shortcode>article').each(function(i) {
                $(this).delay(i * 150).animate({
                    'opacity': 1
                }, 500);

            }).promise().done(function() {
                setTimeout(function() {
                    $('.mk-theme-loop').isotope('reLayout');
                }, 1500);
            });
            setTimeout(function() {
                $('.mk-theme-loop').isotope('reLayout');
            }, 2500);
        }

    }



    /* Recent Works Widget */
    /* -------------------------------------------------------------------- */

    function mk_portfolio_widget() {

        "use strict";

        $('.widget_recent_portfolio li').each(function() {

            $(this).find('.portfolio-widget-thumb').hover(function() {

                $(this).siblings('.portfolio-widget-info').animate({
                    'opacity': 1
                }, 200);
            }, function() {

                $(this).siblings('.portfolio-widget-info').animate({
                    'opacity': 0
                }, 200);
            });

        });
    }


    /* Contact Form */
    /* -------------------------------------------------------------------- */

    function mk_contact_form() {

        "use strict";

        if ($.tools.validator != undefined) {
            $.tools.validator.addEffect("contact_form", function(errors) {
                $.each(errors, function(index, error) {
                    var input = error.input;

                    input.addClass('mk-invalid');
                });
            }, function(inputs) {
                inputs.removeClass('mk-invalid');
            });


            $('.mk-contact-form').validator({
                effect: 'contact_form'
            }).submit(function(e) {
                var form = $(this);
                if (!e.isDefaultPrevented()) {
                    $(this).find('.mk-contact-loading').fadeIn('slow');

                    var data = {
                        action: 'mk_contact_form',
                        to: $(this).find('input[name="contact_to"]').val().replace("*", "@"),
                        name: $(this).find('input[name="contact_name"]').val(),
                        phone: $(this).find('input[name="contact_phone"]').val(),
                        email: $(this).find('input[name="contact_email"]').val(),
                        content: $(this).find('textarea[name="contact_content"]').val()
                    };

                    $.post(ajaxurl, data, function(response) {
                        form.find('.mk-contact-loading').fadeOut('slow');
                        form.find('.mk-contact-success').delay(2000).fadeIn('slow').delay(8000).fadeOut();
                        form.find('input#contact_email, input#contact_name, textarea').val("");

                    });
                    e.preventDefault();
                }
            });

        }
    }



    /* Blog Loop Carousel Shortcode */
    /* -------------------------------------------------------------------- */



    function mk_blog_carousel() {

        "use strict";

        if (!$.exists('.mk-blog-showcase')) {
            return;
        }
        $('.mk-blog-showcase ul li').each(function() {

            $(this).on('hover', function() {

                $(this).siblings('li').removeClass('mk-blog-first-el').end().addClass('mk-blog-first-el');

            });

        });


    }



    /* Header Fixed */

    /* -------------------------------------------------------------------- */
    $(document).ready(function() {
        var mk_header_height = $('.mk-header-inner').height();


        var wp_admin_height = 0;
        var mk_limit_height;
        if ($.exists("#wpadminbar")) {
            wp_admin_height = $("#wpadminbar").height();

            if (!$.exists('.mk-header-toolbar') && !$('#mk-header').hasClass('classic-style-nav')) {
                wp_admin_height = 0;
            }
        }

        if (!$.exists("#wpadminbar") && $.exists('.mk-header-toolbar') && !$('#mk-header').hasClass('classic-style-nav')) {
            wp_admin_height = $('.mk-header-toolbar').height();
        }

        var mk_window_y = 0;
        mk_window_y = $(window).scrollTop();

        if ($('#mk-header').hasClass('classic-style-nav')) {
            mk_limit_height = wp_admin_height + (mk_header_height * 2);
        } else {
            mk_limit_height = wp_admin_height;
        }



        function mk_fix_classic_header() {

            "use strict";

            mk_window_y = $(window).scrollTop();
            if (mk_window_y > mk_limit_height) {
                if (!($(".mk-header-nav-container").hasClass("mk-fixed"))) {
                    //$(".mk-header-toolbar").hide();
                    $(".mk-header-padding-wrapper").css("padding-top", mk_header_height);
                    $(".mk-header-nav-container").addClass("mk-fixed").css("top", wp_admin_height);
                }

            } else {
                if (($(".mk-header-nav-container").hasClass("mk-fixed"))) {
                    $(".mk-header-toolbar").show();
                    $(".mk-header-nav-container").css({
                        "top": 0
                    }).removeClass("mk-fixed");
                    $(".mk-header-padding-wrapper").css("padding-top", "");
                }
            }
        }


        function mk_fix_modern_header() {

            "use strict";

            var mk_window_y = $(window).scrollTop(),
                header_els = $('#mk-header.modern-style-nav .mk-header-inner .main-navigation-ul > li > a, .mk-header-inner #mk-header-search, #mk-header.modern-style-nav .mk-header-inner .mk-header-start-tour, .mk-header-inner,#mk-header.modern-style-nav .mk-search-trigger i, #mk-header.modern-style-nav .mk-search-trigger, .shopping-cart-header'),
                header_height = parseInt($('#mk-header').attr('data-height')),
                header_height_sticky = parseInt($('#mk-header').attr('data-sticky-height')),
                new_height = 0;
 


            if ($.exists("#wpadminbar")) {
                var top_distance = mk_limit_height;

                if (!$.exists('.mk-header-toolbar')) {
                    var top_distance = $("#wpadminbar").height();
                    var top_padding = header_height;
                } else {
                    var top_padding = header_height_sticky;
                }


            } else {
                var top_distance = 0;
                if (!$.exists('.mk-header-toolbar')) {
                    var top_padding = header_height;
                } else {
                    var top_padding = header_height_sticky;
                }
            }

            //console.log(mk_limit_height);
            if (mk_window_y > mk_limit_height) {
                if (!($(".mk-header-inner").hasClass("mk-fixed"))) {
                    //$(".mk-header-toolbar").hide();
                    $(".mk-header-padding-wrapper").css("padding-top", top_padding + 'px');


                    $(".mk-header-inner").addClass("mk-fixed").css({
                        "top": top_distance
                    });
                }


            } else {
                if (($(".mk-header-inner").hasClass("mk-fixed"))) {
                    $(".mk-header-toolbar").show();
                    $(".mk-header-inner").css({
                        "top": 0
                    }).removeClass("mk-fixed");
                    $(".mk-header-padding-wrapper").css("padding-top", "");
                }


            }

            if ($(window).width() > mk_responsive_nav_width) {
                if (mk_window_y < (header_height - header_height_sticky)) {
                    new_height = header_height - mk_window_y;

                } else {
                    new_height = header_height_sticky;
                }
                header_els.css({
                    height: new_height + 'px',
                    lineHeight: new_height + 'px'
                });
            }
        }


        if (mk_window_y > mk_limit_height && !(is_touch_device() || $(window).width() < mk_responsive_nav_width || mk_header_sticky === false)) {
            if ($('#mk-header').hasClass('classic-style-nav')) {
                mk_fix_classic_header();
            } else {
                mk_fix_modern_header();
            }

        }



        $(window).scroll(function() {
            if (is_touch_device() || mk_header_sticky === false || $(window).width() < mk_responsive_nav_width) {
                return;
            }

            if ($('#mk-header').hasClass('classic-style-nav')) {
                mk_fix_classic_header();
            } else {
                mk_fix_modern_header();
            }
            mk_main_navigation();
            setTimeout(function() {
                mk_main_navigation();
            }, 1000);

        });

    });



    /* Header Search Form */
    /* -------------------------------------------------------------------- */

    function mk_header_searchform() {


        "use strict";

        $('.mk-header-toolbar #mk-header-searchform .text-input').on('focus', function() {

            if ($('.mk-header-toolbar #mk-header-searchform .text-input').hasClass('on-close-state')) {
                $('.mk-header-toolbar #mk-header-searchform .text-input').removeClass('on-close-state').animate({
                    'width': '200px'
                }, 200);
                return false;
            }
        });

        $(".mk-header-toolbar .mk-header-searchform").click(function(event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else if (window.event) {
                window.event.cancelBubble = true;
            }
        });

        $('.widget .mk-searchform .text-input').focus(function() {
            $(this).parent().find('.mk-icon-remove-sign').css('opacity', 0.5);
        });
        $('.widget .mk-searchform .text-input').blur(function() {
            $(this).parent().find('.mk-icon-remove-sign').css('opacity', 0);
        });

        $("html").click(function() {
            $(this).find(".mk-header-toolbar #mk-header-searchform .text-input").addClass('on-close-state').animate({
                'width': 90
            }, 300);
        });

        $('.mk-searchform .mk-icon-remove-sign, .mk-notfound-search .mk-icon-remove-sign').on('click', function() {
            $(this).siblings('#mk-header-searchform .text-input, .mk-searchform .text-input, .mk-notfound-search .notfound-text-input').val(' ').focus();
        });
    }



    /* Milestone Number Shortcode */
    /* -------------------------------------------------------------------- */

    function mk_milestone() {

        "use strict";

        if ($.exists('.mk-milestone')) {
            $('.mk-milestone:in-viewport').each(function() {
                var el_this = $(this),
                    stop_number = el_this.find('.milestone-number').attr('data-stop'),
                    animation_speed = parseInt(el_this.find('.milestone-number').attr('data-speed'));

                if (!$(this).hasClass('scroll-animated')) {
                    $(this).addClass('scroll-animated');

                    $({
                        countNum: el_this.find('.milestone-number').text()
                    }).animate({
                        countNum: stop_number
                    }, {
                        duration: animation_speed,
                        easing: 'linear',
                        step: function() {
                            el_this.find('.milestone-number').text(Math.floor(this.countNum));
                        },
                        complete: function() {
                            el_this.find('.milestone-number').text(this.countNum);
                        }
                    });
                }
            });

        }
    }



    /* Skill Meter and Charts */
    /* -------------------------------------------------------------------- */

    function mk_skill_meter() {

        "use strict";

        if ($.exists('.mk-skill-meter')) {
            $(".mk-skill-meter .progress-outer:in-viewport").each(function() {
                var $this = $(this);
                if (!$this.hasClass('scroll-animated')) {
                    $this.addClass('scroll-animated');
                    $this.animate({
                        width: $(this).attr("data-width") + '%'
                    }, 2000);
                }

            });
        }
    }



    function mk_charts() {

        "use strict";

        if ($.exists('.mk-chart')) {
            $(window).on("load", function() {
                $('.mk-chart').each(function() {
                    var $this, $parent_width, $chart_size;
                    $this = $(this);
                    $parent_width = $(this).parent().width();
                    $chart_size = $this.attr('data-barSize');
                    if ($parent_width < $chart_size) {
                        $chart_size = $parent_width;
                        $this.css('line-height', $chart_size);
                        $this.find('i').css({
                            'line-height': $chart_size + 'px',
                            'font-size': ($chart_size / 3)
                        });
                    }
                    if (!$this.hasClass('chart-animated')) {
                        $this.easyPieChart({
                            animate: 1300,
                            lineCap: 'round',
                            lineWidth: $this.attr('data-lineWidth'),
                            size: $chart_size,
                            barColor: $this.attr('data-barColor'),
                            trackColor: $this.attr('data-trackColor'),
                            scaleColor: 'transparent',
                            onStep: function(value) {
                                this.$el.find('.chart-percent span').text(Math.ceil(value));
                            }
                        });
                    }
                });
            });
        }
    }


    /* Google Maps */
    /* -------------------------------------------------------------------- */

    function mk_google_maps() {


        "use strict";

        $('.mk-advanced-gmaps').each(function() {

            var $this = $(this),
                $id = $this.attr('id'),
                $zoom = parseInt($this.attr('data-zoom')),
                $latitude = $this.attr('data-latitude'),
                $longitude = $this.attr('data-longitude'),
                $address = $this.attr('data-address'),
                $latitude_2 = $this.attr('data-latitude2'),
                $longitude_2 = $this.attr('data-longitude2'),
                $address_2 = $this.attr('data-address2'),
                $latitude_3 = $this.attr('data-latitude3'),
                $longitude_3 = $this.attr('data-longitude3'),
                $address_3 = $this.attr('data-address3'),
                $pin_icon = $this.attr('data-pin-icon'),
                $pan_control = $this.attr('data-pan-control') === "true" ? true : false,
                $map_type_control = $this.attr('data-map-type-control') === "true" ? true : false,
                $scale_control = $this.attr('data-scale-control') === "true" ? true : false,
                $draggable = $this.attr('data-draggable') === "true" ? true : false,
                $zoom_control = $this.attr('data-zoom-control') === "true" ? true : false,
                $modify_coloring = $this.attr('data-modify-coloring') === "true" ? true : false,
                $saturation = $this.attr('data-saturation'),
                $hue = $this.attr('data-hue'),
                $lightness = $this.attr('data-lightness'),
                $styles;



            if ($modify_coloring == true) {
                var $styles = [{
                    stylers: [{
                        hue: $hue
                    }, {
                        saturation: $saturation
                    }, {
                        lightness: $lightness
                    }, {
                        featureType: "landscape.man_made",
                        stylers: [{
                            visibility: "on"
                        }]
                    }]
                }];
            }


            var map;

            function initialize() {

                var bounds = new google.maps.LatLngBounds();

                var mapOptions = {
                    zoom: $zoom,
                    panControl: $pan_control,
                    zoomControl: $zoom_control,
                    mapTypeControl: $map_type_control,
                    scaleControl: $scale_control,
                    draggable: $draggable,
                    scrollwheel: false,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    styles: $styles
                };

                map = new google.maps.Map(document.getElementById($id), mapOptions);
                map.setTilt(45);

                // Multiple Markers

                var markers = [];
                var infoWindowContent = [];

                if ($latitude != '' && $longitude != '') {
                    markers[0] = [$address, $latitude, $longitude];
                    infoWindowContent[0] = ['<div class="info_content"><p>' + $address + '</p></div>'];
                }

                if ($latitude_2 != '' && $longitude_2 != '') {
                    markers[1] = [$address_2, $latitude_2, $longitude_2];
                    infoWindowContent[1] = ['<div class="info_content"><p>' + $address_2 + '</p></div>'];
                }

                if ($latitude_3 != '' && $longitude_3 != '') {
                    markers[2] = [$address_3, $latitude_3, $longitude_3];
                    infoWindowContent[3] = ['<div class="info_content"><p>' + $address_3 + '</p></div>'];
                }



                var infoWindow = new google.maps.InfoWindow(),
                    marker, i;


                for (i = 0; i < markers.length; i++) {
                    var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
                    bounds.extend(position);
                    marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        title: markers[i][0],
                        icon: $pin_icon
                    });

                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                            infoWindow.setContent(infoWindowContent[i][0]);
                            infoWindow.open(map, marker);
                        }
                    })(marker, i));

                    map.fitBounds(bounds);

                }


                var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
                    this.setZoom($zoom);
                    google.maps.event.removeListener(boundsListener);
                });
            }

            google.maps.event.addDomListener(window, "load", initialize);


        });

        $(window).load(function() {
            if ($.exists('.mk-gmaps-parallax')) {
                var mk_skrollr = skrollr.init({
                    forceHeight: false
                });
                mk_skrollr.refresh($('.mk-page-section'));
            }
        });



    }



    /* Scroll function for main navigation on one page concept */
    /* -------------------------------------------------------------------- */



    function mk_main_nav_scroll() {


        "use strict";

        //console.log(window.location.href.split('#')[0]);
        var lastId, topMenu = $("#mk-main-navigation"),
            menuItems = topMenu.find("a");


        menuItems.each(function() {
            //console.log();
            var href_attr = $(this).attr('href');

            
            if (typeof href_attr !== 'undefined' && href_attr !== false) {
                var href = $(this).attr("href").split('#')[0];
            } else {
                href = "";
            }

            if (href == window.location.href.split('#')[0] && (typeof $(this).attr("href").split('#')[1] != 'undefined')) {
                //console.log($(this).attr("href").split('#')[1]);
                $(this).attr("href", "#" + $(this).attr("href").split('#')[1]);
                $(this).parent().removeClass("current-menu-item");
            }


        });



        var scrollItems = menuItems.map(function() {
            var item = $(this).attr("href");

            if (/^#\w/.test(item) && $(item).length) {

                return $(item);
            }

        });


        if ($.exists("#wpadminbar")) {
            var wp_admin_height = $("#wpadminbar").height();
        } else {
            wp_admin_height = 0;
        }
        var header_height = parseInt($('#mk-header').attr('data-sticky-height'));


        menuItems.click(function(e) {
            var href = $(this).attr("href");
            if (typeof $(href).offset() != 'undefined') {
                var href_top = $(href).offset().top;
            } else {
                var href_top = 0;
            }
            //console.log(href_top);
            var offsetTop = href === "#" ? 0 : href_top - (wp_admin_height + header_height - 1) + "px";

            $('html, body').stop().animate({
                scrollTop: offsetTop
            }, {
                duration: 1200,
                easing: "easeInOutExpo"
            });
            e.preventDefault();
        });


        $(window).scroll(function() {

            if (!scrollItems.length) return false;

            var fromTop = $(this).scrollTop() + (wp_admin_height + header_height);

            var cur = scrollItems.map(function() {

                if ($(this).offset().top < fromTop) return this;
            });
            //console.log(cur);
            cur = cur[cur.length - 1];
            var id = cur && cur.length ? cur[0].id : "";

            if (lastId !== id) {
                lastId = id;

                menuItems.parent().removeClass("current-menu-item");
                if (id.length) {
                    menuItems.filter("[href=#" + id + "]").parent().addClass("current-menu-item");
                }
            }
        });
    }

    mk_main_nav_scroll();
    /* Swipe Slideshow */
    /* -------------------------------------------------------------------- */


    function mk_swipe_slider() {


        "use strict";

        $('.mk-swiper-slider').each(function() {

            var $this = $(this),
                $thumbs = $this.parent().siblings('.gallery-thumbs-small'),
                $next_arrow = $this.find('.mk-swiper-next'),
                $prev_arrow = $this.find('.mk-swiper-prev'),
                $direction = $this.attr('data-direction'),
                $pagination = $this.attr('data-pagination') == "true" ? true : false,
                $slideshowSpeed = $this.attr('data-slideshowSpeed'),
                $animationSpeed = $this.attr('data-animationSpeed'),
                $controlNav = $this.attr('data-controlNav') == "true" ? true : false,
                $directionNav = $this.attr('data-directionNav') == "true" ? true : false,
                $freeModeFluid = $this.attr('data-freeModeFluid') == "true" ? true : false,
                $freeMode = $this.attr('data-freeMode') == "true" ? true : false,
                $mousewheelControl = $this.attr('data-mousewheelControl') == "true" ? true : false,
                $loop = $this.attr('data-loop') == "true" ? true : false,
                $slidesPerView = $this.attr('data-slidesPerView');

            if ($pagination === true) {
                var $pagination_class = '#' + $this.attr('id') + ' .swiper-pagination';
            } else {
                var $pagination_class = false;
            }


            var mk_swiper = $(this).swiper({
                mode: $direction,
                loop: $loop,
                freeMode: $freeMode,
                pagination: $pagination_class,
                freeModeFluid: $freeModeFluid,
                autoplay: $slideshowSpeed,
                speed: $animationSpeed,
                calculateHeight: true,
                grabCursor: true,
                useCSS3Transforms: false,
                mousewheelControl: $mousewheelControl,
                paginationClickable: true,
                slidesPerView: $slidesPerView,
                onSwiperCreated: function(swiper) {

                },
                onSlideChangeStart: function() {
                    $thumbs.find('.active-item').removeClass('active-item');
                    $thumbs.find('a').eq(mk_swiper.activeIndex).addClass('active-item');
                }
            });


            $prev_arrow.click(function(e) {
                mk_swiper.swipePrev();
            });

            $next_arrow.click(function(e) {
                mk_swiper.swipeNext();
            });



            $thumbs.find('a').on('touchstart mousedown', function(e) {
                e.preventDefault();
                $thumbs.find('.active-item').removeClass('active-item');
                $(this).addClass('active-item');
                mk_swiper.swipeTo($(this).index());
            });

            $thumbs.find('a').click(function(e) {
                e.preventDefault();
            });


        });

    }



    /* Edge Slideshow */
    /* -------------------------------------------------------------------- */


    function mk_edge_slider_init() {


        "use strict";

        $('.mk-edge-slider').each(function() {
            var $slider_wrapper = $(this),
                $next_arrow = $slider_wrapper.find('.mk-edge-next'),
                $prev_arrow = $slider_wrapper.find('.mk-edge-prev'),
                $pause = $slider_wrapper.attr('data-pause'),
                $speed = $slider_wrapper.attr('data-speed');

            $slider_wrapper.find('.mk-animate-element').removeClass('mk-animate-element fade-in scale-up right-to-left left-to-right bottom-to-top top-to-bottom flip-x flip-y');

            var mk_swiper = $slider_wrapper.swiper({
                mode: 'horizontal',
                loop: true,
                grabCursor: true,
                useCSS3Transforms: true,
                mousewheelControl: false,
                // pagination : $pagination_class,
                freeModeFluid: true,
                speed: $speed,
                autoplay: $pause,
                autoplayDisableOnInteraction: true
            });

            $prev_arrow.click(function (e) {
                mk_swiper.swipePrev();
                e.preventDefault();
            });

            $next_arrow.click(function (e) {
                mk_swiper.swipeNext();
                e.preventDefault();
            });


        });

    }



    function mk_edge_slider_resposnive() {

        "use strict";

        $('.mk-edge-slider').each(function() {


            var $this = $(this),
                $items = $this.find('.edge-slider-holder, .swiper-slide'),
                $height = $this.attr('data-height'),
                $fullHeight = $this.attr('data-fullHeight');

            var $window_height = $(window).outerHeight();


            if ($.exists('#wpadminbar')) {
                $window_height = $window_height - $('#wpadminbar').outerHeight();
            }


            if ($.exists('.mk-header-toolbar')) {
                $window_height = $window_height - $('.mk-header-toolbar').outerHeight();
            }


            if ($.exists('.mk-header-inner')) {
                if ($this.parents('#mk-header').length > 0) {
                    var $header_height = $('#mk-header').attr('data-height');
                } else {
                    var $header_height = $('#mk-header').attr('data-sticky-height') - 30;
                }

            } else {
                var $header_height = 0;
            }



            if ($(window).width() < 780) {

                $window_height = 600;

            } else if ($fullHeight == 'true') {

                $window_height = $window_height - $header_height;

            } else {

                $window_height = $height;
            }

            $items.css('height', $window_height);

            $this.find('.swiper-slide').each(function() {


                var $this = $(this),
                    $content = $this.find('.edge-slide-content');

                if ($this.hasClass('left_center') || $this.hasClass('center_center') || $this.hasClass('right_center')) {

                    var $this_height_half = $content.outerHeight() / 2,
                        $window_half = $window_height / 2;

                    $content.css('marginTop', ($window_half - $this_height_half));
                }

                if ($this.hasClass('left_bottom') || $this.hasClass('center_bottom') || $this.hasClass('right_bottom')) {

                    var $distance_from_top = $window_height - $content.outerHeight() - 90;

                    $content.css('marginTop', ($distance_from_top));
                }

            });

            $this.find('.edge-skip-slider').bind("click", function() {
                console.log($window_height);
                $("html, body").stop(true, true).animate({
                    scrollTop: $window_height + 40,
                    easing: "easeInOutExpo"
                }, 500);

            });

        $this.find('.edge-slider-loading').fadeOut();
        });

    }



})(jQuery);



function mk_flexslider_init() {

    "use strict";

    jQuery('.mk-flexslider.mk-script-call').each(function() {
        var $this = jQuery(this),
            $selector = $this.attr('data-selector'),
            $animation = $this.attr('data-animation'),
            $easing = $this.attr('data-easing'),
            $direction = $this.attr('data-direction'),
            $smoothHeight = $this.attr('data-smoothHeight') == "true" ? true : false,
            $slideshowSpeed = $this.attr('data-slideshowSpeed'),
            $animationSpeed = $this.attr('data-animationSpeed'),
            $controlNav = $this.attr('data-controlNav') == "true" ? true : false,
            $directionNav = $this.attr('data-directionNav') == "true" ? true : false,
            $pauseOnHover = $this.attr('data-pauseOnHover') == "true" ? true : false,
            $isCarousel = $this.attr('data-isCarousel') == "true" ? true : false;

        if ($selector != undefined) {
            var $selector_class = $selector;
        } else {
            var $selector_class = ".mk-flex-slides > li";
        }

        if ($isCarousel == true) {
            var $itemWidth = parseInt($this.attr('data-itemWidth')),
                $itemMargin = parseInt($this.attr('data-itemMargin')),
                $minItems = parseInt($this.attr('data-minItems')),
                $maxItems = parseInt($this.attr('data-maxItems')),
                $move = parseInt($this.attr('data-move'));
        } else {
            var $itemWidth = $itemMargin = $minItems = $maxItems = $move = 0;
        }

        $this.flexslider({
            selector: $selector_class,
            animation: $animation,
            easing: $easing,
            direction: $direction,
            smoothHeight: $smoothHeight,
            slideshow: true,
            slideshowSpeed: $slideshowSpeed,
            animationSpeed: $animationSpeed,
            controlNav: $controlNav,
            directionNav: $directionNav,
            pauseOnHover: $pauseOnHover,
            prevText: "",
            nextText: "",
            itemWidth: $itemWidth,
            itemMargin: $itemMargin,
            minItems: $minItems,
            maxItems: $maxItems,
            move: $move,
        });

    });

}


function mk_ajax_lightbox_init() {
    jQuery('.mk-lightbox').iLightBox();
}

function mk_ajax_gallery_lightbox_init() {
    jQuery('.mk-gallery-shortcode').each(function() {
        var item = jQuery(this).find('.gallery-lightbox');

        jQuery(item).iLightBox();

    });
}





/* Element Click Events */
/* -------------------------------------------------------------------- */


function mk_click_events() {


    "use strict";


    jQuery(".mk-header-login, .mk-header-signup, .mk-quick-contact-wrapper, .blog-share-container, .news-share-buttons, .main-nav-side-search").click(function(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else if (window.event) {
            window.event.cancelBubble = true;
        }
    });
    jQuery("html").click(function() {
        jQuery(this).find(".mk-login-register, #mk-header-subscribe, #mk-quick-contact, .single-share-buttons, .single-share-box, .blog-social-share, .news-share-buttons, #mk-nav-search-wrapper").fadeOut(100);
        jQuery('.mk-quick-contact-link').removeClass('quick-contact-active');
        jQuery('.mk-toggle-trigger').removeClass('mk-toggle-active');
    });

    jQuery('.mk-forget-password').on('click', function() {
        jQuery('#mk-forget-panel').siblings().hide().end().show();
    });

    jQuery('.mk-create-account').on('click', function() {
        jQuery('#mk-register-panel').siblings().hide().end().show();
    });

    jQuery('.mk-return-login').on('click', function() {
        jQuery('#mk-login-panel').siblings().hide().end().show();
    });


    jQuery('.mk-quick-contact-link').on('click', function() {
        if (!jQuery(this).hasClass('quick-contact-active')) {
            jQuery('#mk-quick-contact').fadeIn(150);
            jQuery(this).addClass('quick-contact-active');
        } else {
            jQuery('#mk-quick-contact').fadeOut(100);
            jQuery(this).removeClass('quick-contact-active');
        }
        return false;
    });
}


function mk_theme_toggle_box() {

    "use strict";

    jQuery('.mk-toggle-trigger').on('click', function() {
        if (!jQuery(this).hasClass('mk-toggle-active')) {
            jQuery('.mk-box-to-trigger').fadeOut(100);
            jQuery(this).parent().find('.mk-box-to-trigger').fadeIn(150);
            jQuery('.mk-toggle-trigger').removeClass('mk-toggle-active');
            jQuery(this).addClass('mk-toggle-active');
        } else {
            jQuery('.mk-box-to-trigger').fadeOut(100);
            jQuery(this).removeClass('mk-toggle-active');
        }
        return false;
    });
}

function mk_social_share_global() {

        "use strict";

        jQuery('.twitter-share').on('click', function() {
            var $url = jQuery(this).attr('data-url'),
                $title = jQuery(this).attr('data-title');

            window.open('http://twitter.com/intent/tweet?text=' + $title + ' ' + $url, "twitterWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
            return false;
        });

        jQuery('.pinterest-share').on('click', function() {
            var $url = jQuery(this).attr('data-url'),
                $title = jQuery(this).attr('data-title'),
                $image = jQuery(this).attr('data-image');
            window.open('http://pinterest.com/pin/create/button/?url=' + $url + '&media=' + $image + '&description=' + $title, "twitterWindow", "height=320,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
            return false;
        });

        jQuery('.facebook-share').on('click', function() {
            var $url = jQuery(this).attr('data-url');
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + $url, "facebookWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
            return false;
        });

        jQuery('.googleplus-share').on('click', function() {
            var $url = jQuery(this).attr('data-url');
            window.open('https://plus.google.com/share?url=' + $url, "googlePlusWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
            return false;
        });

        jQuery('.linkedin-share').on('click', function() {
            var $url = jQuery(this).attr('data-url'),
                $title = jQuery(this).attr('data-title'),
                $desc = jQuery(this).attr('data-desc');
            window.open('http://www.linkedin.com/shareArticle?mini=true&url=' + $url + '&title=' + $title + '&summary=' + $desc, "linkedInWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0");
            return false;
        });
    }
