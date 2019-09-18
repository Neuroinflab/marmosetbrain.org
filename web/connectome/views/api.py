from collections import defaultdict

from pyramid.response import Response
from pyramid.view import view_config
from pyramid.renderers import render
from sqlalchemy.exc import DBAPIError
from sqlalchemy.orm import aliased
from pyramid.httpexceptions import HTTPPaymentRequired, HTTPInternalServerError
from ..models import (
    DBSession,
    Region,
    Tracer,
    Annotation,
    AnnotationType,
    Marmoset,
    Injection,
    Section,
    Region,
    Delineation,
    DelineationType,
#    RegionHierarchy,
    )

import msgpack

@view_config(route_name='api.marmoset.edit', renderer='json', permission='edit')
def marmoset_edit(request):
    try:
        id_ = request.params['pk']
        name = request.params['name']
        value = request.params['value']
        if value == '':
            value = None
        session = DBSession()
        m = session.query(Marmoset).filter_by(id=id_).one()

        setattr(m, name, value)

    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}

@view_config(route_name='api.injection.edit', renderer='json', permission='edit')
def injection_edit(request):
    try:
        id_ = request.params['pk']
        name = request.params['name']
        value = request.params['value']
        if value == '':
            value = None
        session = DBSession()
        m = session.query(Injection).filter_by(id=id_).one()

        setattr(m, name, value)

    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}

@view_config(route_name='api.section.list', renderer='json', permission='edit')
def section_list(request):
    try:
        session = DBSession()
        sections = session.query(Section)
        marmoset_id = request.params.get('marmoset_id')
        if marmoset_id:
            sections = sections.filter_by(marmoset_id=marmoset_id)
        sections = sections.all()
        res = []
        sections.sort()
        for section in sections:
            res.append({'value': section.id, 'text': section.code})
        return res
    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}

@view_config(route_name='api.region.list', renderer='json', permission='edit')
def region_list(request):
    try:
        session = DBSession()
        regions = session.query(Region)
        res = []
        for r in regions:
            res.append({'value': r.id, 'text': r.code})
        return res
    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}

@view_config(route_name='api.infragranular', renderer='json')
def infragranular(request):
    try:
        session = DBSession()
        case_id = request.matchdict.get('case_id')
        dels = session.query(Delineation).filter_by(status='Active').join(DelineationType).filter_by(name='Infragranular').reset_joinpoint()\
                .join(Section).join(Marmoset).filter_by(case_id=case_id).all()
        res = []
        polys = defaultdict(list)
        sections = {}
        for d in dels:
            section = session.query(Section).filter_by(id=d.section_id).one()
            sections[section.id] = section
            paths = msgpack.unpackb(d.path)
            poly = []
            for p in paths:
                #p = [[float(v[0]) * float(section.mm_per_px) + float(section.offset_x_mm), float(-v[1]) * float(section.mm_per_px) + float(section.offset_y_mm)] for v in p]
                p = [[float(v[0]) * float(section.mm_per_px) * float(section.scale_factor_x) + float(section.offset_x_mm), float(-v[1]) * float(section.mm_per_px) * float(section.scale_factor_y) + float(section.offset_y_mm)] for v in p]
                poly.append(p)
            polys[section.id].append(poly)
        for s_id in polys.keys():
            section = sections[s_id]
            res.append([
                case_id, section.spreadsheet_index, section.code, polys[section.id]
            ])
        return res
    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}

@view_config(route_name='api.supragranular', renderer='json')
def supragranular(request):
    try:
        session = DBSession()
        case_id = request.matchdict.get('case_id')
        dels = session.query(Delineation).filter_by(status='Active').join(DelineationType).filter_by(name='Supragranular').reset_joinpoint()\
                .join(Section).join(Marmoset).filter_by(case_id=case_id).all()
        res = []
        polys = defaultdict(list)
        sections = {}
        for d in dels:
            section = session.query(Section).filter_by(id=d.section_id).one()
            sections[section.id] = section
            paths = msgpack.unpackb(d.path)
            poly = []
            for p in paths:
                p = [[float(v[0]) * float(section.mm_per_px) + float(section.offset_x_mm), float(-v[1]) * float(section.mm_per_px) + float(section.offset_y_mm)] for v in p]
                poly.append(p)
            polys[section.id].append(poly)
        for s_id in polys.keys():
            section = sections[s_id]
            res.append([
                case_id, section.spreadsheet_index, section.code, polys[section.id]
            ])
        return res
    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}

@view_config(route_name='api.rogue_polygon', renderer='json')
def rogue_polygon(request):
    try:
        session = DBSession()
        case_id = request.matchdict.get('case_id')
        dels = session.query(Delineation).filter_by(status='Active').join(DelineationType).filter_by(name='Rogue Cells').reset_joinpoint()\
                .join(Section).join(Marmoset).filter_by(case_id=case_id).all()
        res = []
        polys = defaultdict(list)
        sections = {}
        for d in dels:
            section = session.query(Section).filter_by(id=d.section_id).one()
            sections[section.id] = section
            paths = msgpack.unpackb(d.path)
            poly = []
            for p in paths:
                p = [[round(float(v[0]) * float(section.mm_per_px) + float(section.offset_x_mm), 6), round(float(-v[1]) * float(section.mm_per_px) + float(section.offset_y_mm), 6)] for v in p]
                poly.append(p)
            polys[section.id].append(poly)
        for s_id in polys.keys():
            section = sections[s_id]
            res.append([
                case_id, section.spreadsheet_index, section.code, polys[section.id]
            ])
        return res
    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}

