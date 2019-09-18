import json
import msgpack

from sqlalchemy import (
    Column,
    Index,
    Integer,
    Text,
    String,
    Binary,
    ForeignKey,
    Numeric,
    Float,
    Date
)

from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy.orm import (
    scoped_session,
    sessionmaker,
    aliased,
    relationship,
    backref
)

from zope.sqlalchemy import ZopeTransactionExtension
"""
from .old import (
    Session as OldSession,
    Base as OldBase,
    Region as OldRegion,
    Marmoset as OldMarmoset,
    RegionHierarchy as OldRegionHierarchy,
    Tracer as OldTracer,
    Section as OldSection,
    Injection as OldInjection,
)
"""

from ..libs import section_name_re
DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
Base = declarative_base()


class Region(Base):
    __tablename__ = 'region'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    code = Column(String)
    slug = Column(String)
    color_code = Column(String)
    parent_id = Column(Integer, ForeignKey('region.id'))
    children = relationship('Region', lazy='joined', join_depth=2, backref=backref('parent', remote_side=[id]))
    _3dbar_index = Column(Integer)
    center_ap = Column(Float)
    center_ml = Column(Float)
    center_dv = Column(Float)

"""
class RegionHierarchy(Base):
    __tablename__ = 'regionhierarchy'
    id = Column(Integer, primary_key=True)
    region_id = Column(Integer, ForeignKey(Region.id))
    region = relationship('Region', foreign_keys=[region_id], uselist=False, backref=backref('hierarchy', uselist=False))
    parent_id = Column(Integer, ForeignKey(Region.id))
    parent = relationship('Region', foreign_keys=[parent_id], uselist=False)
class Section(Base):
    __tablename__ = 'section'
    id = Column(Integer, primary_key=True)
    marmoset_id = Column(Integer)
    series_index = Column(Integer)
    code = Column(String)
    nissl_img = Column(String)
    myelin_img = Column(String)
    newman_coord = Column(String)
    paxinos_coord = Column(String)
    slug = Column(String)
    #Index('my_index', MyModel.name, unique=True, mysql_length=255)
"""

class Marmoset(Base):
    __tablename__ = 'marmoset'
    id = Column(Integer, primary_key=True)
    case_id = Column(String)
    weight = Column(Integer)
    sex = Column(String)
    days = Column(Integer)
    slug = Column(String)

    animal_id = Column(String)
    dob = Column(Date)
    body_weight = Column(Integer)
    injection_date = Column(Date)
    hemisphere = Column(String)
    perfusion_date = Column(Date)
    survival_days = Column(Integer)
    other_info = Column(String)

    sectioning_plane = Column(String)
    display_name = Column(String)

class Tracer(Base):
    __tablename__ = 'tracer'
    id = Column(Integer, primary_key=True)
    code = Column(String)
    slug = Column(String)
    name = Column(String)
    color_code = Column(String)
    injection_color_code = Column(String)
    display_name_long = Column(String)
    comment = Column(String)

class Section(Base):
    __tablename__ = 'section'
    id = Column(Integer, primary_key=True)
    marmoset_id = Column(Integer, ForeignKey(Marmoset.id))
    marmoset = relationship('Marmoset', lazy='joined')
    position = Column(Numeric)
    code = Column(String)
    nissl_img = Column(String)
    nissl_section = Column(String)
    myelin_img = Column(String)
    newman_coord = Column(String)
    paxinos_coord = Column(String)
    slug = Column(String)
    #cellcount_id = Column(Integer, ForeignKey('cellcount.id'))
    cellcount = relationship('CellCount', lazy='joined', uselist=True)

    substitute_section_id = Column(Integer)
    #, ForeignKey('section.id'))
    #substitute_section = relationship('Section', lazy='joined', join_depth=2, uselist=False, remote_side=[id])
    mm_per_px = Column(Numeric)
    offset_x_mm = Column(Numeric)
    offset_y_mm = Column(Numeric)
    scale_factor_x = Column(Numeric)
    scale_factor_y = Column(Numeric)
    spreadsheet_index = Column(Integer)

    def __lt__(self, other):
        if not self.code:
            return True
        if not other.code:
            return False
        m = section_name_re.match(self.code)
        self_prefix = m.group(1)
        self_seq = int(m.group(2))
        self_suffix = m.group(3)

        m = section_name_re.match(other.code)
        other_prefix = m.group(1)
        other_seq = int(m.group(2))
        other_suffix = m.group(3)

        if not self_prefix:
            if self_seq == other_seq:
                return self_suffix < other_suffix
            else:
                return self_seq < other_seq
        if self_prefix == 'r' and other_prefix == 'r':
            if self_seq == other_seq:
                return self_suffix < other_suffix
            else:
                return self_seq < other_seq
        elif self_prefix == 'c' and other_prefix == 'c':
            if self_seq == other_seq:
                return self_suffix > other_suffix
            else:
                return self_seq > other_seq
        elif self_prefix == 'r' and other_prefix == 'c':
            return True
        elif self_prefix == 'c' and other_prefix == 'r':
            return False
        if self_prefix == 'm' and other_prefix == 'm':
            if self_seq == other_seq:
                return self_suffix < other_suffix
            else:
                return self_seq < other_seq


