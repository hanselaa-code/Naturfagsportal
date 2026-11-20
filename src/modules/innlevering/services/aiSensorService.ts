import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  Schema,
} from 'firebase/ai';
import { firebaseApp } from '../../../core/firebase';
import type { AiAssessment, Assignment, GradingScale } from '../types';

const DEFAULT_AI_MODEL =
  (import.meta.env.VITE_AI_SENSOR_MODEL as string | undefined) ||
  'gemini-2.5-flash';

function buildScaleInstructions(scale: GradingScale): string {
  switch (scale) {
    case 'grades_1_6':
      return [
        'VURDERINGSSKALA: Finfordelt norsk karakterskala fra 1 til 6.',
        'Du SKAL sette `gradeLabel` til én av disse eksakte verdiene:',
        '"1", "1+", "2-", "2", "2+", "3-", "3", "3+", "4-", "4", "4+", "5-", "5", "5+", "6-", "6".',
        'Bruk norsk Vg1 Naturfag (NAT01-05) standard:',
        '- 1/1+: Svært lav kompetanse, besvarelsen svarer i liten grad på oppgaven.',
        '- 2-/2/2+: Lav kompetanse, noe faglig innhold men vesentlige mangler eller feil.',
        '- 3-/3/3+: Nokså god kompetanse, viser grunnleggende forståelse men mangler dybde eller presisjon.',
        '- 4-/4/4+: God kompetanse, solid faglig innhold og bruk av fagbegreper med noen forbedringsmuligheter.',
        '- 5-/5/5+: Meget god kompetanse, presis, velstrukturert og reflektert med god sammenheng.',
        '- 6-/6: Fremragende kompetanse, selvstendig, presis og nyansert på alle vurderingskriterier.',
        'Sett `numericScore` mellom 0 og 100 som korresponderer med karakteren (1≈15, 2≈32, 3≈50, 4≈68, 5≈84, 6≈96).',
      ].join('\n');

    case 'pass_fail':
      return [
        'VURDERINGSSKALA: Bestått / Ikke bestått.',
        'Du SKAL sette `gradeLabel` til enten eksakt "Bestått" eller "Ikke bestått".',
        '- "Bestått": Besvarelsen svarer på oppgaven og oppfyller de sentrale vurderingskriteriene på et akseptabelt Vg1-nivå.',
        '- "Ikke bestått": Besvarelsen er for ufullstendig, bommer på oppgaven, eller oppfyller ikke minstekravene i kriteriene.',
        'Sett `numericScore` mellom 0 og 100 (Ikke bestått: 0–49, Bestått: 50–100) for å vise faglig nivå.',
      ].join('\n');

    case 'achievement_levels':
      return [
        'VURDERINGSSKALA: Lav – Middels – Høy måloppnåelse.',
        'Du SKAL sette `gradeLabel` til én av disse eksakte verdiene:',
        '"Lav måloppnåelse", "Middels måloppnåelse", eller "Høy måloppnåelse".',
        '- "Lav måloppnåelse": Grunnleggende eller mangelfull forståelse av kriteriene (numericScore 15–45).',
        '- "Middels måloppnåelse": God og stort sett riktig forståelse, men kan utdype og presisere mer (numericScore 46–76).',
        '- "Høy måloppnåelse": Grundig, presis og selvstendig faglig fremstilling som oppfyller kriteriene svært godt (numericScore 77–100).',
      ].join('\n');
  }
}