def new_border1(request):
    try:
        session = DBSession()
        case_id = request.matchdict.get('case_id')
        dels = session.query(Delineation).filter_by(status='Active').join(DelineationType).filter_by(name='Mid layer IV').reset_joinpoint()\
                .join(Section).join(Marmoset).filter_by(case_id=case_id).all()
        res = []
        polys = defaultdict(list)
        sections = {}
        for d in dels:
            section = session.query(Section).filter_by(id=d.section_id).one()
            sections[section.id] = section
            paths = msgpack.unpackb(d.path)
            poly = []
            for p in paths:
                p = [[round(float(v[0]) * float(section.mm_per_px) + float(section.offset_x_mm), 6), round(float(-v[1]) * float(section.mm_per_px) + float(section.offset_y_mm), 6)] for v in p]
                poly.append(p)
            polys[section.id].append(poly)
        for s_id in polys.keys():
            section = sections[s_id]
            res.append([
                case_id, section.spreadsheet_index, section.code, polys[section.id]
            ])
        return res
    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}

def new_border2(request):
    try:
        session = DBSession()
        case_id = request.matchdict.get('case_id')
        dels = session.query(Delineation).filter_by(status='Active').join(DelineationType).filter_by(name='Layer III').reset_joinpoint()\
                .join(Section).join(Marmoset).filter_by(case_id=case_id).all()
        res = []
        polys = defaultdict(list)
        sections = {}
        for d in dels:
            section = session.query(Section).filter_by(id=d.section_id).one()
            sections[section.id] = section
            paths = msgpack.unpackb(d.path)
            poly = []
            for p in paths:
                p = [[round(float(v[0]) * float(section.mm_per_px) + float(section.offset_x_mm), 6), round(float(-v[1]) * float(section.mm_per_px) + float(section.offset_y_mm), 6)] for v in p]
                poly.append(p)
            polys[section.id].append(poly)
        for s_id in polys.keys():
            section = sections[s_id]
            res.append([
                case_id, section.spreadsheet_index, section.code, polys[section.id]
            ])
        return res
    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}

def new_border3(request):
    try:
        session = DBSession()
        case_id = request.matchdict.get('case_id')
        dels = session.query(Delineation).filter_by(status='Active').join(DelineationType).filter_by(name='New Border 3').reset_joinpoint()\
                .join(Section).join(Marmoset).filter_by(case_id=case_id).all()
        res = []
        polys = defaultdict(list)
        sections = {}
        for d in dels:
            section = session.query(Section).filter_by(id=d.section_id).one()
            sections[section.id] = section
            paths = msgpack.unpackb(d.path)
            poly = []
            for p in paths:
                p = [[round(float(v[0]) * float(section.mm_per_px) + float(section.offset_x_mm), 6), round(float(-v[1]) * float(section.mm_per_px) + float(section.offset_y_mm), 6)] for v in p]
                poly.append(p)
            polys[section.id].append(poly)
        for s_id in polys.keys():
            section = sections[s_id]
            res.append([
                case_id, section.spreadsheet_index, section.code, polys[section.id]
            ])
        return res
    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}

@view_config(route_name='api.metadata.case', renderer='json')
def metadata_case(request):
    try:
        session = DBSession()
        case_id = request.matchdict.get('case_id')
        mar = session.query(Marmoset).filter_by(case_id=case_id).one()
        injections = session.query(Injection, Tracer, Region, Section) \
            .filter_by(marmoset_id=mar.id)\
            .join(Tracer) \
            .join(Region) \
            .join(Section) \
            .all()
        inj_data = []
        for inj, tracer, region, section in injections:
            data = {
                'tracer': tracer.code,
                'region': region.code,
                'a': '%.2f' % inj.atlas_a,
                'l': '%.2f' % inj.atlas_l,
                'h': '%.2f' % inj.atlas_h,
                'memo': inj.memo.strip() if inj.memo else '',
                'section': section.code,
                'section_x': inj.section_x_mm,
                'section_y': inj.section_y_mm
            }
            inj_data.append(data)
        if 'Origin' in request.headers:
            request.response.headers['Access-Control-Allow-Origin'] = request.headers['Origin']

        return {
            'case': case_id,
            'display_name': mar.display_name,
            'date_of_birth': mar.dob.strftime('%Y-%m-%d') if mar.dob else None,
            'injection_date': mar.injection_date.strftime('%Y-%m-%d') if mar.injection_date else None,
            'hemisphere': mar.hemisphere,
            'sex': mar.sex,
            'survival_days': mar.survival_days,
            'perfusion_date': mar.perfusion_date.strftime('%Y-%m-%d') if mar.perfusion_date else None,
            'memo': mar.other_info.strip() if mar.other_info else '',
            'sectioning_plane': mar.sectioning_plane,
            'weight': mar.body_weight,
            'injections': inj_data
        }

    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}

