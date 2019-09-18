import time
import json
from collections import defaultdict

from argparse import Namespace
import msgpack

from pyramid.response import Response
from pyramid.view import view_config
from pyramid.renderers import render
from pyramid.httpexceptions import HTTPNotAcceptable
from sqlalchemy import func, text as sa_text, Column
from sqlalchemy.types import Numeric, String
from sqlalchemy.exc import DBAPIError
from sqlalchemy.orm import aliased

from ..models import (
    DBSession,
    Region,
    Injection,
    Section,
    Cell,
    Marmoset,
    AnnotationType,
    Annotation,
    DelineationType,
    Delineation,
    ClipMask,
    )
from ..libs import models2list

@view_config(route_name='section.view', renderer='section-view.mako')
def section_view(request):
    try:
        #start = time.time()
        _float = Numeric(asdecimal=False)
        session = DBSession()
        section_id = int(request.matchdict.get('section_id'))
        #section = session.query(Section).filter_by(id=section_id).first()

        status_cond = "(i.status='Active'"
        if 'system.Authenticated' in request.effective_principals:
            status_cond += " OR i.status='Hidden'"
        status_cond += ')'

        res = DBSession.execute(
            """SELECT m.id, m.case_id, m.display_name, s.code, s.slug, s2.slug,
                sn.sagittal_coord, s.mm_per_px, s.nissl_section,
                s.scale_factor_x, s.scale_factor_y,
                m.sex, m.animal_id, m.dob, m.body_weight, m.injection_date,
                m.hemisphere, m.perfusion_date, m.survival_days, m.other_info,
                m.sectioning_plane
            FROM section s
            JOIN marmoset m ON m.id = s.marmoset_id
            LEFT OUTER JOIN section s2 ON s2.id = s.substitute_section_id
            LEFT OUTER JOIN sagittal_navigation sn ON sn.section_id = s.id
            WHERE s.id=:section_id""", {'section_id': section_id}).fetchone()
        (
            m_id, case_id, display_name, section_code, s_slug, s2_slug,
            sagittal_coord, mm_per_px, nissl_section,
            scale_factor_x, scale_factor_y,
            m_sex, m_animal_id, m_dob, m_body_weight, m_injection_date,
            m_hemisphere, m_perfusion_date, m_survival_days, m_other_info, m_sectioning_plane
        ) = res
        if not display_name:
            display_name = case_id
        res = DBSession.execute(
            """SELECT s.id, sum(cc.count) as cnt
            FROM section s
            JOIN cellcount cc ON cc.section_id = s.id
            WHERE marmoset_id=:marmoset_id
            GROUP BY s.id
            ORDER BY s.position""", {'marmoset_id': m_id}).fetchall()
        id_cells_list = tuple(r[0] for r in res if r[1] > 0)
        index_cells = id_cells_list.index(min(id_cells_list, key=lambda x: abs(x-section_id)))

        id_list = tuple(r[0] for r in res)
        index = id_list.index(section_id)
        query = sa_text(
            """SELECT c.id, t.code AS tracer, c.x_mm, c.y_mm
            FROM cell c
            JOIN tracer t ON t.id=c.tracer_id
            JOIN injection i ON i.marmoset_id=:marmoset_id AND i.tracer_id=c.tracer_id
            WHERE c.section_id=:section_id AND %s""" % (status_cond, )).columns(
                x_mm=_float,
                y_mm=_float,
            )

        cells = DBSession.execute(query, {'section_id': section_id, 'marmoset_id': m_id})
        #cells = [{'tracer': str(c.tracer), 'x': c.x_mm, 'y': c.y_mm} for c in cells]
        _cells = {'headers': ['tracer', 'x', 'y'], 'data': [[str(c.tracer), round(c.x_mm, 6), round(c.y_mm, 6)] for c in cells]}
        parcellation = []
        res_parcellation = DBSession.execute(
            """SELECT p.path, r.color_code as color, r.code, r.name
            FROM parcellation p
            JOIN section s ON s.id = p.section_id
            JOIN region r ON r.id = p.region_id
            WHERE s.id = :section_id
            """, {'section_id': section_id}).fetchall()
        for par in res_parcellation:
            parcellation.append({'fill': str(par['color']), 'path': msgpack.unpackb(par['path']), 'region': str(par['name'])})

        series = DBSession.execute(
            """SELECT s.id, s.substitute_section_id, s.code,
                s.nissl_section,
                (SELECT SUM(cc.count) FROM cellcount cc WHERE cc.section_id = s.id) AS count,
                (SELECT COUNT(anno.id) FROM annotation anno WHERE anno.section_id = s.id AND anno.status='Active') AS anno_count
            FROM section s
            WHERE s.marmoset_id=:marmoset_id
            GROUP BY s.id, s.substitute_section_id,
                s.code, s.nissl_section
            ORDER BY s.position""", {'marmoset_id': m_id}).fetchall()
        series = [{
            'id': ss['id'], 'code': ss['code'],
            'nissl_section': ss['nissl_section'],
            'count': ss['count'], 'anno_count': ss['anno_count']
        } for ss in series]
        query_text = """SELECT i.id, i.atlas_a, i.atlas_l, i.atlas_h, i.section_id,
            i.reg_img_inj_x_mm AS x, i.reg_img_inj_y_mm AS y, t.code AS tracer,
            r.code as region, r.name as region_name, i.status, i.memo, s.code,
            i.section_x_mm, i.section_y_mm
            FROM injection i
            JOIN tracer t ON t.id = i.tracer_id
            JOIN section s ON s.id = i.section_id
            LEFT OUTER JOIN region r ON r.id = i.region_id
            WHERE i.marmoset_id=:marmoset_id AND %s
            """ % (status_cond, )
        query = sa_text(query_text).columns(
                atlas_a=_float,
                atlas_l=_float,
                atlas_h=_float,
                x=_float,
                y=_float,
                section_x_mm=_float,
                section_y_mm=_float,
            )

        injections = DBSession.execute(query, {'marmoset_id': m_id})
        injections = [{
            'id': i.id, 'x': i.x, 'y': i.y, 'tracer': str(i.tracer),
            'region': str(i.region), 'region_name': str(i.region_name),
            'atlas_a': i.atlas_a, 'atlas_l': i.atlas_l,
            'atlas_h': i.atlas_h, 'section_id': i.section_id,
            'status': str(i.status), 'section_code': i.code,
            'section_x': i.section_x_mm,
            'section_y': i.section_y_mm,
            'memo': i.memo
        } for i in injections]
        query = sa_text(
            """SELECT sn.sagittal_coord, s.code, s.id AS section_id, sum(cc.count) AS cell_count
            FROM sagittal_navigation sn
            JOIN section s ON s.id = sn.section_id
            LEFT OUTER JOIN cellcount cc ON cc.section_id = sn.section_id
            WHERE sn.marmoset_id = :marmoset_id
            GROUP BY sn.sagittal_coord, s.code, s.id
            ORDER BY sn.sagittal_coord""").columns(
                sagittal_coord=_float,
            )
        sagittal_series = DBSession.execute(query, {'marmoset_id': m_id}).fetchall()
        sagittal_series = [{'coord': ss['sagittal_coord'], 'section': ss['code'], 'section_id': ss['section_id'], 'cell_count': ss['cell_count']} for ss in sagittal_series]
        #annotation_types = session.query(AnnotationType).filter_by(status='Active').order_by(AnnotationType.position).all()
        annotation_types = [
            {'id': i.id, 'name': i.name, 'stroke': i.stroke, 'fill': i.fill, 'geometry': i.geometry}
            for i in session.query(AnnotationType).order_by(AnnotationType.id).all()
        ]
        #annotations = session.query(Annotation).filter_by(section_id=section_id, status='Active').order_by(Annotation.id).all()
        annotations = [
            {
                'id': a.id,
                'type_id': a.type_id,
                'path': a.path_json,
                'memo': a.memo
            }
            for a in session.query(Annotation).filter_by(section_id=section_id, status='Active').order_by(Annotation.id).all()
        ]

        delineation_types = session.query(DelineationType).filter((DelineationType.status=='Active') | (DelineationType.status=='Ephemeral')).order_by(DelineationType.position).all()
        delineation_types = [{
            'id': dt.id, 'name': dt.name,
            'stroke': dt.stroke, 'fill': dt.fill if dt.fill else None,
            'geometry': dt.geometry, 'width': dt.width, 'position': dt.position,
            'status': dt.status
        } for dt in delineation_types]
        delineations = session.query(Delineation).filter_by(section_id=section_id, status='Active').order_by(Delineation.id).all()
        delineations = [{
            'id': d.id, 'type_id': d.type_id,
            'memo': d.memo, 'path': d.path_json, 'status': d.status,
        } for d in delineations]
        clip = session.query(ClipMask).filter_by(section_id=section_id).first()
        if clip:
            clip = {
                    'id': clip.id,
                    'path': clip.path_json,
                }
        else:
            clip = None

        #rft_id= '%s-nissl' % (s2_slug if s2_slug else s_slug, )
        rft_id = '%s-%s-nissl' % (case_id.lower(), nissl_section.lower())

        marmoset = {
            'id': m_id,
            'animal_id': m_animal_id,
            'sex': m_sex,
            'dob': m_dob,
            'body_weight': m_body_weight,
            'injection_date': m_injection_date,
            'hemisphere': m_hemisphere,
            'perfusion_date': m_perfusion_date,
            'survival_days': m_survival_days,
            'other_info': m_other_info,
            'sectioning_plane': m_sectioning_plane,
        }
        if marmoset['injection_date'] and marmoset['dob']:
            inj_date = marmoset['injection_date']
            dob = marmoset['dob']
            years = inj_date.year - dob.year
            months = inj_date.month - dob.month
            if months < 0:
                years -= 1
                months += 12
            days = inj_date.day - dob.day
            if days < 0:
                months -= 1


            marmoset['age'] = str(years) + ' ' + request.localizer.pluralize('year', 'years', years) if years > 0 else ''
            marmoset['age'] += ' and ' if years > 0 and months > 0 else ''
            marmoset['age'] += str(months) + ' ' + request.localizer.pluralize('month', 'months', months) if months > 0 else ''
        else:
            marmoset['age'] = None
        override_extent = request.GET.get('override_extent')
        override_zoom = request.GET.get('override_zoom')
        from_ = request.GET.get('from')

        q_cells = DBSession.execute(
            """SELECT sum(cc.count) AS count, t.code AS code
            FROM cellcount cc
            JOIN section s ON s.id = cc.section_id
            JOIN tracer t ON t.id = cc.tracer_id
            WHERE s.marmoset_id=:marmoset_id GROUP BY t.code
            """, {'marmoset_id': m_id}
        ).fetchall()
        total_cells = defaultdict(int)
        for r in q_cells:
            if r.code == 'FE':
                code = 'fe'
            elif r.code == 'CTBgr':
                code = 'fe'
            elif r.code == 'FR':
                code = 'fr'
            elif r.code == 'CTBr':
                code = 'fr'
            elif r.code == 'FB':
                code = 'fb'
            elif r.code == 'DY':
                code = 'dy'
            elif r.code == 'BDA':
                code = 'bda'
            elif r.code == 'CTBg':
                code = 'ctbg'
            total_cells[code] += int(r.count)
            total_cells['total'] += int(r.count)
        return {
            'section_id': section_id, 'section_code': section_code, 'case_id': case_id, 'display_name': display_name, 'marmoset_id': m_id, 'rft_id': rft_id,
            'marmoset': Namespace(**marmoset),
            'injections': injections,
            'cells': cells,
            '_cells': _cells,
            'series': json.dumps(series),
            'next_section_with_cells_id': id_cells_list[index_cells + 1] if index_cells < len(id_cells_list) - 1 else section_id,
            'prev_section_with_cells_id': id_cells_list[index_cells - 1] if index_cells > 0 else section_id,
            'next_section_id': id_list[index + 1] if index < len(id_list) - 1 else section_id,
            'prev_section_id': id_list[index - 1] if index > 0 else section_id,
            'annotation_types': annotation_types, 'annotations': annotations,
            'delineation_types': delineation_types, 'delineations': delineations,
            'sagittal_coord': sagittal_coord,
            'sagittal_series': json.dumps(sagittal_series),
            'mm_per_px': mm_per_px,
            'scale_factor_x': scale_factor_x,
            'scale_factor_y': scale_factor_y,
            'parcellation': parcellation,
            'override_extent': override_extent,
            'override_zoom': override_zoom,
            'clip': clip,
            'from_': from_,
            'total_cells': total_cells,
        }
    #except (TypeError, ValueError) as ex:
    #    raise HTTPNotAcceptable(str(ex))
    except DBAPIError as ex:
        return Response(str(ex), content_type='text/plain', status_int=500)
    return {}

