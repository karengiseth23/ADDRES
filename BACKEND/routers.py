import time

from fastapi import Request, Depends, HTTPException
from fastapi import APIRouter
from sqlalchemy.orm import Session
from fastapi import Response
from starlette import status

from database import Base, engine

from schemas import RetrivePresupuesto, PresupuestoCreate, Presupuesto, PresupuestoBase
from utils import get_presupuestos, create_presupuesto, get_presupuesto_by_id, patch_presupuesto, \
    delete_presupuestos


def get_db(request: Request):
    return request.state.db


Base.metadata.create_all(bind=engine)

presupuesto_router = APIRouter(prefix="/presupuestos", tags=["Presupuestos"])


@presupuesto_router.get('/', response_model=RetrivePresupuesto, status_code=status.HTTP_200_OK)
def get_all_presupuestos(db: Session = Depends(get_db), limit: int = 10, page: int = 1, search: str = ''):
    db_presupuestos, count = get_presupuestos(db, limit=limit, page=page, search=search)
    return RetrivePresupuesto(results=db_presupuestos, count=count)


@presupuesto_router.post("/", response_model=Presupuesto, status_code=status.HTTP_201_CREATED)
async def presupuestos(presupuesto: PresupuestoCreate, db: Session = Depends(get_db)):
    presupuesto_created_obj = create_presupuesto(db=db, presupuesto=presupuesto)
    return presupuesto_created_obj


@presupuesto_router.get("/{presupuesto_id}", response_model=Presupuesto, status_code=status.HTTP_200_OK)
async def detail_presupuesto(
        presupuesto_id: str,
        db: Session = Depends(get_db),
):
    db_presupuesto_object = get_presupuesto_by_id(
        db,
        presupuesto_id=presupuesto_id,
    )
    if not db_presupuesto_object:
        raise HTTPException(status_code=404, detail="Presupuesto not found")
    return db_presupuesto_object


@presupuesto_router.delete("/{presupuesto_id}")
async def delete_presupuesto(
        presupuesto_id: str,
        db: Session = Depends(get_db),
):
    db_presupuesto_object = get_presupuesto_by_id(db, presupuesto_id=presupuesto_id)
    if not db_presupuesto_object:
        raise HTTPException(status_code=404, detail="Presupuesto not found")
    if not delete_presupuestos(db, db_presupuesto_object):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Presupuesto not deleted",
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@presupuesto_router.patch('/{presupuesto_id}', response_model=Presupuesto)
def partial_update_presupuesto(
        presupuesto_id: str,
        presupuesto: PresupuestoBase,
        db: Session = Depends(get_db),
):
    db_presupuesto_object = get_presupuesto_by_id(db, presupuesto_id=presupuesto_id)
    if not db_presupuesto_object:
        raise HTTPException(status_code=404, detail="Presupuesto not found")
    if not db_presupuesto_object.historial:
        db_presupuesto_object.historial = []
    aux = db_presupuesto_object.historial.copy()
    presupuesto_aux = presupuesto.copy()
    if presupuesto.fecha_adquisicion:
        presupuesto_aux.fecha_adquisicion = f'{presupuesto.fecha_adquisicion}'
    aux.append(presupuesto_aux.dict(exclude_unset=True))
    presupuesto.historial = aux
    update_data = presupuesto.dict(exclude_unset=True)
    result = patch_presupuesto(db, db_presupuesto_object, update_data)
    return result
