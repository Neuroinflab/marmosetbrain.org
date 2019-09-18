<%inherit file='page.mako'/>
<%block name='scripts'>
<script type="text/javascript" src="${h.static('scripts/jssor.slider.mini.js')}"></script>
<script type="text/javascript" src="${h.static('scripts/marmoset.js')}"></script>
</%block>
<div class="row">
    <div class="sub-header">
        <div class="main-banner-wrapper">
            <div class="carousel" id="main-slider">
                <div class="slides" u="slides">
                        <div u="loading" style="position: absolute; top: 0px; left: 0px;">
                            <div style="filter: alpha(opacity=70); opacity:0.7; position: absolute; display: block;
                                background-color: #000000; top: 0px; left: 0px;width: 100%;height:100%;">
                            </div>
                            <div style="position: absolute; display: block; background: url(../static/images/loading.gif) no-repeat center center;
                                top: 0px; left: 0px;width: 100%;height:100%;">
                            </div>
                        </div>
                        <div>
                            <img u="image" src="${h.static('images/HomepageTopBackground.png')}" alt="Slide background" />
                            <img u="caption" class="caption" style="position: absolute; top: 70px; left: 348px; width: 200px; white-space: nowrap;" src="${h.static('images/homepage-rotator-3d-heirarchy.png')}" alt="3D Heirarchy">
                            <img u="caption" class="caption" style="position: absolute; top: 68px; left: 56px; width: 200px; white-space: nowrap;" src="${h.static('images/homepage-rotator-3d-rotator.png')}" alt="3D Rotator">
                            <a class="caption" href="http://mouse.brainarchitecture.org/seriesbrowser/injections/new/" target="_self" style="top:28px;left:445px;">
                                <img style="width:100px;white-space: nowrap;" src="${h.static('images/seemore.png')}">
                            </a>
                            <img class="caption" style="top:0px;left:0px;width:300px;white-space: nowrap;" src="${h.static('images/connectivity.png')}" alt="">
                        </div>
                        <div>
                            <img u="image" src="${h.static('images/Slide2Background.png')}" alt="3D Heirarchy" />
                            <img class="caption" u="caption" style="top:0px;left:330px;width:254px;white-space: nowrap;" src2="${h.static('images/Human.png')}" alt="">
                            <img class="caption" u="caption" style="top:30px;left:0px;width:260px;white-space: nowrap;" src2="${h.static('images/HBA2.png')}" alt="">
                            <a class="caption" u="caption" href="http://www.brainarchitecture.org/human-brain" target="_self" class="ls-l" style="top:145px;left:31px;">
                                <img style="width:120px;white-space: nowrap;" src="${h.static('images/seemore.png')}">
                            </a>
                        </div>
                        <div>
                            <img u="image" src="${h.static('images/slide3.png')}" alt="3D Heirarchy" />
                            <img class="caption" style="top:0px;left:18px;width:260px;white-space: nowrap;" src="${h.static('images/TextMining2.png')}" alt="">
                            <a class="caption" href="http://mouse.brainarchitecture.org/webapps/neuro_nlp/" target="_self" style="top:100px;left:338px;" alt="">
                                <img style="width:120px;white-space: nowrap;" src="${h.static('images/seemore.png')}">
                            </a>
                        </div>
                        <div>
                            <img u="image" src="${h.static('images/background.jpg')}" alt="3D Heirarchy" />
                            <a class="caption" href="http://www.brainarchitecture.org/other-species-2" target="_self" class="ls-l" style="top:0px;left:0px;" alt="">
                                <img style="width:600px;white-space: nowrap;" src="${h.static('images/homepage-rotator-otherspecieswords.png')}">
                            </a>
                        </div>
                        <!-- Bullet Navigator -->
                        <div data-u="navigator" class="jssorb05" style="bottom:16px;right:6px;" data-autocenter="1">
                            <!-- bullet navigator item prototype -->
                            <div data-u="prototype" style="width:16px;height:16px;"></div>
                        </div>
                </div>
            </div>
        </div>

