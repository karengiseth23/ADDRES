from datetime import datetime
from typing import Union
from uuid import UUID

from pydantic import BaseModel


class PresupuestoBase(BaseModel):
    presupuesto:  Union[str, None] = None
    unidad:  Union[str, None] = None
    tipo:  Union[str, None] = None
    cantidad:  Union[str, None] = None
    valor_unitario:  Union[int, None] = None
    valor_total: Union[int, None] = None
    fecha_adquisicion: Union[datetime, None] = None
    proveedor: Union[str, None] = None
    documentacion: Union[str, None] = None
    historial: Union[list, None] = None

class PresupuestoCreate(BaseModel):
    presupuesto: str
    unidad: str
    tipo: str
    cantidad: str
    valor_unitario: int
    valor_total: int
    fecha_adquisicion: datetime
    proveedor: str
    documentacion: str


class Presupuesto(PresupuestoBase):
    id: UUID

    class Config:
        from_attributes = True


class RetrivePresupuesto(BaseModel):
    count: int
    results: list[Presupuesto]

    class Config:
        from_attributes = True