const aiAssessmentSchema = Schema.object({
  properties: {
    gradeLabel: Schema.string({
      description:
        'Eksakt karakter eller vurderingsnivå i henhold til den valgte vurderingsskalaen.',
    }),
    numericScore: Schema.number({
      description: 'Normalisert faglig skår fra 0 til 100.',
    }),
    summary: Schema.string({
      description:
        'Profesjonell, konkret og konstruktiv helhetsvurdering på norsk (3–5 setninger).',
    }),
    strengths: Schema.array({
      items: Schema.string(),
      description: '2–4 konkrete faglige styrker i elevens besvarelse.',
    }),
    improvements: Schema.array({
      items: Schema.string(),
      description:
        '2–4 konkrete, handlingsrettede forbedringspunkter knyttet til oppgaven og vurderingskriteriene.',
    }),
    criteriaBreakdown: Schema.array({
      items: Schema.object({
        properties: {
          criterion: Schema.string({
            description: 'Kort navn/tekst på vurderingskriteriet.',
          }),
          status: Schema.enumString({
            enum: ['oppnadd', 'delvis', 'mangler'],
            description: 'I hvilken grad kriteriet er oppfylt.',
          }),
          comment: Schema.string({
            description: 'Kort faglig begrunnelse (1–2 setninger).',
          }),
        },
        required: ['criterion', 'status', 'comment'],
      }),
      description: 'Vurdering av hvert sentralt vurderingskriterium.',
    }),
  },
  required: [
    'gradeLabel',
    'numericScore',
    'summary',
    'strengths',
    'improvements',
    'criteriaBreakdown',
  ],
});

interface RawAiResponse {
  gradeLabel: string;
  numericScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  criteriaBreakdown: {
    criterion: string;
    status: 'oppnadd' | 'delvis' | 'mangler';
    comment: string;
  }[];
}

export async function evaluateSubmissionWithAI(params: {
  assignment: Assignment;
  answerText: string;
  studentName?: string;
}): Promise<AiAssessment> {
  const { assignment, answerText } = params;

  const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
  const model = getGenerativeModel(ai, {
    model: DEFAULT_AI_MODEL,
    generationConfig: {
      temperature: 0.25,
      responseMimeType: 'application/json',
      responseSchema: aiAssessmentSchema,
    },
    systemInstruction: [
      'Du er en erfaren, profesjonell og rettferdig norsk naturfagslærer og sensor for Vg1 (læreplan NAT01-05).',
      'Din oppgave er å vurdere en elevbesvarelse nøye og objektivt opp mot både oppgavebeskrivelsen og vurderingskriteriene.',
      'Vær faglig presis, tydelig, konstruktiv og oppmuntrende, men ikke gi for høy vurdering hvis besvarelsen er tynn, unøyaktig eller mangler sentrale fagbegreper.',
      'Skriv alltid på korrekt og naturlig norsk (bokmål).',
      buildScaleInstructions(assignment.gradingScale),
    ].join('\n\n'),
  });

  const prompt = [
    `OPPGAVETITTEL:\n${assignment.title}`,
    `OPPGAVEBESKRIVELSE:\n${assignment.description}`,
    `VURDERINGSKRITERIER:\n${assignment.criteria}`,
    `MINIMUMSKRAV TIL LENGDE: ${assignment.minWords} ord`,
    `ELEVENS BESVARELSE:\n${answerText}`,
    'Vurder besvarelsen grundig i henhold til vurderingskriteriene og den oppgitte vurderingsskalaen.',
  ].join('\n\n---\n\n');

  const result = await model.generateContent(prompt);
  const rawText = result.response.text();
  const parsed = JSON.parse(rawText) as RawAiResponse;

  const clampedScore = Math.max(
    0,
    Math.min(100, Math.round(Number(parsed.numericScore) || 0)),
  );

  return {
    gradingScale: assignment.gradingScale,
    gradeLabel: parsed.gradeLabel?.trim() || 'Vurdert',
    numericScore: clampedScore,
    summary: parsed.summary?.trim() || 'Besvarelsen er vurdert.',
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    improvements: Array.isArray(parsed.improvements)
      ? parsed.improvements
      : [],
    criteriaBreakdown: Array.isArray(parsed.criteriaBreakdown)
      ? parsed.criteriaBreakdown
      : [],
    evaluatedAt: new Date().toISOString(),
    modelUsed: DEFAULT_AI_MODEL,
  };
}
