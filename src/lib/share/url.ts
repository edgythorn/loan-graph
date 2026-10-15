import LZString from 'lz-string'
import type { LoanParams } from '@/types/loan'

/**
 * Сериализация LoanParams в сжатую строку для URL.
 * Date → UnixTime (ms), JSON → LZ → base64url.
 */
export function encodeParams(params: LoanParams): string {
  const packed = {
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
  return LZString.compressToEncodedURIComponent(JSON.stringify(packed))
}

/**
 * Обратная операция. Возвращает null, если строка битая.
 */
export function decodeParams(s: string): LoanParams | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(s)
    if (!json) return null
    const p = JSON.parse(json)
    return {
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
  } catch {
    return null
  }
}

/** Стабильный хэш параметров — для поиска дублей вкладок. */
export function paramsHash(params: LoanParams): string {
  return encodeParams(params)
}

/** Полный URL для шаринга. */
export function buildShareUrl(params: LoanParams): string {
  const base = window.location.origin + window.location.pathname
  return `${base}?c=${encodeParams(params)}`
}