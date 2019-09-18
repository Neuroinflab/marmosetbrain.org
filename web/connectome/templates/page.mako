<%inherit file='base.mako'/>
<header>
<div class="container">
    <div class="row header-inner">
        <div class="col-md-12">
            ##<div class="header-bg"></div>
            ##<div class="toolbar-responsive-icon"><i class="fa fa-chevron-down"></i></div>
            <div class="row">
                <div class="header-logo left-logo col-md-12">
                    <nav id="main-navigation" class="main-menu main-navigation ${'logged-in' if h.logged_in else ''}">
                    <a href="${h.route('home')}" title="Marmoset Brain Connectivity Atlas">
                        <img class="mk-desktop-logo" alt="Marmoset Brain Connectivity Atlas" src="${h.static('images/marmoset_header.png')}">
                        </a>
                        <ul>
                            <li class="menu-item${' current-menu-item' if request.path == '/' or request.path == '/marmoset' else ''}"><a href="${request.route_url('home')}">Home</a></li>
                            <li class="menu-item${' current-menu-item' if request.path == '/injection' or request.path == '/marmoset' else ''}"><a href="${request.route_url('injection.search')}">Injections</a></li>
                            ##<li class="menu-item menu-item-type-post_type menu-item-object-page${' current-menu-item' if request.path == '/whitepaper' else ''} page_item current_page_item"><a href="http://www.brainarchitecture.org/project-overview" target="_blank">About</a>
                            ##    <ul class="sub-menu">
                            ##        <li class="menu-item menu-item-type-post_type menu-item-object-page">
                            ##            <a href="http://www.brainarchitecture.org/project-overview" target="_blank">Project Overview</a></li>
                            ##    </li>
                            ##</ul>
                            </li>
                            ##<li class="menu-item${' current-menu-item' if request.path == '/other_data' else ''}"><a href="${request.route_url('other_data')}" class="multiline">Other<br/>Data</a></li>
                            <li class="menu-item${' current-menu-item' if request.path == '/other_data' else ''}"><a href="http://analytics.marmosetbrain.org" class="multiline" target="_blank">Connectivity<br/>Matrix</a></li>
                            <li class="menu-item${' current-menu-item' if request.path == '/reference' else ''}"><a href="${request.route_url('reference')}" class="multiline">Reference<br/>Materials</a></li>
                            <li class="menu-item${' current-menu-item' if request.path == '/whitepaper' else ''}"><a href="${request.route_url('whitepaper')}" class="multiline">Project<br/>Document</a></li>
                            %if request.authenticated_userid:
                                <li class="menu-item${' current-menu-item' if request.path == '/dashboard' else ''}"><a href="${request.route_url('dashboard')}">Dashboard</a></li>
                                <li class="menu-item"><a href="${request.route_url('logout')}">Logout</a></li>
                            %else:
                                ##<li class="menu-item menu-item-type-post_type menu-item-object-page page_item current_page_item"><a href="${request.route_url('login')}">Login</a></li>
                            %endif
                        </ul>
                        <div class="side-icons">

                            <a href="http://mouse.brainarchitecture.org"><img src="${h.static('images/mouse-nav-icon.png')}"></a>

                            <a href="http://www.brainarchitecture.org/human-brain"><img src="${h.static('images/brain-nav-icon.png')}"></a>

                            <a href="http://marmoset.brainarchitecture.org/"><img src="${h.static('images/marmoset-nav-icon.png')}"></a>

                            <a href="http://www.brainarchitecture.org/text-mining"><img src="${h.static('images/search-nav-icon.png')}"></a>

                        </div>

                    </nav>
                </div><!-- /.header-logo .left-logo -->
                    ##<div class="main-nav-side-search">
                    ##    <a class="mk-search-trigger mk-toggle-trigger" href="#">
                    ##        <i class="mk-icon-search"></i>
                    ##    </a>
                    ##    <div id="mk-nav-search-wrapper" class="mk-box-to-trigger">
                    ##        <form method="get" id="mk-header-navside-searchform" action="http://www.brainarchitecture.org">
                    ##            <input type="text" value="" name="s" id="mk-ajax-search-input" />
                    ##            <i class="mk-moon-search-3 nav-side-search-icon"><input value="" type="submit" /></i>
                    ##        </form>
                    ##    </div><!-- /.mk-box-to-trigger -->
                    ##</div><!-- /.main-nav-side-search -->
                <div class="mk-nav-responsive-link"><i class="mk-moon-menu-3"></i></div>
            </div><!-- /.row -->
        </div><!-- /.col-md-12">
    </div><!-- /.header-inner -->
    <div class="cookie-prompt">
        <p>We use cookies to offer an improved experience and to keep your viewing preferences.<br/>By using our Marmoset Brain website you are giving your consent to <a href="${h.route('cookie_policy')}">our cookie policy.</a></p>
        <p><button id="accept_cookie_policy">Got it!</button></p>
    </div><!-- /.cookie-prompt -->
