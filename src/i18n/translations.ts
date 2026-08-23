import { Language } from "../types/common";

import enLocale from "../locales/en.json";
import hiLocale from "../locales/hi.json";
import mrLocale from "../locales/mr.json";
import bnLocale from "../locales/bn.json";
import teLocale from "../locales/te.json";
import taLocale from "../locales/ta.json";
import guLocale from "../locales/gu.json";
import urLocale from "../locales/ur.json";
import knLocale from "../locales/kn.json";
import orLocale from "../locales/or.json";
import mlLocale from "../locales/ml.json";
import paLocale from "../locales/pa.json";
import asLocale from "../locales/as.json";
import maiLocale from "../locales/mai.json";
import saLocale from "../locales/sa.json";
import kokLocale from "../locales/kok.json";
import neLocale from "../locales/ne.json";
import sdLocale from "../locales/sd.json";
import ksLocale from "../locales/ks.json";
import doiLocale from "../locales/doi.json";
import mniLocale from "../locales/mni.json";
import brxLocale from "../locales/brx.json";
import satLocale from "../locales/sat.json";

export type TranslationKey = keyof typeof enLocale;
export type Translations = typeof enLocale;

export const translations: Record<Language, Translations> = {
  "en": enLocale,
  "hi": hiLocale,
  "mr": mrLocale,
  "bn": bnLocale,
  "te": teLocale,
  "ta": taLocale,
  "gu": guLocale,
  "ur": urLocale,
  "kn": knLocale,
  "or": orLocale,
  "ml": mlLocale,
  "pa": paLocale,
  "as": asLocale,
  "mai": maiLocale,
  "sa": saLocale,
  "kok": kokLocale,
  "ne": neLocale,
  "sd": sdLocale,
  "ks": ksLocale,
  "doi": doiLocale,
  "mni": mniLocale,
  "brx": brxLocale,
  "sat": satLocale,
};
