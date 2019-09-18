<!DOCTYPE html>
<html itemscope="itemscope" itemtype="http://schema.org/WebPage" xmlns="http://www.w3.org/1999/xhtml" lang="en-US">
    <html>
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0" />
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
            <title itemprop="name">Marmoset Brain Connectivity Atlas</title>
            <link rel="shortcut icon" href="http://www.brainarchitecture.org/wp-content/uploads/2014/11/ba_favicon.ico"  />
            ##<link rel="alternate" type="application/rss+xml" title="Marmoset Brain Connectivity Atlas RSS Feed" href="http://www.marmosetbrain.org/feed">
            ##<link rel="alternate" type="application/atom+xml" title="Marmoset Brain Connectivity Atlas Atom Feed" href="http://www.marmosetbrain.org/feed/atom">

            <script type='text/javascript' src="${h.static('scripts/lodash.min.js')}"></script>
            <script type='text/javascript' src="${h.static('scripts/moment.min.js')}"></script>
            <!--[if lt IE 9]>
            <script src="${h.static('scripts/html5shiv.js')}" type="text/javascript"></script>
            <![endif]-->
            <!--[if IE 7 ]>
            <link href="${h.static('scripts/ie7.css')}" media="screen" rel="stylesheet" type="text/css" />
            <![endif]-->
            <!--[if IE 8 ]>
            <link href="${h.static('scripts/ie8.css')}" media="screen" rel="stylesheet" type="text/css" />
            <![endif]-->

            <!--[if lte IE 8]>
            <script type="text/javascript" src="${h.static('scripts/respond.js')}"></script>
            <![endif]-->
            <%doc>
                <link rel='stylesheet' id='layerslider-css'  href="${h.static('css/layerslider.css')}" type='text/css' media='all' />
            ##<link rel='stylesheet' id='ls-google-fonts-css'  href='http://fonts.googleapis.com/css?family=Lato:100,300,regular,700,900|Open+Sans:300|Indie+Flower:regular|Oswald:300,regular,700&#038;subset=latin,latin-ext' type='text/css' media='all' />
            <link rel='stylesheet' id='bbp-parent-bbpress-css'  href="${h.static('css/bbpress.css')}" type='text/css' media='screen' />
            <link rel='stylesheet' id='contact-form-7-css'  href="${h.static('css/style.css')}" type='text/css' media='all' />
            <link rel='stylesheet' id='rs-plugin-settings-css'  href="${h.static('css/settings.css')}" type='text/css' media='all' />
            <link rel='stylesheet' id='rs-plugin-captions-css'  href="${h.static('css/captions.css')}" type='text/css' media='all' />
            ##<link rel='stylesheet' id='NextGEN-css'  href="${h.static('css/nggallery.css')}" type='text/css' media='screen' />
            <link rel='stylesheet' id='shutter-css'  href="${h.static('css/shutter-reloaded.css')}" type='text/css' media='screen' />
            <link rel='stylesheet' id='icomoon-fonts-css'  href="${h.static('css/icomoon-fonts.css')}" type='text/css' media='all' />
            <link rel='stylesheet' id='theme-icons-css'  href="${h.static('css/theme-icons.css')}" type='text/css' media='all' />
            <link rel='stylesheet' id='css-iLightbox-css'  href="${h.static('css/ilightbox-style.css')}" type='text/css' media='all' />
            <link rel='stylesheet' id='galleryview-css-css'  href="${h.static('css/galleryview.css')}" type='text/css' media='all' />
            <link rel='stylesheet' id='theme-dynamic-styles-css'  href="${h.static('css/custom.css')}" type='text/css' media='all' />
            <link rel='stylesheet' id='mk-style-css'  href="${h.static('css/mouse-brain.css')}" type='text/css' media='all' />
            <link rel='stylesheet' id='theme-styles-css'  href="${h.static('css/theme-styles.css')}" type='text/css' media='all' />
            </%doc>
            <link rel='stylesheet' id='font-css'  href="${h.static('css/fonts.css')}" type='text/css' media='all' />
            <link rel='stylesheet' id='font-awesome-css'  href="${h.static('css/font-awesome.css')}" type='text/css' media='all' />
            <link rel='stylesheet' href="${h.static('css/bootstrap.min.css')}" type='text/css' media='all' />
            <link rel='stylesheet' href="${h.static('css/bootstrap-theme.min.css')}" type='text/css' media='all' />
            <link rel='stylesheet' href="${h.static('css/select2.min.css')}" type='text/css' media='all' />
            <link href="${h.static('css/home.css')}" rel="stylesheet" type="text/css" />
            <%block name='styles'/>

            <script type='text/javascript' src="${h.static('scripts/jquery-3.1.1.min.js')}"></script>
            ##<script type='text/javascript' src="${h.static('scripts/jquery-migrate-1.2.1.min.js')}"></script>
            ##<script type='text/javascript' src="${h.static('scripts/script.js')}"></script>
            ##<script type='text/javascript' src="${h.static('scripts/layerslider.kreaturamedia.jquery.js')}"></script>
            <script type='text/javascript' src="${h.static('scripts/greensock.js')}"></script>
            <script type='text/javascript' src="${h.static('scripts/layerslider.transitions.js')}"></script>
            <script type='text/javascript' src="${h.static('scripts/jquery.poshytip.min.js')}"></script>
            <script type='text/javascript' src="${h.static('scripts/select2.full.min.js')}"></script>
            <script type='text/javascript' src="${h.static('scripts/jquery-editable-poshytip.js')}"></script>
            ##<script type='text/javascript' src='http://www.brainarchitecture.org/wp-content/plugins/revslider/rs-plugin/js/jquery.themepunch.plugins.min.js?rev=4.3.8&#038;ver=3.9.2'></script>
            ##<script type='text/javascript' src='http://www.brainarchitecture.org/wp-content/plugins/revslider/rs-plugin/js/jquery.themepunch.revolution.min.js?rev=4.3.8&#038;ver=3.9.2'></script>
            <%doc>
                <script type="text/javascript">
                    var mk_header_parallax, mk_banner_parallax, mk_page_parallax, mk_footer_parallax, mk_body_parallax;
                    var mk_images_dir = "http://www.brainarchitecture.org/wp-content/themes/jupiter/images",
                    mk_theme_js_path = "http://www.brainarchitecture.org/wp-content/themes/jupiter/js",
                    mk_responsive_nav_width = 1180,
                    mk_grid_width = 1180,
                    mk_header_sticky = true,
                    mk_ajax_search_option = "beside_nav";
                    mk_header_parallax = false,
                    mk_banner_parallax = false,
                    mk_page_parallax = false,
                    mk_footer_parallax = false,
                    mk_body_parallax = false,
                    mk_no_more_posts = "No More Posts";

                    function is_touch_device() {
                        return ('ontouchstart' in document.documentElement);
                    }

                </script>
            </%doc>
            <script type="text/javascript">var ajaxurl = "http://www.brainarchitecture.org/wp-admin/admin-ajax.php"</script>
            <script type='text/javascript'>
                /* <![CDATA[ */
                var shutterSettings = {"msgLoading":"L O A D I N G","msgClose":"Click to Close","imageCount":"1"};
                /* ]]> */
            </script>
            ##<script type='text/javascript' src='http://www.brainarchitecture.org/wp-content/plugins/nextcellent-gallery-nextgen-legacy/shutter/shutter-reloaded.js?ver=1.3.3'></script>
            ##<script type='text/javascript' src='http://www.brainarchitecture.org/wp-content/plugins/nextcellent-gallery-nextgen-legacy/js/jquery.cycle.all.min.js?ver=2.9995'></script>
            ##<script type='text/javascript' src='http://www.brainarchitecture.org/wp-content/plugins/nextcellent-gallery-nextgen-legacy/js/ngg.slideshow.min.js?ver=1.06'></script>
            <link rel="EditURI" type="application/rsd+xml" title="RSD" href="http://www.brainarchitecture.org/xmlrpc.php?rsd" />
            <link rel="wlwmanifest" type="application/wlwmanifest+xml" href="http://www.brainarchitecture.org/wp-includes/wlwmanifest.xml" /> 
            <link rel='next' title='About' href='http://www.brainarchitecture.org/project-overview' />
            <link rel='canonical' href='http://www.brainarchitecture.org/' />
            <link rel='shortlink' href='http://www.brainarchitecture.org/' />

            <script type="text/javascript">
                /* <![CDATA[ */

                jQuery(document).ready( function() {

                    /* Use backticks instead of <code> for the Code button in the editor */
                        if ( typeof( edButtons ) !== 'undefined' ) {
                            edButtons[110] = new QTags.TagButton( 'code', 'code', '`', '`', 'c' );
                            QTags._buttonsInit();
                        }

                        /* Tab from topic title */
                        jQuery( '#bbp_topic_title' ).bind( 'keydown.editor-focus', function(e) {
                            if ( e.which !== 9 )
                            return;

                            if ( !e.ctrlKey && !e.altKey && !e.shiftKey ) {
                                if ( typeof( tinymce ) !== 'undefined' ) {
                                    if ( ! tinymce.activeEditor.isHidden() ) {
                                        var editor = tinymce.activeEditor.editorContainer;
                                        jQuery( '#' + editor + ' td.mceToolbar > a' ).focus();
                                        } else {
                                        jQuery( 'textarea.bbp-the-content' ).focus();
                                    }
                                    } else {
                                    jQuery( 'textarea.bbp-the-content' ).focus();
                                }

                                e.preventDefault();
                            }
                        });

                        /* Shift + tab from topic tags */
                        jQuery( '#bbp_topic_tags' ).bind( 'keydown.editor-focus', function(e) {
                            if ( e.which !== 9 )
                            return;

                            if ( e.shiftKey && !e.ctrlKey && !e.altKey ) {
                                if ( typeof( tinymce ) !== 'undefined' ) {
                                    if ( ! tinymce.activeEditor.isHidden() ) {
                                        var editor = tinymce.activeEditor.editorContainer;
                                        jQuery( '#' + editor + ' td.mceToolbar > a' ).focus();
                                        } else {
                                        jQuery( 'textarea.bbp-the-content' ).focus();
                                    }
                                    } else {
                                    jQuery( 'textarea.bbp-the-content' ).focus();
                                }

                                e.preventDefault();
                            }
                        });
                    });
                    /* ]]> */
                </script>

                <!-- <meta name="NextGEN" version="1.9.23" /> -->
                ##<script type='text/javascript' src="${h.static('scripts/comment-reply.min.js')}"></script>
                ##<script type='text/javascript' src="${h.static('scripts/jquery.form.min.js')}"></script>
                ##<script type='text/javascript' src="${h.static('scripts/script.js')}"></script>
                ##<script type="text/javascript" src="${h.static('scripts/jquery-ui.min.js')}"></script>
                ##<script type='text/javascript' src='http://www.brainarchitecture.org/wp-includes/js/jquery/ui/jquery.ui.core.min.js?ver=1.10.4'></script>
                ##<script type='text/javascript' src='http://www.brainarchitecture.org/wp-includes/js/jquery/ui/jquery.ui.widget.min.js?ver=1.10.4'></script>
                ##<script type='text/javascript' src='http://www.brainarchitecture.org/wp-includes/js/jquery/ui/jquery.ui.position.min.js?ver=1.10.4'></script>
                ##<script type='text/javascript' src='http://www.brainarchitecture.org/wp-includes/js/jquery/ui/jquery.ui.menu.min.js?ver=1.10.4'></script>
                ##<script type='text/javascript' src='http://www.brainarchitecture.org/wp-includes/js/jquery/ui/jquery.ui.autocomplete.min.js?ver=1.10.4'></script>
                ##<script type='text/javascript' src="${h.static('scripts/ilightbox.packed.js')}"></script>
                ##<script type='text/javascript' src='http://www.brainarchitecture.org/wp-content/themes/jupiter/js/min/SmoothScroll-ck.js?ver=3.9.2'></script>
                ##<script type='text/javascript' src="${h.static('scripts/vendors.js')}"></script>
                ##<script type='text/javascript' src="${h.static('scripts/theme-scripts.js')}"></script>
                ##<script type='text/javascript' src="${h.static('scripts/jquery.easing.min.js')}"></script>
                    ##<script type='text/javascript' src='http://www.brainarchitecture.org/wp-content/plugins/nextgen-galleryview2/galleryview/js/jquery.timers.min.js'></script>
                    ##<script type='text/javascript' src='http://www.brainarchitecture.org/wp-content/plugins/nextgen-galleryview2/galleryview/js/jquery.galleryview.min.js'></script>
                    ##<script type='text/javascript' src="${h.static('scripts/jquerytransit.js')}"></script>
                <%block name='scripts'/>
                <!-- Piwik -->
                <script type="text/javascript">
                  var _paq = _paq || [];
                  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
                  _paq.push(['trackPageView']);
                  _paq.push(['enableLinkTracking']);
                  (function() {
                    var u="//piwik.mrosa.org/";
                    _paq.push(['setTrackerUrl', u+'piwik.php']);
                    _paq.push(['setSiteId', '1']);
                    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
                  })();
                </script>
                <!-- End Piwik Code -->
            </head>

            <body class="home page page-id-1686 page-template-default  main-nav-align-center">
                ${next.body()}
                <script type="text/javascript"><%block name='body_scripts'/></script>
            </body>
        </html>