<%doc>

                        <%doc>
                        <a href="http://marmoset.brainarchitecture.org/seriesbrowser/injections/new/" target="_self" class="ls-l" style="top:28px; left: 445px;" alt="">
                            <img style="width: 100px; white-space: nowrap;" src="${h.static('images/blank.gif')}" data-src="${h.static('images/seemore.png')}">
                        </a>
                        <img class="ls-l" style="top: 0px; left: 0px; width: 300px; white-space: nowrap;" src="${h.static('images/blank.gif')}" data-src="${h.static('images/connectivity.png')}">
                    </div><!-- /.ls-slide -->
                    <div class="ls-slide" data-ls="translation2d: all;">
                        <img src="${h.static('images/blank.gif')}" data-src="${h.static('images/Slide2Blackground.png')}" class="lg-bg" alt="Slide background">
                        <img class="ls-l" style="top:0px;left:330px;width:254px;white-space: nowrap;" src="${h.static('images/blank.gif')}" data-src="${h.static('images/Human.png')}" alt="">
                        <img class="ls-l" style="top:30px; left: 0px; width: 260px; white-space: nowrap;" src="${h.static('images/blank.gif')}" data-src="${h.static('images/HBA2.png')}" alt="">
                        <a href="http://www.brainarchitecture.org/human-brain" target="_self" class="ls-l" style="top: 145px; left: 31px;">
                            <img style="width: 120px; white-space: nowrap;" src="${h.static('images/blank.gif')}" data-src="${h.static('images/seemore.png')}">
                        </a>
                    </div><!-- /.ls-slide -->
</%doc>
    </div>
    <div class="sub-header">
        <h2>Our Projects</h2>
        <div class="row project-list">
            <div class="col-md-3 project-item">
                <a href="http://mouse.brainarchitecture.org" target="_self">
                    <img class="" alt="Mouse" title="Mouse" src="${h.static('images/hp-icons-mouse1.png')}" />
                </a>
                <div class="image-caption">
                    <span class="caption-title">Mouse</span>
                    <span class="caption-desc">Mouse brain architecture project</span>
                </div>
            </div><!-- /.project-item -->
            <div class="col-md-3 project-item">
                <a href="/human-brain" target="_self" class="mk-image-shortcode-link">
                    <img class="lightbox-false" alt="Human" title="Human" src="${h.static('images/hp-icons-brain1.png')}" />
                </a>
                <div class="image-caption">
                    <span class="caption-title">Human</span>
                    <span class="caption-desc">Human brain architecture project</span>
                </div>
            </div><!-- /.project-item -->
        </div><!-- /.row-->
    </div><!-- /.sub-header -->
    <div class="sub-header">
        <h2>Our Sponsors</h2>
        <div class="sponsor-list"> 
            <img class="" src="${h.static('images/nsfrightsize2.png')}" alt="NSF" width="140" height="140" />
            <img class="" style="margin-left: 50px; margin-right: 50px;" src="${h.static('images/nindrightsize2.png')}" alt="NIND" width="170" height="94" />
            <img class="" src="${h.static('images/simmons.png')}" alt="Simons Fundation" width="167" height="107" />
            <img class="" src="${h.static('images/mathers.png')}" alt="Mathers Fundation" width="167" height="107" ?><br>
            <img class="" src="${h.static('images/keck.png')}" alt="W.M. Keck Fundation" width="167" height="107" />
            <img class="" style="margin-left: 20px; margin-right: 20px;" src="${h.static('images/csh.png')}" alt="CSHL" width="167" height="107" />
            <img class="" style="margin-left: 20px; margin-right: 20px;" src="${h.static('images/nida.png')}" alt="NIDA" width="167" height="107" />
            <img class="" style="margin-left: 20px; margin-right: 20px;" src="${h.static('images/nimh.png')}" alt="NIMH" width="167" height="107" />
            <img class="" style="margin-left: 20px; margin-right: 20px;" src="${h.static('images/arc.png')}" alt="ARC" width="167" height="107" />
        </div><!-- /.mk-text-block -->
    </div><!-- /.sub-header -->
    <div class="sub-header contact-wrap">
        <div class="row">
            <div class="align-center">
                <a href="/contact-2">
                    <img class="floating-vertical" width="65" height="69" alt="Mail" title="Mail" src="${h.static('images/mail.png')}" />
                </a>
            </div>
        </div>
        <div class="row">
            <div class="contact-title">
                <span style="padding: 0 8px;">Say Hello!</span>
            </h2>
        </div>
        <div class="row">
            <div class="contact-desc">
                <span style="padding: 0 8px;">We would love to hear from you. Let&#8217;s have a talk</span>
            </h2>
        </div>
    </div>

</div><!-- /.row -->