def injection_site(request):
    try:
        session = DBSession()
        case_id = request.matchdict['case_id']
        tracer_code = request.params['tracer']
        if tracer_code == 'CTBgr':
            tracer_code = 'FE'
        elif tracer_code == 'CTBr':
            tracer_code = 'FR'
        elif tracer_code == 'CTBg':
            tracer_code = 'DY'
        res = []
        at = session.query(AnnotationType).filter(AnnotationType.name.ilike('%s injection' % tracer_code)).first()
        if at:
            tracer_code = at.name.split()[0]
            sites = session.query(Annotation).filter_by(status='Active', type_id=at.id)\
                    .join(Section).join(Marmoset).filter_by(case_id=case_id).all()
            polys = defaultdict(list)
            sections = {}
            if len(sites) > 0:
                for inj_site in sites:
                    section = session.query(Section).filter_by(id=inj_site.section_id).one()
                    sections[section.id] = section
                    paths = msgpack.unpackb(inj_site.path)
                    poly = []
                    for p in paths:
                        p = [[round(float(v[0]) * float(section.mm_per_px) + float(section.offset_x_mm), 6), round(float(-v[1]) * float(section.mm_per_px) + float(section.offset_y_mm), 6)] for v in p]
                        poly.append(p)
                    polys[section.id].append(poly)
                for s_id in polys.keys():
                    section = sections[s_id]
                    res.append([
                        case_id, section.spreadsheet_index, section.code, polys[section.id]
                    ])
        return res
    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}

def riken_region(request):
    try:
        ret = {}
        regions = []
        session = DBSession()
        _region = request.params.get('region')
        q = session.query(Injection, Marmoset, Tracer, Section, Region)
        all_ = False
        if _region == 'all':
            q = q.filter_by(status='Active')
            all_ = True
        else:
            r = session.query(Region).filter_by(code=_region).first()
            if r:
                q = q.filter_by(region_id=r.id, status='Active')
            else:
                q = None
        if q:
            res = q.join(Marmoset, Injection.marmoset_id == Marmoset.id)\
                .join(Tracer, Injection.tracer_id == Tracer.id)\
                .join(Section, Injection.section_id == Section.id)\
                .join(Region, Injection.region_id == Region.id)\
                .all()
            for inj, m, tracer, s, r in res:
                region = dict(
                    brain_id=m.case_id,
                    tracer=tracer.name,
                    sex=m.sex,
                    perfusion_date=m.perfusion_date.strftime('%Y-%m-%d'),
                    dob=m.dob.strftime('%Y-%m-%d'),
                    ap_true='%.2f' % inj.atlas_a,
                    ml_true='%.2f' % inj.atlas_l,
                    z_true='%.2f' % inj.atlas_h,
                    target_img='%s-%s-%s.jp2' % (m.case_id.lower(), s.nissl_section, 'nissl'),
                    target_link='http://marmoset.braincircuits.org/goto/%s/%s/%s/%s/3' % (m.case_id, s.code, '%.3f' % inj.section_x_mm, '%.3f' % inj.section_y_mm),
                    thumbnail_img='%s.png' % s.nissl_section,
                )
                if all_:
                    region['id'] = inj.id
                    region['brain_area'] = r.code
                regions.append(region)
        ret['region'] = regions
        res = request.response
        res.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', ''))
        res.headers.add('Vary', 'Origin')

        return ret

    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}

def riken_injection_region_meta(request):
    try:
        ret = {}
        regions = []
        session = DBSession()
        _region = request.params.get('region')
        r = session.query(Region).filter_by(code=_region).first()
        if r:
            for inj, m, tracer, s in session.query(Injection, Marmoset, Tracer, Section).filter_by(region_id=r.id)\
                    .join(Marmoset, Injection.marmoset_id == Marmoset.id)\
                    .join(Tracer, Injection.tracer_id == Tracer.id)\
                    .join(Section, Injection.section_id == Section.id).all():
                region = dict(
                    brain_id=m.case_id,
                    tracer=tracer.name,
                    sex=m.sex,
                    perfusion_date=m.perfusion_date.strftime('%Y-%m-%d'),
                    dob=m.dob.strftime('%Y-%m-%d'),
                    ap_true='%.2f' % inj.atlas_a,
                    ml_true='%.2f' % inj.atlas_l,
                    z_true='%.2f' % inj.atlas_h,
                    target_img='%s-%s-%s.jp2' % (m.case_id.lower(), s.code, 'nissl'),
                    target_link='http://marmoset.braincircuits.org/goto/%s/%s/%s/%s/3' % (m.case_id, s.code, '%.3f' % inj.section_x_mm, '%.3f' % inj.section_y_mm)
                )
                regions.append(region)
            ret['region'] = regions
        else:
            pass
        res = request.response
        res.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', ''))
        res.headers.add('Vary', 'Origin')

        return ret

    except (KeyError, DBAPIError) as ex:
        return HTTPInternalServerError(str(ex))
    return {}

