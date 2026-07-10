const toNumber = (value) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

export const round = (number, digits = 3) => {
  if (!Number.isFinite(number)) return 0
  const factor = 10 ** digits
  return Math.round(number * factor) / factor
}

export const hammerTypeOptions = [
  {
    value: 'drop-hammer',
    label: 'ลูกตุ้มปล่อย / Drop Hammer (C = 0.9)',
    C: 0.9
  }
]

export const getHammerConstant = (hammerType) => {
  const selected = hammerTypeOptions.find((item) => item.value === hammerType)
  return selected?.C ?? 0.9
}

export const calculateEngineeringNews = (input) => {
  const W = toNumber(input.W) // ton
  const h = toNumber(input.h) // cm
  const Qa = toNumber(input.Qa) // ton, allowable bearing load
  const FS = toNumber(input.FS) // factor of safety
  const C = getHammerConstant(input.hammerType) // cm, 0.9 for drop hammer

  const Qu = Qa * FS
  const S = Qu > 0 ? (W * h) / Qu - 2.54 * C : 0
  const lastTenBlowSet = S * 10

  return {
    title: 'คำนวณระยะทรุดตัว',
    Qu: round(Qu),
    C,
    S: round(S),
    lastTenBlowSet: round(lastTenBlowSet),
    unit: 'ซม./ครั้ง',
    formula: 'Qu = Wh / (S + 2.54C)',
    rearranged: 'S = ((W × h) / Qu) - 2.54(C)',
    isValid: S > 0,
    conclusion: S > 0
      ? `ค่าเฉลี่ยจากการทรุดตัว 10 ครั้งสุดท้าย ต้องน้อยกว่า ${round(S)} ซม./ครั้ง หรือค่าทรุดรวม 10 ครั้งต้องไม่มากกว่า ${round(lastTenBlowSet)} ซม.`
      : 'ค่า S ติดลบหรือเป็นศูนย์ กรุณาตรวจสอบค่าที่กรอก',
    note: 'Qu มาจาก Qa × F.S. โดยค่า F.S. เริ่มต้นใช้ 4 และ C สำหรับลูกตุ้มปล่อยใช้ 0.9'
  }
}

const getJanbuDetail = ({ W, h, P, L, A, E, S }) => {
  const Cd = 0.75 + 0.15 * (P / W)
  const term = (W * h * L) / (A * E * S * S * Cd)
  const Ku = Cd * (1 + Math.sqrt(1 + term))
  const Qu = (W * h) / (Ku * S)

  return { Cd, term, Ku, Qu }
}

export const calculateJanbu = (input) => {
  const W = toNumber(input.W) // ton
  const h = toNumber(input.h) // cm
  const P = toNumber(input.P) // ton
  const L = toNumber(input.L) // cm
  const A = toNumber(input.A) // cm2
  const E = toNumber(input.E) // ton/cm2
  const Qa = toNumber(input.Qa) // ton
  const FS = toNumber(input.FS)

  const QuTarget = Qa * FS

  if (W <= 0 || h <= 0 || P <= 0 || L <= 0 || A <= 0 || E <= 0 || QuTarget <= 0) {
    return {
      title: 'Janbu Formula',
      Qu: round(QuTarget),
      S: 0,
      unit: 'ซม./ครั้ง',
      formula: 'Qu = Wh / (KuS)',
      rearranged: 'กรอกค่ามากกว่า 0 ให้ครบก่อนคำนวณ',
      isValid: false,
      conclusion: 'ข้อมูลยังไม่ครบ จึงยังสรุปค่า S ไม่ได้',
      note: 'ข้อมูลยังไม่ครบ'
    }
  }

  // หา S ด้วย Binary Search เพราะ S อยู่ทั้งนอกและในรากที่สอง
  let low = 0.000001
  let high = 100

  const f = (S) => getJanbuDetail({ W, h, P, L, A, E, S }).Qu - QuTarget

  while (f(high) > 0 && high < 100000) {
    high *= 2
  }

  for (let i = 0; i < 140; i += 1) {
    const mid = (low + high) / 2
    if (f(mid) > 0) low = mid
    else high = mid
  }

  const S = (low + high) / 2
  const detail = getJanbuDetail({ W, h, P, L, A, E, S })

  return {
    title: 'คำนวณการตอกเสาเข็ม',
    Qu: round(QuTarget),
    S: round(S),
    Cd: round(detail.Cd),
    Ku: round(detail.Ku),
    term: round(detail.term),
    lastTenBlowSet: round(S * 10),
    unit: 'ซม./ครั้ง',
    formula: 'Qu = Wh / (KuS)',
    rearranged: 'Ku = Cd(1 + √(1 + WhL / (AES²Cd))), Cd = 0.75 + 0.15(P/W)',
    isValid: S > 0,
    conclusion: `ค่าเฉลี่ยจากการทรุดตัว 10 ครั้งสุดท้าย ต้องน้อยกว่า ${round(S)} ซม./ครั้ง หรือค่าทรุดรวม 10 ครั้งต้องไม่มากกว่า ${round(S * 10)} ซม.`,
    note: 'ค่า Default ตั้งตามตัวอย่าง Janbu: W=3.5, h=60, P=2.0, L=2100, A=650, E=180, Qa=20, F.S.=4 จะได้ S ≈ 0.845 ซม./ครั้ง'
  }
}
