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
  const selected = hammerTypeOptions.find(
    (item) => item.value === hammerType
  )

  return selected?.C ?? 0.9
}

/* =========================================================
   1. Engineering News Formula
   ========================================================= */

export const calculateEngineeringNews = (input) => {
  const W = toNumber(input.W) // น้ำหนักลูกตุ้ม ตัน
  const h = toNumber(input.h) // ระยะยกลูกตุ้ม ซม.
  const Qa = toNumber(input.Qa) // น้ำหนักบรรทุกที่ยอมให้ ตัน
  const FS = toNumber(input.FS) // Factor of Safety
  const C = getHammerConstant(input.hammerType)

  const Qu = Qa * FS
  const S = Qu > 0 ? (W * h) / Qu - 2.54 * C : 0
  const lastTenBlowSet = S * 10

  return {
    type: 'engineering',
    title: 'Engineering News Formula',

    mainLabel: 'ค่า S',
    mainValue: round(S),
    mainUnit: 'ซม./ครั้ง',

    Qu: round(Qu),
    C: round(C),
    S: round(S),
    lastTenBlowSet: round(lastTenBlowSet),

    unit: 'ซม./ครั้ง',
    formula: 'Qu = Wh / (S + 2.54C)',
    rearranged: 'S = ((W × h) / Qu) - 2.54C',

    isValid: S > 0,

    conclusion:
      S > 0
        ? `ค่าเฉลี่ยการทรุดตัวต้องไม่มากกว่า ${round(
            S
          )} ซม./ครั้ง หรือค่าทรุดรวม 10 ครั้งต้องไม่มากกว่า ${round(
            lastTenBlowSet
          )} ซม.`
        : 'ค่า S ติดลบหรือเป็นศูนย์ กรุณาตรวจสอบค่าที่กรอก',

    note:
      'Qu คำนวณจาก Qa × F.S. และ C ของลูกตุ้มปล่อยกำหนดเป็น 0.9'
  }
}

/* =========================================================
   2. Janbu Formula
   ========================================================= */

const getJanbuDetail = ({ W, h, P, L, A, E, S }) => {
  const Cd = 0.75 + 0.15 * (P / W)

  const term =
    (W * h * L) /
    (A * E * S * S * Cd)

  const Ku =
    Cd *
    (1 + Math.sqrt(1 + term))

  const Qu =
    (W * h) /
    (Ku * S)

  return {
    Cd,
    term,
    Ku,
    Qu
  }
}

export const calculateJanbu = (input) => {
  const W = toNumber(input.W)
  const h = toNumber(input.h)
  const P = toNumber(input.P)
  const L = toNumber(input.L)
  const A = toNumber(input.A)
  const E = toNumber(input.E)
  const Qa = toNumber(input.Qa)
  const FS = toNumber(input.FS)

  const QuTarget = Qa * FS

  const isInputValid =
    W > 0 &&
    h > 0 &&
    P > 0 &&
    L > 0 &&
    A > 0 &&
    E > 0 &&
    Qa > 0 &&
    FS > 0

  if (!isInputValid) {
    return {
      type: 'janbu',
      title: 'Janbu Formula',

      mainLabel: 'ค่า S',
      mainValue: 0,
      mainUnit: 'ซม./ครั้ง',

      Qu: round(QuTarget),
      S: 0,
      lastTenBlowSet: 0,

      unit: 'ซม./ครั้ง',
      formula: 'Qu = Wh / (KuS)',
      rearranged: 'กรุณากรอกค่ามากกว่า 0 ให้ครบทุกช่อง',

      isValid: false,
      conclusion: 'ข้อมูลไม่ครบ จึงยังไม่สามารถคำนวณได้',
      note: 'ตรวจสอบค่าที่กรอกแล้วลองคำนวณอีกครั้ง'
    }
  }

  /*
    หา S ด้วย Binary Search
    เนื่องจาก S อยู่ทั้งนอกและภายในรากที่สอง
  */

  let low = 0.000001
  let high = 100

  const differenceFromTarget = (S) => {
    const detail = getJanbuDetail({
      W,
      h,
      P,
      L,
      A,
      E,
      S
    })

    return detail.Qu - QuTarget
  }

  while (
    differenceFromTarget(high) > 0 &&
    high < 100000
  ) {
    high *= 2
  }

  for (let i = 0; i < 140; i += 1) {
    const mid = (low + high) / 2

    if (differenceFromTarget(mid) > 0) {
      low = mid
    } else {
      high = mid
    }
  }

  const S = (low + high) / 2

  const detail = getJanbuDetail({
    W,
    h,
    P,
    L,
    A,
    E,
    S
  })

  const lastTenBlowSet = S * 10

  return {
    type: 'janbu',
    title: 'Janbu Formula',

    mainLabel: 'ค่า S',
    mainValue: round(S),
    mainUnit: 'ซม./ครั้ง',

    Qu: round(QuTarget),
    S: round(S),
    Cd: round(detail.Cd),
    Ku: round(detail.Ku),
    term: round(detail.term),
    lastTenBlowSet: round(lastTenBlowSet),

    unit: 'ซม./ครั้ง',
    formula: 'Qu = Wh / (KuS)',
    rearranged:
      'Ku = Cd(1 + √(1 + WhL / (AES²Cd))) และ Cd = 0.75 + 0.15(P/W)',

    isValid: S > 0,

    conclusion: `ค่าเฉลี่ยการทรุดตัวต้องไม่มากกว่า ${round(
      S
    )} ซม./ครั้ง หรือค่าทรุดรวม 10 ครั้งต้องไม่มากกว่า ${round(
      lastTenBlowSet
    )} ซม.`,

    note:
      'ระบบใช้ Binary Search เพื่อหาค่า S ที่ทำให้ Qu เท่ากับ Qa × F.S.'
  }
}

