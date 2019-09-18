<%inherit file='page.mako'/>
<%block name='scripts'>
<script type="text/javascript" src="${h.static('scripts/jquery.event.drag-2.2.js')}"></script>
<script type="text/javascript" src="${h.static('scripts/jquery-ui.min.js')}"></script>
</%block>
<%block name='styles'>
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
            <h4>Reference Material Download</h4>
            <ul>
                <li class="reference-list">
                    <h5><a href="http://r.marmosetbrain.org/Atlas+Small.pdf" target="_blank">Stereotaxic atlas of the marmoset brain (pdf 61.4 MB)</a></h5>
                    <i>Full pdf of the book “The Marmoset Brain in Stereotaxic Coordinates” by Paxinos, Watson, Petrides, Rosa and Tokuno (Academic Press, 2012)</i>
                </li>
                <li>
                    <h5><a href="http://r.marmosetbrain.org/2016_Majka_marmoset+template.pdf" target="_blank">Procedure for registration of different cases to marmoset brain template (pdf 11.6 MB)</a></h5>
                    <i>"Toolbox" paper by Majka, Chaplin, Yu, Tolpygo, Mitra, Wojcik and Rosa (J Comp Neurol 524: 2161-2181, 2016)</i>
                </li>
                <li>
                    <h5><a href="http://r.marmosetbrain.org/NisslStain.pdf" target="_blank">Protocol for Nissl staining of marmoset brain sections (pdf 84KB)</a></h5>
                </li>
                <li>
                    <h5><a href="http://r.marmosetbrain.org/CytochromeOxidase.pdf" target="_blank">Protocol for cytochrome oxidase staining of marmoset brain sections (pdf 100KB)</a></h5>
                </li>
                <li>
                    <h5><a href="http://r.marmosetbrain.org/Gallyasmethod.pdf" target="_blank">Protocol for Gallyas silver stain for myelin (pdf 102KB)</a></h5>
                </li>
            </ul>
        </div>
    </div>
    <div class="row reference">
        <div class="col-sm-10 col-sm-offset-1">
            <h4>Other data</h4>
            <ul>
                <li class="reference-list">
                    <h5><a href="http://r.marmosetbrain.org/marmoset_brain_template.zip">Volumetric digital common marmoset brain template (zip 9.6 Mb)</a></h5>
                    <i>This package contains volumetric representation of the cortical structures from The Marmoset Brain in Stereotactic Coordinates atlas (Paxinos et al., 2012). More details can be found in the <a href="http://r.marmosetbrain.org/marmoset_brain_template_readme.txt">readme file.</a></i>
                </li>
                <li class="">
                    <h5><a href="${h.route('cell_density')}">Neuronal density across the entire cerebral cortex of the marmoset monkey</a></h5>
                </li>
            </ul>
        </div>
    </div>
    
</div><!-- /.container -->
