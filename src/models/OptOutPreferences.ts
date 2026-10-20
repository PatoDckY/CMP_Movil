export const OPT_OUT_KEYS = [
  'nonEssentialCommunications',
  'analytics',
  'shareProgress',
] as const;

export type OptOutKey = (typeof OPT_OUT_KEYS)[number];

// true = el usuario ejerció su derecho de oposición para ese tratamiento.
export type OptOutPreferences = Record<OptOutKey, boolean>;

export const DEFAULT_OPT_OUT_PREFERENCES: OptOutPreferences = {
  nonEssentialCommunications: false,
  analytics: false,
  shareProgress: false,
};

export const OPT_OUT_OPTIONS: ReadonlyArray<{
  key: OptOutKey;
  title: string;
  description: string;
}> = [
  {
    key: 'nonEssentialCommunications',
    title: 'No usar mis datos para comunicaciones no esenciales',
    description:
      'No recibirás promociones ni mensajes informativos que no sean necesarios para tu cuenta.',
  },
  {
    key: 'analytics',
    title: 'No usar mis datos para analítica de uso',
    description:
      'Tu actividad no se usará para medir ni mejorar el servicio.',
  },
  {
    key: 'shareProgress',
    title: 'No compartir mi progreso con terceros',
    description:
      'Tu avance académico no se compartirá con terceros.',
  },
];

export function parseOptOutPreferences(value: unknown): OptOutPreferences {
  const source =
    typeof value === 'object' && value !== null
      ? (value as Record<string, unknown>)
      : {};
  return {
    nonEssentialCommunications: source.nonEssentialCommunications === true,
    analytics: source.analytics === true,
    shareProgress: source.shareProgress === true,
  };
}