</div><!-- /.container -->
</header>
<%doc>
    <div class="mk-zindex-fix"></div>
    <form class="responsive-searchform" method="get" style="display: none;" action="http://www.brainarchitecture.org">
        <input type="text" class="text-input" value="" name="s" id="s" placeholder="Search.." />
        <i class="mk-icon-search"><input value="" type="submit" /></i>
    </form>
</%doc>
<div class="page-container">
    ${next.body()}
    <%block name='footer_license'>
        ##<div class="license-wrapper">
        ##</div>
        <div class="footer">
            <div class="license">
                <div class="caption"><a href="${h.route('about')}" style="text-decoration: none">LICENSING AND CITATION POLICY</a></div>
                <div>Click <a href="${h.route('about')}">here</a> for licensing information <br/>and citation policy page.</div>
            </div>
            <div class="acknowledgement">
                <section class="acknowledgement">
                    <div class="left-half-line"></div>
                    ##<div class="caption">SPONSORED BY</div>
                    <section class="sponsor arc">
                        <a href="http://www.arc.gov.au" target="_blank">
                            <img class="arc-logo" src="/static/images/arc_logo.png" width="234" height="53"/>
                        </a>
                        <div class="sponsor-tooltip">
                            <div class="tooltip-text">
                                <span>This project is sponsored by<br/>
                                    Australian Research Council</span>
                            </div>
                        </div>
                    </section>
                    <section class="sponsor cibf">
                        <a href="http://www.cibf.edu.au/discovery" target="_blank">
                            <img class="cibf-logo" src="/static/images/cibf_logo.png" width="268" height="53"/>
                        </a>
                        <div class="sponsor-tooltip">
                            <div class="tooltip-text">
                                <span>This project is sponsored by<br/>
                                    Australian Research Council<br/>
                                    Center of Excellence for Integrative Brain Function</span>
                            </div>
                        </div>
                    </section>
                    <section class="sponsor monash">
                        <a href="http://www.monash.edu.au" target="_blank">
                            <img class="monash-logo" src="/static/images/monash_logo.png" width="181" height="53" />
                        </a>
                        <div class="sponsor-tooltip">
                            <div class="tooltip-text">
                                <span>This project is sponsored by<br/>
                                    Monash University</span>
                            </div>
                        </div>
                    </section>
                    <section class="sponsor nencki">
                        <a href="http://en.nencki.gov.pl/laboratory-of-neuroinformatics" target="_blank">
                            <img class="nencki-logo" src="/static/images/nencki_logo.png" height="66" />
                        </a>
                        <div class="sponsor-tooltip">
                            <div class="tooltip-text">
                                <span>Data analysis and website development<br/>
                                    conducted in collaboration with<br/>
                                    the Laboratory of Neuroinformatics at<br/>
                                    the Nencki Institute of Experimental Biology;<br/>
                                    Warsaw, Poland.
                                    </span>
                            </div>
                        </div>
                    </section>

                    <section class="sponsor incf">
                        <a href="https://www.incf.org/" target="_blank">
                            <img class="incf-logo" src="/static/images/incf_logo.svg" width="115" height="53"/>
                            <%doc>
                            </%doc>
                        </a>
                        <div class="sponsor-tooltip">
                            <div class="tooltip-text">
                                <span>This project is sponsored by the<br/>
                                International Neuroinformatics Coordinating Facility<br/>
                                Seed Funding Grant</span>
                            </div>
                        </div>
                    </section>
                    <section class="sponsor cshl">
                        <a href="https://www.cshl.edu/" target="_blank">
                            ##<img class="cshl-logo" src="/static/images/csh.png" width="54" height="54"/>
                            <img class="cshl-logo" src="/static/images/cshl_logo_small.png" width="54" height="54"/>
                            <%doc>
                            </%doc>
                        </a>
                        <div class="sponsor-tooltip">
                            <div class="tooltip-text">
                                <span>This project is sponsored by the<br/>
                                    Cold Spring Habor Laboratory</span>
                            </div>
                        </div>
                    </section>
                </section>
            </div>
        </div>
    </%block>