class Injection(Base):
    __tablename__ = 'injection'
    id = Column(Integer, primary_key=True)
    marmoset_id = Column(Integer, ForeignKey(Marmoset.id))
    marmoset = relationship('Marmoset', lazy='joined')
    hemisphere = Column(String)
    tracer_id = Column(Integer, ForeignKey(Tracer.id))
    tracer = relationship('Tracer', lazy='joined')
    region_id = Column(Integer, ForeignKey(Region.id))
    region = relationship('Region', lazy='joined')
    atlas_a = Column(Numeric)
    atlas_l = Column(Numeric)
    atlas_h = Column(Numeric)
    section_id = Column(Integer, ForeignKey(Section.id))
    reg_img_inj_x_mm = Column(Numeric)
    reg_img_inj_y_mm = Column(Numeric)
    img_inj_x_mm = Column(Numeric)
    img_inj_y_mm = Column(Numeric)
    flatmap_x= Column(Numeric)
    flatmap_y = Column(Numeric)
    include = Column(Integer)
    slug = Column(String)
    status = Column(String)
    flatmap_x = Column(Numeric)
    flatmap_y = Column(Numeric)
    memo =  Column(String)
    section_x_mm = Column(Float)
    section_y_mm = Column(Float)

class Cell(Base):
    __tablename__ = 'cell'
    id = Column(Integer, primary_key=True)
    marmoset_id = Column(Integer, ForeignKey(Marmoset.id))
    #marmoset = relationship('Marmoset', lazy='joined', backref=backref('parent')
    tracer_id = Column(Integer, ForeignKey(Tracer.id))
    tracer = relationship('Tracer', lazy='joined', uselist=False)
    section_id = Column(Integer, ForeignKey(Section.id))
    x_mm = Column(Numeric)
    y_mm = Column(Numeric)
    x_px = Column(Numeric)
    y_px = Column(Numeric)
    status = Column(String)

class CellCount(Base):
    __tablename__ = 'cellcount'
    id = Column(Integer, primary_key=True)
    section_id = Column(Integer, ForeignKey(Section.id))
    tracer_id = Column(Integer, ForeignKey(Tracer.id))
    tracer = relationship('Tracer', lazy='joined', uselist=False)
    count = Column(Integer)

class AnnotationType(Base):
    __tablename__ = 'annotation_type'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    stroke = Column(String)
    fill = Column(String)
    width = Column(String)
    geometry = Column(String)
    status = Column(String)
    position = Column(Integer)

class Annotation(Base):
    __tablename__ = 'annotation'
    id = Column(Integer, primary_key=True)
    type_id = Column(Integer, ForeignKey(AnnotationType.id))
    path = Column(Binary)
    memo = Column(String)
    section_id = Column(Integer, ForeignKey(Section.id))
    status = Column(String)
    @property
    def path_json(self):
        return json.dumps(msgpack.unpackb(self.path))

class DelineationType(Base):
    __tablename__ = 'delineation_type'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    stroke = Column(String)
    fill = Column(String)
    width = Column(String)
    geometry = Column(String)
    status = Column(String)
    position = Column(Integer)

class Delineation(Base):
    __tablename__ = 'delineation'
    id = Column(Integer, primary_key=True)
    type_id = Column(Integer, ForeignKey(DelineationType.id))
    path = Column(Binary)
    memo = Column(String)
    section_id = Column(Integer, ForeignKey(Section.id))
    status = Column(String)
    @property
    def path_json(self):
        return json.dumps(msgpack.unpackb(self.path))

class SagittalNavigation(Base):
    __tablename__ = 'sagittal_navigation'
    id = Column(Integer, primary_key=True)
    section_id = Column(Integer, ForeignKey(Section.id))
    marmoset_id = Column(Integer, ForeignKey(Marmoset.id))
    sagittal_coord = Column(Numeric)

class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    userid = Column(String)
    password = Column(String)
    _principles = Column('principles', String)

    @property
    def principles(self):
        return self._principles.split(',')

class Parcellation(Base):
    __tablename__ = 'parcellation'
    id = Column(Integer, primary_key=True)
    section_id = Column(Integer, ForeignKey(Section.id))
    region_id = Column(Integer, ForeignKey(Region.id))
    path = Column(Binary)
    @property
    def path_json(self):
        return json.dumps(msgpack.unpackb(self.path))

class FlneCell(Base):
    __tablename__ = 'flne_cell'
    id = Column(Integer, primary_key=True)
    injection_id = Column(Integer, ForeignKey(Injection.id))
    target_region_id = Column(Integer, ForeignKey(Region.id))
    source_region_id = Column(Integer, ForeignKey(Region.id))
    l = Column(Float)
    a = Column(Float)
    h = Column(Float)
    laminar_position = Column(Integer)

class FlneInjection(Base):
    __tablename__ = 'flne_injection'
    id = Column(Integer, primary_key=True)
    injection_id = Column(Integer, ForeignKey(Injection.id))
    cell_count = Column(Integer)
    flne = Column(Float)
    source_region_id = Column(Integer, ForeignKey(Region.id))

class FlneArea(Base):
    __tablename__ = 'flne_area'
    id = Column(Integer, primary_key=True)
    target_region_id = Column(Integer, ForeignKey(Region.id))
    source_region_id = Column(Integer, ForeignKey(Region.id))
    flne = Column(Float)

class ClipMask(Base):
    __tablename__ = 'clip_mask'
    id = Column(Integer, primary_key=True)
    section_id = Column(Integer, ForeignKey(Section.id))
    path = Column(Binary)
    @property
    def path_json(self):
        return json.dumps(msgpack.unpackb(self.path))
