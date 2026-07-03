from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user, require_roles
from app.models.kebun import Kebun
from app.models.user import RoleEnum, User
from app.schemas.kebun_schema import KebunCreate, KebunResponse, KebunUpdate

router = APIRouter(prefix="/kebun", tags=["Kebun"])


@router.post("/", response_model=KebunResponse, status_code=status.HTTP_201_CREATED)
def create_kebun(
    payload: KebunCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(RoleEnum.petani)),
):
    """
    Daftarkan kebun baru milik petani yang sedang login.
    Wajib ada sebelum petani bisa membuat batch panen (lihat batch_router.create_batch).
    """
    kebun = Kebun(
        petani_id=current_user.id,
        nama_kebun=payload.nama_kebun,
        kecamatan=payload.kecamatan,
        varietas_nanas=payload.varietas_nanas,
        jenis_bibit=payload.jenis_bibit,
        jenis_pupuk=payload.jenis_pupuk,
        tanggal_tanam=payload.tanggal_tanam,
        latitude=payload.latitude,
        longitude=payload.longitude,
        luas_lahan_hektar=payload.luas_lahan_hektar,
    )
    db.add(kebun)
    db.commit()
    db.refresh(kebun)
    return kebun


@router.get("/", response_model=list[KebunResponse])
def list_kebun(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Daftar kebun. Petani hanya melihat kebun miliknya sendiri.
    Role lain (pengepul, eksportir, pabrik, dinas_pertanian) melihat semua kebun aktif.
    """
    query = db.query(Kebun).filter(Kebun.is_active == True)

    if current_user.role == RoleEnum.petani:
        query = query.filter(Kebun.petani_id == current_user.id)

    return query.order_by(Kebun.created_at.desc()).all()


@router.get("/{kebun_id}", response_model=KebunResponse)
def get_kebun(
    kebun_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Ambil detail satu kebun berdasarkan ID."""
    kebun = db.query(Kebun).filter(Kebun.id == kebun_id).first()
    if not kebun:
        raise HTTPException(status_code=404, detail="Kebun tidak ditemukan.")

    if current_user.role == RoleEnum.petani and kebun.petani_id != current_user.id:
        raise HTTPException(status_code=403, detail="Kebun ini bukan milik Anda.")

    return kebun


@router.patch("/{kebun_id}", response_model=KebunResponse)
def update_kebun(
    kebun_id: int,
    payload: KebunUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(RoleEnum.petani)),
):
    """Perbarui data kebun. Hanya pemilik kebun (petani) yang boleh mengubah."""
    kebun = db.query(Kebun).filter(Kebun.id == kebun_id).first()
    if not kebun:
        raise HTTPException(status_code=404, detail="Kebun tidak ditemukan.")

    if kebun.petani_id != current_user.id:
        raise HTTPException(status_code=403, detail="Kebun ini bukan milik Anda.")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(kebun, field, value)

    db.commit()
    db.refresh(kebun)
    return kebun


@router.delete("/{kebun_id}", status_code=status.HTTP_204_NO_CONTENT)
def deactivate_kebun(
    kebun_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(RoleEnum.petani)),
):
    """
    Nonaktifkan kebun (soft delete, bukan hapus permanen — supaya riwayat
    batch/traceability yang sudah terhubung ke kebun ini tetap utuh).
    """
    kebun = db.query(Kebun).filter(Kebun.id == kebun_id).first()
    if not kebun:
        raise HTTPException(status_code=404, detail="Kebun tidak ditemukan.")

    if kebun.petani_id != current_user.id:
        raise HTTPException(status_code=403, detail="Kebun ini bukan milik Anda.")

    kebun.is_active = False
    db.commit()
    return None
