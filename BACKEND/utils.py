from sqlalchemy import or_, cast, String

from sqlalchemy.orm import Session

from models import Presupuesto


def get_presupuestos(db: Session, limit: int = 10, page: int = 1, search: str = ''):
    skip = (page - 1) * limit
    base = db.query(Presupuesto)
    all = base.count()
    return (
        base.filter(
            or_(
                Presupuesto.presupuesto.ilike(f'%{search}%'),
                Presupuesto.unidad.ilike(f'%{search}%'),
                Presupuesto.tipo.ilike(f'%{search}%'),
                Presupuesto.cantidad.ilike(f'%{search}%'),
                Presupuesto.proveedor.ilike(f'%{search}%'),
            )
        ).limit(limit).offset(skip).all(),
        all,
    )


def create_presupuesto(db: Session, presupuesto: Presupuesto):
    pre_aux = presupuesto.copy()
    pre_aux.fecha_adquisicion = f'{presupuesto.fecha_adquisicion}'
    db_presupuesto = Presupuesto(**presupuesto.dict(), historial=[{**pre_aux.dict()}])
    db.add(db_presupuesto)
    db.commit()
    db.refresh(db_presupuesto)
    return db_presupuesto


def get_presupuesto_by_id(db: Session, presupuesto_id: str):
    return db.query(Presupuesto).filter(cast(Presupuesto.id, String) == cast(presupuesto_id, String)).first()


def delete_presupuestos(db: Session, presupuesto: Presupuesto):
    db.delete(presupuesto)
    db.commit()
    return True


def patch_presupuesto(db: Session, presupuesto: Presupuesto, update_data: dict):
    for field, value in update_data.items():
        setattr(presupuesto, field, value)
    db.commit()
    db.refresh(presupuesto)
    return presupuesto