@view_config(route_name='section.search', renderer='section-search.mako')
def section_search(request):
    try:
        pass
    except DBAPIError as ex:
        return Response(str(ex), content_type='text/plain', status_int=500)
    return {}

@view_config(route_name='section.search', request_method='POST', renderer='section-search.mako')
def section_search_post(request):
    try:
        pass
    except DBAPIError as ex:
        return Response(str(ex), content_type='text/plain', status_int=500)
    return {}

@view_config(route_name='section.search_async', renderer='json')
def section_search_async(request):
    try:
        section_cond = request.params.get('section')
        session = DBSession()
        sections = session.query(Section)
        if section_cond is not None:
            sections = sections.filter(Section.code.ilike('%%%s%%' % section_cond))
        ret = []
        for s in sections.order_by(Section.marmoset_id, Section.position).all():
            d = {
                'id': s.id,
                'title': s.code,
                'case_id': s.marmoset.case_id,
                'action': request.route_url('section.view', section_id=s.id),
            }
            for inj in s.cellcount:
                d[inj.tracer.code] = inj.count
            d['BDA'] = 0
            d['total'] = d['FE'] + d['FR'] + d['FB'] + d['DY'] + d['BDA']
            ret.append(d)
        return ret
    except DBAPIError as ex:
        return Response(str(ex), content_type='text/plain', status_int=500)
    return {}

