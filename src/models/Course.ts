export interface Course {
  idCurso: number;
  tituloCurso: string;
  descripcion: string | null;

  idInstructor: number;
  instructorNombre?: string | null;
  instructorEspecialidad?: string | null;

  idCategoria: number;
  categoriaNombre?: string | null;

  idUbicacion: number | null;
  ubicacionNombre?: string | null;
  ubicacionDireccion?: string | null;

  idModalidad: number;
  modalidadNombre?: string | null;

  fechaInicio: string;
  fechaFin: string;
  horario: string | null;
  dirigidoA: string | null;

  cupoMaximo: number;
  cuposOcupados: number | null;

  costo: string | null;
  urlImagenPortada: string | null;

  activo: boolean;

  createdAt?: string | null;
  updatedAt?: string | null;
}