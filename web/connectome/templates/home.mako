<%inherit file='page.mako'/>
<%block name='scripts'>
<script type="text/javascript" src="${h.static('scripts/jquery.event.drag-2.2.js')}"></script>
<script type="text/javascript" src="${h.static('scripts/jquery-ui.min.js')}"></script>
</%block>
<%block name='styles'>
<link rel='stylesheet' href="${h.static('css/slick.grid.css')}" type='text/css' media='all' />
<link rel='stylesheet' href="${h.static('css/slick-default-theme.css')}" type='text/css' media='all' />
<link rel='stylesheet' href="${h.static('css/viewer.css')}" type='text/css' media='all' />
</%block>
<%block name='body_scripts'>
$(function() {
    $('.marmoset-introduce h6').on('mouseenter', function() {
        $('.marmoset-introduce h6').removeClass('transparent');
    }).on('mouseleave', function() {
        $('.marmoset-introduce h6').addClass('transparent');
    });
});
</%block>
<div class="container page-body">
    <div class="row introduce-banner">
        <div class="col-md-12 marmoset-introduce">
            ##<img src="${h.static('images/hp-icons-marmoset.png')}" width="58" height="58">
            <h1>Marmoset Brain Connectivity Atlas</h1>
            <a href="${request.route_url('login')}"><h6 class="administrator-access transparent"><img src="${h.static('images/p_tint.svg')}" height="48" title="Administrator Login..."/></h6></a>
        </div>
    </div>
    <div class="row splash-intro">
        <div class="col-md-6">
            <div class="mac-bg">
                <video width="333" height="215" autoplay id="splash-video" loop>
                  <source src="${h.static('images/splash_video.mp4')}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                ##<img src="${h.static('images/macbook.png')}" width="480" height="326">
            </div>
            <div class="nav-button">
                <a href="${request.route_url('injection.search')}"><button>View Injections</button></a>
            </div>
        </div>
        <div class="col-md-6 about">
            <div class="caption">About The Marmoset Brain Connectivity Atlas</div>
            <p>The marmoset brain connectivity atlas's immediate aim is to create a systematic, publicly available digital repository for data on the connections between different cortical areas, in a primate species.</p>
            <p>This initial stage takes advantage of a large collection of materials obtained over two decades of research, using fluorescent retrograde tracer injections in adult marmosets (Callithrix jacchus). Whereas several research papers have already stemmed from this material (e.g. Rosa et al. 2009; Burman et al. 2011; Reser et al. 2013; Burman et al. 2014, 2015; Majka et al. 2019), the present project represents a new initiative, towards collating these data and making them publicly available, in their entirety.</p>
            <p>We believe that sharing these materials via a digital interface will address many of the current limitations of the traditional media used for communication of neuroanatomical research, including allowing access to the entire data set (as opposed to the few sections typically illustrated in journal articles), and enabling other interpretations of the data, in light of the future evolution of knowledge about the marmoset cortex.</p>
            <p>Among other positive consequences, we hope that the availability of raw data, which can be analysed independently in different contexts, will reduce the number of animals that need to be used for research on the organization of the primate nervous systems. <a href="${request.route_url('whitepaper')}">[Read More...]</a></p>
        </div>
    </div>
    </div>
</div><!-- /.container -->
