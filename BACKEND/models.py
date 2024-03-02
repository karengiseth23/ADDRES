import uuid
from typing import List

from database import Base
from sqlalchemy import Boolean, Integer, DateTime, JSON
from sqlalchemy import Column
from sqlalchemy import String


def generate_uuid():
    return str(uuid.uuid4())


class Presupuesto(Base):
    __tablename__ = "presupuesto"

    id = Column(String, name="id", primary_key=True, default=generate_uuid, index=True)
    presupuesto = Column(String)
    unidad = Column(String)
    tipo = Column(String)
    cantidad = Column(String)
    valor_unitario = Column(Integer)
    valor_total = Column(Integer)
    fecha_adquisicion = Column(DateTime)
    proveedor = Column(String)
    documentacion = Column(String)
    historial = Column(JSON)
