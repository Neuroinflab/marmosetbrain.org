from sqlalchemy import (
    Column,
    Index,
    Integer,
    Text,
    String,
    ForeignKey,
    Numeric,
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

Session = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
Base = declarative_base()

class Region(Base):
    __tablename__ = 'marmoset_region'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    code = Column(String)
    slug = Column(String)

class RegionHierarchy(Base):
    __tablename__ = 'marmoset_regionhierarchy'
    id = Column(Integer, primary_key=True)
    region_id = Column(Integer, ForeignKey(Region.id))
    region = relationship('Region', foreign_keys=[region_id], backref='hierarchy')
    parent_id = Column(Integer, ForeignKey(Region.id))
    parent = relationship('Region', foreign_keys=[parent_id])

class Marmoset(Base):
    __tablename__ = 'marmoset_marmoset'
    id = Column(Integer, primary_key=True)
    case_name = Column(String)
    weight = Column(Integer)
    sex_id = Column(String)
    days = Column(Integer)
    slug = Column(String)

class Tracer(Base):
    __tablename__ = 'marmoset_tracer'
    id = Column(Integer, primary_key=True)
    code = Column(String)
    slug = Column(String)
    name = Column(String)

class Section(Base):
    __tablename__ = 'marmoset_section'
    id = Column(Integer, primary_key=True)
    marmoset_id = Column(Integer, ForeignKey(Marmoset.id))
    series_index = Column(Integer)
    code = Column(String)
    nissl_img = Column(String)
    myelin_img = Column(String)
    newman_coord = Column(String)
    paxinos_coord = Column(String)
    slug = Column(String)

class Injection(Base):
    __tablename__ = 'marmoset_injection'
    id = Column(Integer, primary_key=True)
    marmoset_id = Column(Integer, ForeignKey(Marmoset.id))
    book = Column(String)
    hemisphere_id = Column(Integer)
    tracer_id = Column(Integer)
    region_id = Column(Integer)
    atlas_a = Column(Numeric)
    atlas_l = Column(Numeric)
    atlas_h = Column(Numeric)
    section = Column(String)
    reg_img_inj_x_mm = Column(Numeric)
    reg_img_inj_y_mm = Column(Numeric)
    img_inj_x_mm = Column(Numeric)
    img_inj_y_mm = Column(Numeric)
    include = Column(Integer)
    slug = Column(String)