</div><!-- /.page-container -->
<script type="text/javascript">
    var cookie_closed = localStorage.getItem('cookie_policy_closed');
    if (cookie_closed != '1') {
        setTimeout(function() {
            $('.cookie-prompt').slideDown();
        }, 1500);
        $('#accept_cookie_policy').click(function() {
            localStorage.setItem('cookie_policy_closed', 1);
            $('.cookie-prompt').hide();        
        });
    }
</script>
<%doc>
    <section id="mk-footer">
        <div class="footer-wrapper mk-grid">
            <div class="mk-padding-wrapper">
                <div class="mk-col-1-5">
                    <section class="widget widget_text">
                        <div class="textwidget"><img src="${h.static('images/mb-footer-logo.png')}" alt=""></div>
                    </section>
                </div>
                <div class="mk-col-1-5">
                    <section class="widget widget_contact_info">
                        <div class="widgettitle">CONTACT</div>
                        <ul itemscope="" itemtype="http//schema.org/Person">
                            <li><i class="mk-moon-office"></i><span itemprop="jobTitle">Brain architecture project</span></li>
                            <li><i class="mk-icon-home"></i><span itemprop="address" itemscope="" itemtype="http://schema.org/PostalAddress">Cold Spring Harbor Lab</span></li>
                            <li><i class="mk-icon-phone"></i><span>1-800-brain-arch</span></li>
                            <li>
                                <i class="mk-icon-envelope-alt"></i>
                                <span><a itemprop="email" href="mailto:&#105;&#110;&#102;o&#64;&#98;r&#97;&#105;&#110;&#97;rc&#104;&#105;&#116;e&#99;&#116;ure&#46;&#111;&#114;&#103;">info&#64;b&#114;&#97;&#105;&#110;&#97;&#114;&#99;h&#105;te&#99;t&#117;&#114;&#101;.o&#114;&#103;</a></span>
                            </li>
                            <li>
                                <i class="mk-icon-globe"></i>
                                <span><a href="www.brainarchitecture.org">www.brainarchitecture.org</a></span>
                            </li>
                        </ul>
                    </section>
                </div>
                <div class="mk-col-1-5">
                    <section class="widget widget_nav_menu">
                        <div class="widgettitle">INTERNAL LINKS</div>
                        <div class="menu-footer-internal-links-container">
                            <ul id="menu-footer-internal-links" class="menu">
                                <li class="menu-item menu-item-type-custom menu-item-boject-custom"><a href="http://mouse.brainarchitecture.org">Mouse Brain Browser</a></li>
                                <li class="menu-item menu-item-type-custom menu-item-boject-custom"><a href="http://marmoset.brainarchitecture.org">Marmoset Brain Browser</a></li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </div>
        <div id="sub-footer">
            <div class="mk-grid">
                <span class="mk-footer-copyright">Copyright All Rights Reserved @ 2012</span>
            </div>
        </div>
    </section>
</div><!-- /#mk-boxed-layout -->
<a href="#" class="mk-go-top"><i class="mk-icon-chevron-up"></i></a>
<div class="mk-quick-contact-wrapper">
    <a href="#" class="mk-quick-contact-link"><i class="mk-icon-envelope"></i></a>
    <div id="mk-quick-contact">
        <div class="mk-quick-contact-title">Contact Us</div>
        <p>We're not around right now. But you can send us an email and we'll get back to you, asap.</p>
        <form class="mk-contact-form" method="post" novalidate="novalidate">
            <input type="text" placeholder="Your Name" required="required" id="contact_name" name="contact_name" class="text-input" value="" tabindex="987" />
            <input type="email" required="required" placeholder="Your Email" id="contact_email" name="contact_email" class="text-input" value="" tabindex="988"  />
            <textarea placeholder="Type your message..." required="required" id="contact_content" name="contact_content" class="textarea" tabindex="989"></textarea>
            <div class="btn-cont"><button type="submit" class="mk-contact-button shop-flat-btn shop-skin-btn" tabindex="990">Send</button></div>
            <i class="mk-contact-loading mk-moon-loop-4 mk-icon-spin"></i>
            <i class="mk-contact-success mk-icon-ok-sign"></i>
            <input type="hidden" value="parthaxmitra@gmail.com" name="contact_to"/>
        </form>
        <div class="bottom-arrow"></div>
    </div>
</div>
</%doc>
