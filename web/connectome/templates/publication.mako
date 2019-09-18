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
    <div class="row credit">
        <div class="col-sm-8 col-sm-offset-2">
            <dl class="dl-horizontal">
                <dt>Publications</dt> 
                <dd>
                    <ol class="publications">
                        <li><a href="http://www.ncbi.nlm.nih.gov/pubmed/27099164" target="_blank">Towards a comprehensive atlas of cortical connections in a primate brain: Mapping tracer injection studies of the common marmoset into a reference digital template.</a><br/>
                            <i>Majka P, Chaplin TA, Yu HH, Tolpygo A, Mitra PP, Wójcik DK, Rosa MG.</i><br/>
                            J Comp Neurol. 2016 Aug 1;524(11):2161-81. doi: <a href="https://doi.org/10.1002/cne.24023" target="_blank">10.1002/cne.24023.</a><br/>
                            PMID: 27099164 [PubMed - indexed for MEDLINE] <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4892968/" class="free-pmc" target="_blank">Free PMC Article</a>
                        </li>
                        <li><a href="https://www.ncbi.nlm.nih.gov/pubmed/25556940" target="_blank">Cortical and thalamic projections to cytoarchitectural areas 6Va and 8C of the marmoset monkey: connectionally distinct subdivisions of the lateral premotor cortex.</a><br/>
                            <i>Burman KJ, Bakola S, Richardson KE, Yu HH, Reser DH, Rosa MG.</i><br/>
                            J Comp Neurol. 2015 Jun 1;523(8):1222-47. doi: <a href="https://doi.org/10.1002/cne.23734" target="_blank">10.1002/cne.23734</a>. Epub 2015 Mar 10.<br/>
                            PMID: 25556940 [PubMed - indexed for MEDLINE]<br/>
                        </li>
                        <li><a href="http://www.ncbi.nlm.nih.gov/pubmed/25498953" target="_blank">The cortical motor system of the marmoset monkey (Callithrix jacchus).</a><br/>
                            <i>Bakola S, Burman KJ, Rosa MG.</i><br/>
                            Neurosci Res. 2015 Apr;93:72-81. doi: <a href="https://doi.org/10.1016/j.neures.2014.11.003" target="_blank">10.1016/j.neures.2014.11.003</a>. Epub 2014 Dec 10. Review.<br/>
                            PMID: 25498953 [PubMed - indexed for MEDLINE]<br/>
                        </li>
                        <li><a href="http://www.ncbi.nlm.nih.gov/pubmed/25152716" target="_blank">A simpler primate brain: the visual system of the marmoset monkey.</a><br/>
                            <i>Solomon SG, Rosa MG.</i><br/>
                            Front Neural Circuits. 2014 Aug 8;8:96. doi: <a href="https://doi.org/10.3389/fncir.2014.00096" target="_blank">10.3389/fncir.2014.00096</a>. eCollection 2014. Review.<br/>
                            PMID: 25152716 [PubMed - indexed for MEDLINE] <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4126041/" target="_blank">Free PMC Article</a><br/>
                        </li>
                        <li>
                            <a href="http://www.ncbi.nlm.nih.gov/pubmed/24888737" target="_blank">Patterns of afferent input to the caudal and rostral areas of the dorsal premotor cortex (6DC and 6DR) in the marmoset monkey.</a><br/>
                            <i>Burman KJ, Bakola S, Richardson KE, Reser DH, Rosa MG.</i><br/>
                            J Comp Neurol. 2014 Nov 1;522(16):3683-716. doi: <a href="https://doi.org/10.1002/cne.23633" target="_blank">10.1002/cne.23633</a>. Epub 2014 Jun 16.<br/>
                            PMID: 24888737 [PubMed - indexed for MEDLINE]
                        </li>
                        <li>
                            <a href="http://www.ncbi.nlm.nih.gov/pubmed/23939531" target="_blank">Patterns of cortical input to the primary motor area in the marmoset monkey.</a><br/>
                            <i>Burman KJ, Bakola S, Richardson KE, Reser DH, Rosa MG.</i><br/>
                            J Comp Neurol. 2014 Mar;522(4):811-43. doi: <a href="https://doi.org/10.1002/cne.23447" target="_blank">10.1002/cne.23447</a>.<br/>
                            PMID: 23939531 [PubMed - indexed for MEDLINE]
                        </li>
                        <li>
                            <a href="http://www.ncbi.nlm.nih.gov/pubmed/23774264" target="_blank">Panoptic neuroanatomy: digital microscopy of whole brains and brain-wide circuit mapping.</a><br/>
                            <i>Mitra PP, Rosa MG, Karten HJ.</i><br/>
                            Brain Behav Evol. 2013;81(4):203-5. doi: <a href="https://doi.org/10.1159/000350241" target="_blank">10.1159/000350241</a>. Epub 2013 Jun 14. No abstract available.<br/>
                            PMID: 23774264 [PubMed - indexed for MEDLINE] <a href="https://www.karger.com/Article/FullText/350241" target="_blank">Free Article</a>
                        </li>
                        <li>
                            <a href="http://www.ncbi.nlm.nih.gov/pubmed/22735155" target="_blank">Contrasting patterns of cortical input to architectural subdivisions of the area 8 complex: a retrograde tracing study in marmoset monkeys.</a><br/>
                            <i>Reser DH, Burman KJ, Yu HH, Chaplin TA, Richardson KE, Worthy KH, Rosa MG.</i><br/>
                            Cereb Cortex. 2013 Aug;23(8):1901-22. doi: <a href="https://doi.org/10.1093/cercor/bhs177" target="_blank">10.1093/cercor/bhs177</a>. Epub 2012 Jun 26.<br/>
                            PMID: 22735155 [PubMed - indexed for MEDLINE] <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3698368/" target="_blank">Free PMC Article</a>
                        </li>
                        <li>
                            <a href="http://www.ncbi.nlm.nih.gov/pubmed/21139076" target="_blank">Cortical input to the frontal pole of the marmoset monkey.</a><br/>
                            <i>Burman KJ, Reser DH, Yu HH, Rosa MG.</i><br/>
                            Cereb Cortex. 2011 Aug;21(8):1712-37. doi: <a href="https://doi.org/10.1093/cercor/bhq239" target="_blank">10.1093/cercor/bhq239</a>. Epub 2010 Dec 7.<br/>
                            PMID: 21139076 [PubMed - indexed for MEDLINE]
                        </li>
                        <li>
                            <a href="http://www.ncbi.nlm.nih.gov/pubmed/19663937" target="_blank">Connections of the marmoset rostrotemporal auditory area: express pathways for analysis of affective content in hearing.</a><br/>
                            <i>Reser DH, Burman KJ, Richardson KE, Spitzer MW, Rosa MG.</i><br/>
                            Eur J Neurosci. 2009 Aug;30(4):578-92. doi: <a href="https://doi.org/10.1111/j.1460-9568.2009.06846.x" target="_blank">10.1111/j.1460-9568.2009.06846.x</a>. Epub 2009 Aug 3.<br/>
                            PMID: 19663937 [PubMed - indexed for MEDLINE]
                        </li>
                        <li>
                            <a href="http://www.ncbi.nlm.nih.gov/pubmed/19357280" target="_blank">Connections of the dorsomedial visual area: pathways for early integration of dorsal and ventral streams in extrastriate cortex.</a><br/>
                            <i>Rosa MG, Palmer SM, Gamberini M, Burman KJ, Yu HH, Reser DH, Bourne JA, Tweedale R, Galletti C.</i><br/>
                            J Neurosci. 2009 Apr 8;29(14):4548-63. doi: <a href="https://doi.org/10.1523/JNEUROSCI.0529-09.2009" target="_blank">10.1523/JNEUROSCI.0529-09.2009</a>.<br/>
                            PMID: 19357280 [PubMed - indexed for MEDLINE] <a href="http://www.jneurosci.org/content/29/14/4548" target="_blank">Free Article</a>
                        </li>
                        <li>
                            <a href="http://www.ncbi.nlm.nih.gov/pubmed/19260047" target="_blank">Architectural subdivisions of medial and orbital frontal cortices in the marmoset monkey (Callithrix jacchus)</a><br/>
                            <i>Burman KJ, Rosa MG.</i><br/>
                            J Comp Neurol. 2009 May 1;514(1):11-29. doi: <a href="https://doi.org/10.1002/cne.21976" target="_blank">10.1002/cne.21976</a>.<br/>
                            PMID: 19260047 [PubMed - indexed for MEDLINE]<br/>
                        </li>
                        <li>
                            <a href="http://www.ncbi.nlm.nih.gov/pubmed/17042793" target="_blank">A distinct anatomical network of cortical areas for analysis of motion in far peripheral vision.</a><br/>
                            <i>Palmer SM, Rosa MG.</i><br/>
                            Eur J Neurosci. 2006 Oct;24(8):2389-405. Epub 2006 Oct 17.<br/>
                            PMID: 17042793 [PubMed - indexed for MEDLINE]
                        </li>
                        <li>
                            <a href="http://www.ncbi.nlm.nih.gov/pubmed/16435289" target="_blank">Cytoarchitectonic subdivisions of the dorsolateral frontal cortex of the marmoset monkey (Callithrix jacchus), and their projections to dorsal visual areas.</a><br/>
                            <i>Burman KJ, Palmer SM, Gamberini M, Rosa MG.</i><br/>
                            J Comp Neurol. 2006 Mar 10;495(2):149-72.<br/>
                            PMID: 16435289 [PubMed - indexed for MEDLINE]
                            Similar articles
                        </li>
                        <li>
                            <a href="http://www.ncbi.nlm.nih.gov/pubmed/16292001" target="_blank">Quantitative analysis of the corticocortical projections to the middle temporal area in the marmoset monkey: evolutionary and functional implications.</a><br/>
                            <i>Palmer SM, Rosa MG.</i><br/>
                            Cereb Cortex. 2006 Sep;16(9):1361-75. Epub 2005 Nov 16.<br/>
                            PMID: 16292001 [PubMed - indexed for MEDLINE]
                        </li>
                        <li>
                            <a href="http://www.ncbi.nlm.nih.gov/pubmed/15678474" target="_blank">Resolving the organization of the New World monkey third visual complex: the dorsal extrastriate cortex of the marmoset (Callithrix jacchus).</a><br/>
                            <i>Rosa MG, Palmer SM, Gamberini M, Tweedale R, Piñon MC, Bourne JA.</i><br/>
                            J Comp Neurol. 2005 Mar 7;483(2):164-91.<br/>
                            PMID: 15678474 [PubMed - indexed for MEDLINE]
                        </li>
                    </ol>
                </dd>
            </dl>
        </div>
    </div>
    
</div><!-- /.container -->

