<%inherit file='page.mako'/>
<%block name='scripts'>
##<script type="text/javascript" src="${h.static('scripts/jquery.event.drag-2.2.js')}"></script>
##<script type="text/javascript" src="${h.static('scripts/jquery-ui.min.js')}"></script>
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
    <div class="row credit">
        <div class="col-sm-8 col-sm-offset-2">
            <dl class="dl-horizontal">
                <dt>License</dt>
                <dd>Material made public on the Marmoset Brain Connectivity Atlas is licensed under a <a href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 (CC-BY-SA)</a> License. You are free to share (copy and redistribute) and adapt (remix, transform, and build upon) the marmoset-related material in any medium or format as long as you attribute the Marmoset Brain Connectivity Atlas and provide a link to the two URLs the Marmoset Brain Connectivity Atlas and the CC license). If you adapt the material, you must distribute your contributions under the same license as the original.</dd>

                <dt>How to cite</dt> 
                <dd>
                    <div>Majka, P., Chaplin, T. A., Yu, H.-H., Tolpygo, A., Mitra, P. P., Wójcik, D. K., &amp; Rosa, M. G. P. (2016). <i>Towards a comprehensive atlas of cortical connections in a primate brain: Mapping tracer injection studies of the common marmoset into a reference digital template.</i> Journal of Comparative Neurology, 524(11), 2161–2181. <a href="http://doi.org/10.1002/cne.24023">http://doi.org/10.1002/cne.24023</a>
                    </div>
                </dd>

                <dt>Contributors</dt> 
                <dd class="">
                    <div class="row">
                        <div class="col-md-12">
                            The Marmoset Brain Connectivity Atlas Project is conducted by researches from the <a href="http://www.med.monash.edu.au/physiology/staff/rosa.html" target="_blank">Marcello Rosa's lab</a> at the <a href="https://www.monash.edu/" target="_blank">Monash University</a>, and the <a href="https://neuroinflab.wordpress.com/" target="_blank">Laboratory of Neuroinformatics</a>, at the <a href="http://www.nencki.gov.pl/" target="_blank">Nencki institute of Experimental Biology</a>.
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <h4>Principal Investigators:</h4>
                            <ul class="collaborator-list">
                                <li>Prof. Marcello Rosa (Monash University)</li>
                                <li>Dr. Piotr Majka (Nencki Institute)</li>
                            </ul>
                            <h4>Collaborating Investigators:</h4>
                            <ul class="collaborator-list">
                                <li>Dr. Nafiseh Atapour <span class="tip">Dr. Nafiseh Atapour, Monash University</span></li>
                                <li>Dr. Sophia Bakola <span class="tip">Dr. Sophia Bakola, Monash University</span></li>
                                <li>Dr. Kathleen Burman <span class="tip">Dr. Kathleen Burman, Monash University</span></li>
                                <li>Dr. Michela Gamberini <span class="tip">Dr. Michela Gamberini, Univeristy of Bologna</span></li>
                                <li>Prof. Partha Mitra <span class="tip">Prof. Partha Mitra, Cold Spring Harbor Laboratory</span></li>
                                <li>Dr. Lauretta Passarelli <span class="tip">Dr. Lauretta Passarelli, Univeristy of Bologna</span></li>
                                <li>Dr. David Reser <span class="tip">Dr. David Reser, Monash University</span></li>
                                <li>Prof. Daniel Wójcik <span class="tip">Prof. Daniel Wójcik, Nencki Institute</span></li>
                            </ul>
                            <h4>Collaborating Students:</h4>
                            <ul class="collaborator-list">
                                <li>Lorenzo Canalini <span class="tip">Lorenzo Canalini, Univeristy of Bologna</span></li>
                                <li>Daniele Impieri <span class="tip">Daniele Impieri, Univeristy of Bologna</span></li>
                                <li>Shakira Snell <span class="tip">Shakira Snell, Monash University</span></li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <h4>IT infrastructure <br/>and web development:</h4>
                            <ul class="collaborator-list">
                                <li>Shi Bai <span class="tip">Shi Bai, Monash University</span></li>
                            </ul>

                            <h4>Technical and assistant personnel:</h4>
                            <ul class="collaborator-list">
                                <li>Johnathan Chan <span class="tip">Johnathan Chan, Monash University</span></li>
                                <li>Dr. Ianina Hutler Wolkowicz <span class="tip">Dr. Ianina Hutler Wolkowicz, Monash University</span></li>
                                <li>Natalia Jermakow <span class="tip">Natalia Jermakow, Nencki Institute of Experimental Biology</span></li>
                                <li>Daria Malamanova <span class="tip">Daria Malamanova, Monash University</span></li>
                                <li>Karyn Richardson <span class="tip">Karyn Richardson, Monash University</span></li>
                                <li>Katrina Worthy <span class="tip">Katrina Worthy, Monash University<span></li>
                                <li>Sherry Zhao <span class="tip">Sherry Zhao, Monash University</li>
                            </ul>  
                        </div>
                    </div>
                </dd>

                <dt>Other publications</dt> 
                <dd>A list of publications, which is related to the project, can be found <a href="${h.route('publication')}">here</a>.
                </dd> 
            </dl>
        </div>
    </div>

</div><!-- /.container -->
