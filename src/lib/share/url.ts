import LZString from 'lz-string'
import type { LoanParams } from '@/types/loan'

export interface DecodedShare {
  params: LoanParams
  name?: string
}

/** Дефолтный паттерн имени — «Расчет N». Такие имена не шарим. */
const DEFAULT_NAME_RE = /^Расчет \d+$/

function isCustomName(name: string): boolean {
  return !!name && !DEFAULT_NAME_RE.test(name)
}

export function encodeParams(params: LoanParams, name?: string): string {
  const packed: Record<string, unknown> = {
    a: params.amount,
    r: params.rate,
    tm: params.termMode,
    t: params.termMonths,
    fp: params.firstPaymentDate.getTime(),
    em: params.earlyMode,
    oa: params.onceAmount,
    om: params.onceMonth,
    ap: params.actualPayment,
    s: params.strategy,
  }
  if (name && isCustomName(name)) {
    packed.n = name
  }
  return LZString.compressToEncodedURIComponent(JSON.stringify(packed))
}

export function decodeParams(s: string): DecodedShare | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(s)
    if (!json) return null
    const p = JSON.parse(json)
    const params: LoanParams = {
      amount: Number(p.a) || 0,
      rate: Number(p.r) || 0,
      termMode: p.tm ?? 'months',
      termMonths: Number(p.t) || 1,
      firstPaymentDate: new Date(Number(p.fp) || Date.now()),
      earlyMode: p.em ?? 'none',
      onceAmount: Number(p.oa) || 0,
      onceMonth: Number(p.om) || 1,
      actualPayment: p.ap != null ? Number(p.ap) : undefined,
      strategy: p.s ?? 'reducePayment',
    }
    return {
      params,
      name: typeof p.n === 'string' ? p.n : undefined,
    }
  } catch {
    return null
  }
}

/** Стабильный хэш параметров — для поиска дублей вкладок. */
export function paramsHash(params: LoanParams): string {
  return encodeParams(params)
}

/** Полный URL для шаринга. */
export function buildShareUrl(params: LoanParams, name?: string): string {
  const base = window.location.origin + window.location.pathname
  return `${base}?c=${encodeParams(params, name)}`
}