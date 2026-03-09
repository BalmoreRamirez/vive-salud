export interface SpiritualVerse {
  dayIndex: number;
  text: string;
  reference: string;
}

export const SPIRITUAL_VERSES: SpiritualVerse[] = [
  {
    dayIndex: 0,
    text: 'Este es un día para alegrarte, agradecer y empezar con esperanza.',
    reference: 'Salmo 118:24 (paráfrasis)',
  },
  {
    dayIndex: 1,
    text: 'Confía tu camino a Dios, y da pasos firmes con fe.',
    reference: 'Salmo 37:5 (paráfrasis)',
  },
  {
    dayIndex: 2,
    text: 'Busca primero lo eterno, y lo demás encontrará su lugar.',
    reference: 'Mateo 6:33 (paráfrasis)',
  },
  {
    dayIndex: 3,
    text: 'No temas, camina con valentía porque no estás solo.',
    reference: 'Isaías 41:10 (paráfrasis)',
  },
  {
    dayIndex: 4,
    text: 'Tu paz puede guardar hoy tu mente y tu corazón.',
    reference: 'Filipenses 4:7 (paráfrasis)',
  },
  {
    dayIndex: 5,
    text: 'Ama con hechos, sirve con humildad y comparte bondad.',
    reference: 'Juan 13:34 (paráfrasis)',
  },
  {
    dayIndex: 6,
    text: 'Renueva tus fuerzas en silencio, oración y gratitud.',
    reference: 'Isaías 40:31 (paráfrasis)',
  },
];

export function getSpiritualVerseOfDay(date = new Date()): SpiritualVerse {
  const dayIndex = date.getDay();
  return SPIRITUAL_VERSES.find((item) => item.dayIndex === dayIndex) ?? SPIRITUAL_VERSES[0];
}