/* =========================================================
   3. Hiley's Formula
   ========================================================= */

/*
  สูตรจากรูป

  Qu = eWhZ / (S + C/2)

  e = (W + Pr²) / (W + P)

  C = C1 + C2 + C3

  C1 = 1.80QuL2 / A
  C2 = 0.720QuL / A
  C3 = 3.60Qu / A

  เนื่องจาก C มี Qu อยู่ภายใน
  จึงต้องแก้สมการเพื่อหา Qu
*/

const getHileyDetail = ({
  W,
  P,
  h,
  S,
  r,
  Z,
  L,
  L2,
  A,
  Qu
}) => {
  const e =
    (W + P * r * r) /
    (W + P)

  const C1 =
    (1.8 * Qu * L2) /
    A

  const C2 =
    (0.72 * Qu * L) /
    A

  const C3 =
    (3.6 * Qu) /
    A

  const C = C1 + C2 + C3

  const calculatedQu =
    (e * W * h * Z) /
    (S + C / 2)

  return {
    e,
    C1,
    C2,
    C3,
    C,
    calculatedQu
  }
}

export const calculateHiley = (input) => {
  const W = toNumber(input.W) // น้ำหนักลูกตุ้ม ตัน
  const P = toNumber(input.P) // น้ำหนักเสาเข็ม ตัน
  const h = toNumber(input.h) // ระยะยกลูกตุ้ม ซม.
  const S = toNumber(input.S) // ระยะทรุดต่อครั้ง ซม.
  const r = toNumber(input.r) // สัมประสิทธิ์การคืนตัว
  const Z = toNumber(input.Z) // ประสิทธิภาพลูกตุ้ม
  const L = toNumber(input.L) // ความยาวเสาเข็ม
  const L2 = toNumber(input.L2) // ความยาวหมอนรอง
  const A = toNumber(input.A) // พื้นที่หน้าตัด
  const FS = toNumber(input.FS) // Factor of Safety

  const isInputValid =
    W > 0 &&
    P >= 0 &&
    h > 0 &&
    S > 0 &&
    r >= 0 &&
    Z > 0 &&
    L > 0 &&
    L2 >= 0 &&
    A > 0 &&
    FS > 0

  if (!isInputValid) {
    return {
      type: 'hiley',
      title: "Hiley's Formula",

      mainLabel: 'ค่า Qu',
      mainValue: 0,
      mainUnit: 'ตัน',

      Qu: 0,
      Qa: 0,
      S: round(S),

      formula: 'Qu = eWhZ / (S + C/2)',
      rearranged: 'กรุณากรอกค่าที่ถูกต้องให้ครบทุกช่อง',

      isValid: false,
      conclusion: 'ข้อมูลไม่ครบ จึงยังไม่สามารถคำนวณได้',
      note:
        'W, h, S, Z, L, A และ F.S. ต้องมีค่ามากกว่า 0'
    }
  }

  /*
    ค่า Qu อยู่ทั้งด้านซ้ายและอยู่ในค่า C
    จึงหา Qu ด้วย Binary Search
  */

  const numerator =
    ((W + P * r * r) / (W + P)) *
    W *
    h *
    Z

  let low = 0
  let high = Math.max(numerator / S, 1)

  const difference = (Qu) => {
    const detail = getHileyDetail({
      W,
      P,
      h,
      S,
      r,
      Z,
      L,
      L2,
      A,
      Qu
    })

    return detail.calculatedQu - Qu
  }

  while (
    difference(high) > 0 &&
    high < 100000000
  ) {
    high *= 2
  }

  for (let i = 0; i < 160; i += 1) {
    const mid = (low + high) / 2

    if (difference(mid) > 0) {
      low = mid
    } else {
      high = mid
    }
  }

  const Qu = (low + high) / 2

  const detail = getHileyDetail({
    W,
    P,
    h,
    S,
    r,
    Z,
    L,
    L2,
    A,
    Qu
  })

  const Qa = Qu / FS
  const lastTenBlowSet = S * 10

  return {
    type: 'hiley',
    title: "Hiley's Formula",

    mainLabel: 'ค่า Qu',
    mainValue: round(Qu),
    mainUnit: 'ตัน',

    Qu: round(Qu),
    Qa: round(Qa),
    S: round(S),

    e: round(detail.e),
    C1: round(detail.C1),
    C2: round(detail.C2),
    C3: round(detail.C3),
    C: round(detail.C),

    FS: round(FS),
    lastTenBlowSet: round(lastTenBlowSet),

    formula: 'Qu = eWhZ / (S + C/2)',
    rearranged:
      'e = (W + Pr²) / (W + P), C = C1 + C2 + C3',

    isValid: Qu > 0,

    conclusion:
      `กำลังรับน้ำหนักสูงสุด Qu เท่ากับ ${round(
        Qu
      )} ตัน และกำลังรับน้ำหนักที่ยอมให้ Qa เท่ากับ ${round(
        Qa
      )} ตัน เมื่อใช้ F.S. = ${round(FS)}`,

    note:
      'สูตร Hiley แนะนำให้ใช้ F.S. = 4 โดยค่าคงที่ C1, C2 และ C3 คำนวณตามสูตรในเอกสารที่แนบมา'
  }
}