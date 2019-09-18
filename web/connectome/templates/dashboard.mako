<%inherit file='page.mako'/>
<%block name='scripts'>
<script type="text/javascript">
    window.app = {};
    function source_tracer_list() {
        return ${tracer_list | n};
    }
    function source_section_list() {
        ##return ${section_list | n};
    }
    function source_region_list() {
        return ${region_list | n};
    }
    app.allow_admin = ${h.allow_admin};
</script>
##<script type="text/javascript" src="${h.static('scripts/jquery.event.drag-2.2.js')}"></script>
##<script type="text/javascript" src="${h.static('scripts/jquery-ui.min.js')}"></script>
<script type="text/javascript" src="${h.static('scripts/combodate.js')}"></script>
<script type="text/javascript" src="${h.static('scripts/dashboard.js')}"></script>
</%block>
<%block name='styles'>
<link rel='stylesheet' href="${h.static('css/slick.grid.css')}" type='text/css' media='all' />
<link rel='stylesheet' href="${h.static('css/slick-default-theme.css')}" type='text/css' media='all' />
<link rel='stylesheet' href="${h.static('css/tip-yellow.css')}" type='text/css' media='all' />
<link rel='stylesheet' href="${h.static('css/jquery-editable.css')}" type='text/css' media='all' />
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
        <main class="col-sm-12">
            <div id="messages"></div>
            <h4>Dashboard</h4>
            <input id="tab1" type="radio" name="tabs" class="nav-tabs" checked>
            <label class="nav-tabs" for="tab1">Marmoset</label>

            <input id="tab2" type="radio" name="tabs" class="nav-tabs">
            <label class="nav-tabs" for="tab2">Injection</label>
            
            <a href="http://piwik.mrosa.org" target="_blank"><label class="nav-tabs" for="tab3">Visitor Tracking</label></a>

            <section id="section-marmoset">
                <table class="table">
                    <tr>
                        <th>Case ID</th>
                        <th>Display Name</th>
                        <th>Sex</th>
                        <th>Date of Birth</th>
                        <th>Date of Injection</th>
                        <th>Date of Perfusion</th>
                        <th>Body Weight</th>
                        <th>Hemisphere</th>
                        <th>Survival Days</th>
                        <th>Other Info</th>
                    </tr>
                    %for m in marmosets:
                        <tr>
                            <td>${m.case_id}</td>
                            <td><a href="#" class="editable display_name"
                                    data-name="display_name" data-type="text"
                                    data-pk="${m.id}"
                                    data-title="Enter display name">${m.display_name}</a></td>
                            <td><a href="#" class="editable sex"
                                    data-name="sex" data-type="select"
                                    data-source='[{"value": "M", "text": "M"}, {"value": "F", "text": "F"}]'
                                    data-pk="${m.id}" data-value="${m.sex}"
                                    data-title="Select sex">${m.sex}</a></td>
                            <td><a href="#" class="editable dob"
                                    data-name="dob" data-name="dob" data-type="combodate"
                                    data-pk="${m.id}"
                                    data-title="Enter date of birth">${m.dob}</a></td>
                            <td><a href="#" class="editable injection-date"
                                    data-name="injection_date" data-type="combodate"
                                    data-pk="${m.id}"
                                    data-title="Enter date of injection">${m.injection_date}</a></td>
                            <td><a href="#" class="editable perfusion-date"
                                    data-name="perfusion_date" data-type="combodate"
                                    data-pk="${m.id}"
                                    data-title="Enter date of perfusion">${m.perfusion_date}</a></td>
                            <td><a href="#" class="editable user-name"
                                    data-name="body_weight" data-type="text"
                                    data-pk="${m.id}"
                                    data-title="Enter body weight">${m.body_weight}</a></td>
                            <td><a href="#" class="editable hemisphere"
                                    data-name="hemisphere" data-type="select"
                                    data-source='[{"value": "L", "text": "L"}, {"value": "R", "text": "R"}]'
                                    data-pk="${m.id}" data-value="${m.hemisphere}"
                                    data-title="Select hemisphere">${m.hemisphere}</a></td>
                            <td><a href="#" class="editable survival-days"
                                    data-name="survival_days" data-type="text"
                                    data-pk="${m.id}"
                                    data-title="Enter survival time">${m.survival_days}</a></td>

                            <td><a href="#" class="editable other-info"
                                    data-name="other_info" data-type="textarea"
                                    data-pk="${m.id}"
                                    data-title="Enter other info">${m.other_info}</a></td>
                        </tr>
                    %endfor
                </table>
            </section>
            <section id="section-injection">
                <table class="table">
                    <tr>
                        <th>Case ID</th>
                        <th>Tracer</th>
                        <th>Region</th>
                        <th>Hemisphere</th>
                        <th>A</th>
                        <th>L</th>
                        <th>H</th>
                        <th>Injection Site</th>
                        <th>Memo</th>
                        <th>Show</th>
                    </tr>
                    %for inj in injections:
                        <tr>
                            <td>${inj.marmoset.case_id}</td>
                            ##<td><a href="#" class="editable tracer" data-name="tracer_id" data-type="select" data-value="${inj.tracer_id}" data-pk="${inj.id}" data-title="Select tracer"></a></td>
                            <td>${inj.tracer.code}</td>
                            <td><a href="#" class="region"
                                    data-name="region_id" data-type="select2"
                                    data-value="${inj.region_id}" data-pk="${inj.id}"
                                    data-title="Select region"></a></td>
                            <td><a href="#" class="editable hemisphere"
                                    data-name="hemisphere" data-type="select"
                                    data-source='[{"value": "L", "text": "L"}, {"value": "R", "text": "R"}]'
                                    data-pk="${inj.id}" data-value="${inj.hemisphere}"
                                    data-title="Select hemisphere">${inj.hemisphere}</a></td>
                            <td><a href="#" class="editable atlas_a"
                                    data-name="atlas_a" data-type="text"
                                    data-pk="${inj.id}" data-title="Enter atlas A">${inj.atlas_a}</a></td>
                            <td><a href="#" class="editable atlas_l"
                                    data-name="atlas_l" data-type="text"
                                    data-pk="${inj.id}" data-title="Enter atlas L">${inj.atlas_l}</a></td>
                            <td><a href="#" class="editable atlas_h"
                                    data-name="atlas_h" data-type="text"
                                    data-pk="${inj.id}"
                                    data-title="Enter atlas H">${inj.atlas_h}</a></td>
                            <td><a href="#" class="section"
                                    data-name="section_id" data-type="select"
                                    data-value="${inj.section_id}" data-pk="${inj.id}"
                                    data-source="/api/section/list?marmoset_id=${inj.marmoset.id}"
                                    data-title="Select injection site section"></a></td>
                            <td><a href="#" class="section"
                                    data-name="memo" data-type="textarea"
                                    data-value="${inj.memo}" data-pk="${inj.id}"
                                    data-source="/api/section/list?marmoset_id=${inj.marmoset.id}"
                                    data-title="Memo"></a></td>
                            <td>
                                <div class="onoffswitch">
                                    <input type="checkbox" name="status"
                                        class="onoffswitch-checkbox" id="onoffswitch-inj-${inj.id}"
                                        data-pk="${inj.id}" ${' checked' if inj.status=='Active' else ''} />
                                    <label class="onoffswitch-label" for="onoffswitch-inj-${inj.id}">
                                        <span class="onoffswitch-inner"></span>
                                        <span class="onoffswitch-switch"></span>
                                    </label>
                                </div>
                                ##<div class="radio-container" style="width: 60px;">
                                ##    <input type="checkbox" class="ios-toggle" name="test" id="enable-${inj.id}" value="Active"${' checked' if inj.status=='Active' else ''} />
                                ##    <label for="enable-${inj.id}" class="checkbox-label" data-off="off" data-on="on"></label>
                                ##</div>
                            </td>
                        </tr>
                    %endfor
                </table>


            </section>
        </main>
    </div><!-- /.row.reference -->
</div><!-- /.container -->
