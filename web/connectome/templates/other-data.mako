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

<div class="container page-body">
    <div class="row introduce-banner">
        <div class="col-md-12 marmoset-introduce">
            ##<img src="${h.static('images/hp-icons-marmoset.png')}" width="58" height="58">
            <h1>Marmoset Brain Connectivity Atlas</h1>
        </div>
    </div>
    <div class="row reference">
        <div class="col-sm-10 col-sm-offset-1">
            <h4>Other data</h4>
            <ul>
                <li class="reference-list">
                    <h5><a href="http://d13rgn2ixumcch.cloudfront.net/reference/marmoset_brain_template.zip">Volumetric digital common marmoset brain template (zip 9.6 Mb)</a></h5>
                    <i>This package contains volumetric representation of the cortical structures from The Marmoset Brain in Stereotactic Coordinates atlas (Paxinos et al., 2012). More details can be found in the <a href="http://d13rgn2ixumcch.cloudfront.net/reference/marmoset_brain_template_readme.txt">readme file.</a></i>
                </li>
            </ul>
        </div>
    </div>
    
</div><!-- /.container -->
