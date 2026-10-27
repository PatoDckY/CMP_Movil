
export interface OptOutPreferencesDto {
  nonEssentialCommunications: boolean;
  analytics: boolean;
  shareProgress: boolean;
}

export interface OptOutPreferencesResponseDto {
  preferences: OptOutPreferencesDto;
  // null cuando el usuario aún no ha guardado preferencias.
  updatedAt: string | null;
}

// El backend exige exactamente las tres banderas booleanas.
export type UpdateOptOutPreferencesRequestDto = OptOutPreferencesDto;
