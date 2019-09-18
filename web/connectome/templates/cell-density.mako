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
    <div class="row cell-density">
        <div class="col-sm-12">
            <h4>&nbsp;</h4>
			<div class="col-sm-10 col-sm-offset-1">
				<h5>Supplementary material</h5>
				The web page <a href="http://www.marmosetbrain.org/cell_density">http://www.marmosetbrain.org/cell_density</a> contains the most recent versions of the supplementary materials for the article:

				<h3>Neuronal density across the entire cerebral cortex of the marmoset monkey</h3>
                <div class="author">Nafiseh Atapour, Piotr Majka, Ianina H. Wolkowicz, Daria Malamanova, Katrina H. Worthy and Marcello G.P. Rosa</div>

				<h5>Abstract</h5>
                <p>Using stereological analysis of NeuN-stained sections, we investigated neuronal density in 116 cytoarchitectural areas of the marmoset cortex. Our results revealed that estimates of average neuronal density encompassed a greater than threefold range, from a maximum (&gt;150,000 neurons/ mm3) in the primary visual cortex to a minimum (~50,000 neurons/ mm3) in the piriform complex. In agreement with previous studies, there was a trend for density values to decrease from posterior to anterior cortical areas, but we also observed significant local gradients, which added complexity to this pattern. For example, in the frontal lobe, neuronal density was lowest among motor and premotor areas, and increased towards the frontal pole. Likewise, in both auditory cortex and somatosensory areas, it increased from caudal to rostral subdivisions. In general, anterior cingulate, insular and ventral temporal proisocortical and periallocortical areas were characterized by low neuronal densities. Analysis across the thickness of the cortex revealed greater laminar variation in occipital, parietal and inferior temporal areas, in comparison with other regions. These results are compatible with a common pattern of variation in neuronal density among primates, and suggest that neuronal density values in the adult cortex result from a complex interaction of developmental/evolutionary determinants and functional requirements.</p>

			</div>
        </div>
        <%include file='density_incl.mako'/>
    <div class="row reference">
        <div class="col-sm-10 col-sm-offset-1">
            <h4>Cell Density Image Download</h4>
            <%include file='density_incl.mako'/>
        </div>
    </div>
    
</div><!-- /.container -->
