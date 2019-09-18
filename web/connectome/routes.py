def includeme(config):
    config.add_view('.views.views.cookie_policy', route_name='cookie_policy', renderer='cookie-policy.mako')
    config.add_view('.views.views.cell_density', route_name='cell_density', renderer='cell-density.mako')
    config.add_view('.views.api.injection_site', route_name='api.injection_site', renderer='json')
    config.add_view('.views.api.riken_region', route_name='api.riken.region', renderer='json')
    config.add_view('.views.api.riken_injection_region_meta', route_name='api.riken.injection_region_meta', renderer='json')
    config.add_view('.views.api.new_border1', route_name='api.new_border1', renderer='json')
    config.add_view('.views.api.new_border2', route_name='api.new_border2', renderer='json')
    config.add_view('.views.api.new_border3', route_name='api.new_border3', renderer='json')
    config.add_route('home', '/')
    config.add_route('marmoset', 'marmoset')
    config.add_route('about', 'about')
    config.add_route('publication', 'publication')
    config.add_route('aux', 'aux')
    config.add_route('cell_density', 'cell_density')
    config.add_route('viewer', 'viewer')
    config.add_route('contact', 'contact')
    config.add_route('whitepaper', 'whitepaper')
    config.add_route('css', 'static/css/{css_path:.*}.css')
    config.add_route('region.hierarchy', 'region/hierarchy')
    config.add_route('region.overview', 'region/overview')
    config.add_route('connectivity', 'connectivity')
    config.add_route('openlayer.test', 'openlayer/test')
    config.add_route('injection.search', 'injection')
    config.add_route('injection.search_async', 'injection/search_async')
    config.add_route('section.search_async', 'section/search_async')
    config.add_route('section.view', 'section/{section_id}')
    config.add_route('section.view2', 'section2/{section_id}')
    config.add_route('section.search', 'section')
    config.add_route('home.dev', 'home-dev')
    config.add_route('async.annotation', 'async/annotation')
    config.add_route('async.delineation', 'async/delineation')
    config.add_route('djatoka', 'adore-djatoka/resolver')
    config.add_route('other_data', 'other_data')
    config.add_route('dashboard', 'dashboard')
    config.add_route('reference', 'reference')
    config.add_route('login', 'login')
    config.add_route('logout', 'logout')

    config.add_route('api.marmoset.edit', 'api/marmoset/edit')
    config.add_route('api.injection.edit', 'api/injection/edit')
    config.add_route('api.section.list', 'api/section/list')
    config.add_route('api.region.list', 'api/region/list')
    config.add_route('api.infragranular', 'api/infragranular/{case_id}')
    config.add_route('api.supragranular', 'api/supragranular/{case_id}')
    config.add_route('api.rogue_polygon', 'api/rogue_polygon/{case_id}')
    config.add_route('api.new_border1', 'api/layer3/{case_id}')
    config.add_route('api.new_border2', 'api/mid_layer_4/{case_id}')
    config.add_route('api.new_border3', 'api/new_border3/{case_id}')

    config.add_route('api.metadata.case', 'api/metadata/case/{case_id}')
    config.add_route('api.injection_site', 'api/injection_site/{case_id}')
    config.add_route('goto', 'goto/{case_id}/{section_code}/{x_mm}/{y_mm}*opt')
    config.add_route('cookie_policy', 'cookie-policy')
    config.add_route('', 'favicon.ico')

    config.add_view(route_name='css', view='connectome.libs.sass_controller.get_scss', renderer='sass', request_method='GET')
    config.add_static_view('static', 'static', cache_max_age=900)
    config.add_static_view('static_nocache', 'static_nocache', cache_max_age=0)

    config.add_route('api.v1.injection.detail', 'api/v1/injections/{injection_id}')
    config.add_route('api.v1.injection.list', 'api/v1/injections')
    config.add_route('api.v1.case.detail', 'api/v1/cases/{injection_id}')
    config.add_route('api.v1.case.list', 'api/v1/cases')
    config.add_route('api.v1.cell.get', 'api/v1/cells')
    config.add_route('api.v1.tracer.list', 'api/v1/tracers')
    config.add_route('api.v1.flne_area.get', 'api/v1/flne_areas')
    config.add_route('api.v1.injection.get', 'api/v1/flne_injections')
    config.add_route('api.v1.area.flat', 'api/v1/areas/flat')
    config.add_route('api.v1.area.list', 'api/v1/areas')
    config.add_route('api.v1.content', 'api')

    config.add_route('api.riken.region', 'api/riken/region')
    config.add_route('api.riken.injection_region_meta', 'api/riken/injection_region_meta')