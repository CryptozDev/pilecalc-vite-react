import { useMemo, useState } from 'react'
import NumberInput from './components/NumberInput.jsx'
import SelectInput from './components/SelectInput.jsx'
import ResultCard from './components/ResultCard.jsx'

import {
  calculateEngineeringNews,
  calculateJanbu,
  calculateHiley,
  hammerTypeOptions
} from './formulas/pileFormulas.js'

const engineeringDefault = {
  W: '3.5',
  h: '60',
  Qa: '20',
  FS: '4',
  hammerType: 'drop-hammer'
}

const janbuDefault = {
  W: '3.5',
  h: '60',
  P: '2.0',
  L: '2100',
  A: '650',
  E: '180',
  Qa: '20',
  FS: '4'
}

const hileyDefault = {
  W: '3.5',
  P: '2.0',
  h: '60',
  S: '0.5',
  r: '0.25',
  Z: '0.75',
  L: '2100',
  L2: '10',
  A: '650',
  FS: '4'
}

function App() {
  const [activeFormula, setActiveFormula] =
    useState('engineering')

  const [engineeringInput, setEngineeringInput] =
    useState(engineeringDefault)

  const [janbuInput, setJanbuInput] =
    useState(janbuDefault)

  const [hileyInput, setHileyInput] =
    useState(hileyDefault)

  const [hasCalculated, setHasCalculated] =
    useState(false)

  const result = useMemo(() => {
    if (!hasCalculated) {
      return null
    }

    if (activeFormula === 'engineering') {
      return calculateEngineeringNews(
        engineeringInput
      )
    }

    if (activeFormula === 'janbu') {
      return calculateJanbu(janbuInput)
    }

    if (activeFormula === 'hiley') {
      return calculateHiley(hileyInput)
    }

    return null
  }, [
    activeFormula,
    engineeringInput,
    janbuInput,
    hileyInput,
    hasCalculated
  ])

  const setEngineeringValue = (key, value) => {
    setEngineeringInput((previous) => ({
      ...previous,
      [key]: value
    }))
  }

  const setJanbuValue = (key, value) => {
    setJanbuInput((previous) => ({
      ...previous,
      [key]: value
    }))
  }

  const setHileyValue = (key, value) => {
    setHileyInput((previous) => ({
      ...previous,
      [key]: value
    }))
  }

  const changeFormula = (formulaName) => {
    setActiveFormula(formulaName)
    setHasCalculated(false)
  }

  const resetExample = () => {
    setEngineeringInput(engineeringDefault)
    setJanbuInput(janbuDefault)
    setHileyInput(hileyDefault)
    setHasCalculated(false)
  }

  return (
    <main className="app">
      <section className="hero">
        <div>
          <p className="badge">Project 1</p>

          <h1>คำนวณการตอกเสาเข็ม</h1>

          <p className="hero-text">
            โปรแกรมคำนวณแรงต้านทานและระยะทรุดตัวของเสาเข็ม
            ด้วยสูตร Engineering News, Janbu และ Hiley
          </p>
        </div>
      </section>

      <section className="grid-layout">
        <section className="card form-card">
          <div className="tabs">
            <button
              type="button"
              className={
                activeFormula === 'engineering'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                changeFormula('engineering')
              }
            >
              Engineering News
            </button>

            <button
              type="button"
              className={
                activeFormula === 'janbu'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                changeFormula('janbu')
              }
            >
              Janbu
            </button>

            <button
              type="button"
              className={
                activeFormula === 'hiley'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                changeFormula('hiley')
              }
            >
              Hiley
            </button>
          </div>

          <div className="section-title">
            <h2>กรอกข้อมูล</h2>

            <p>
              ระบบใส่ค่าตัวอย่างไว้แล้ว
              สามารถเปลี่ยนค่าเพื่อทดลองคำนวณได้
            </p>
          </div>

          {activeFormula === 'engineering' && (
            <div className="input-grid">
              <NumberInput
                label="W น้ำหนักลูกตุ้ม"
                unit="ตัน"
                value={engineeringInput.W}
                onChange={(value) =>
                  setEngineeringValue('W', value)
                }
              />

              <NumberInput
                label="h ระยะยกลูกตุ้ม"
                unit="ซม."
                value={engineeringInput.h}
                onChange={(value) =>
                  setEngineeringValue('h', value)
                }
              />

              <NumberInput
                label="Qa Working Load"
                unit="ตัน"
                value={engineeringInput.Qa}
                onChange={(value) =>
                  setEngineeringValue('Qa', value)
                }
              />

              <NumberInput
                label="F.S. Factor of Safety"
                unit="เท่า"
                value={engineeringInput.FS}
                onChange={(value) =>
                  setEngineeringValue('FS', value)
                }
                helper="กำหนดค่าเริ่มต้นเป็น 4"
              />

              <SelectInput
                label="C ประเภทของลูกตุ้ม"
                value={
                  engineeringInput.hammerType
                }
                onChange={(value) =>
                  setEngineeringValue(
                    'hammerType',
                    value
                  )
                }
                options={hammerTypeOptions}
                helper="ลูกตุ้มปล่อยกำหนด C = 0.9"
              />
            </div>
          )}

          {activeFormula === 'janbu' && (
            <div className="input-grid">
              <NumberInput
                label="W น้ำหนักลูกตุ้ม"
                unit="ตัน"
                value={janbuInput.W}
                onChange={(value) =>
                  setJanbuValue('W', value)
                }
              />

              <NumberInput
                label="h ระยะยกลูกตุ้ม"
                unit="ซม."
                value={janbuInput.h}
                onChange={(value) =>
                  setJanbuValue('h', value)
                }
              />

              <NumberInput
                label="P น้ำหนักเสาเข็ม"
                unit="ตัน"
                value={janbuInput.P}
                onChange={(value) =>
                  setJanbuValue('P', value)
                }
              />

              <NumberInput
                label="L ความยาวเสาเข็ม"
                unit="ซม."
                value={janbuInput.L}
                onChange={(value) =>
                  setJanbuValue('L', value)
                }
              />

              <NumberInput
                label="A พื้นที่หน้าตัด"
                unit="ตร.ซม."
                value={janbuInput.A}
                onChange={(value) =>
                  setJanbuValue('A', value)
                }
              />

              <NumberInput
                label="E Elastic Modulus"
                unit="ตัน/ตร.ซม."
                value={janbuInput.E}
                onChange={(value) =>
                  setJanbuValue('E', value)
                }
              />

              <NumberInput
                label="Qa Working Load"
                unit="ตัน"
                value={janbuInput.Qa}
                onChange={(value) =>
                  setJanbuValue('Qa', value)
                }
              />

              <NumberInput
                label="F.S. Factor of Safety"
                unit="เท่า"
                value={janbuInput.FS}
                onChange={(value) =>
                  setJanbuValue('FS', value)
                }
              />
            </div>
          )}

          {activeFormula === 'hiley' && (
            <div className="input-grid">
              <NumberInput
                label="W น้ำหนักลูกตุ้ม"
                unit="ตัน"
                value={hileyInput.W}
                onChange={(value) =>
                  setHileyValue('W', value)
                }
              />

              <NumberInput
                label="P น้ำหนักเสาเข็ม"
                unit="ตัน"
                value={hileyInput.P}
                onChange={(value) =>
                  setHileyValue('P', value)
                }
              />

              <NumberInput
                label="h ระยะยกลูกตุ้ม"
                unit="ซม."
                value={hileyInput.h}
                onChange={(value) =>
                  setHileyValue('h', value)
                }
              />

              <NumberInput
                label="S ระยะทรุดตัวต่อครั้ง"
                unit="ซม."
                value={hileyInput.S}
                onChange={(value) =>
                  setHileyValue('S', value)
                }
              />

              <NumberInput
                label="r สัมประสิทธิ์การคืนตัว"
                unit="-"
                value={hileyInput.r}
                onChange={(value) =>
                  setHileyValue('r', value)
                }
                helper="ค่าระหว่าง 0 ถึง 1"
              />

              <NumberInput
                label="Z ประสิทธิภาพลูกตุ้ม"
                unit="-"
                value={hileyInput.Z}
                onChange={(value) =>
                  setHileyValue('Z', value)
                }
                helper="ค่าระหว่าง 0 ถึง 1"
              />

              <NumberInput
                label="L ความยาวเสาเข็ม"
                unit="ซม."
                value={hileyInput.L}
                onChange={(value) =>
                  setHileyValue('L', value)
                }
              />

              <NumberInput
                label="L₂ ความยาวหมอนรอง"
                unit="ซม."
                value={hileyInput.L2}
                onChange={(value) =>
                  setHileyValue('L2', value)
                }
              />

              <NumberInput
                label="A พื้นที่หน้าตัด"
                unit="ตร.ซม."
                value={hileyInput.A}
                onChange={(value) =>
                  setHileyValue('A', value)
                }
              />

              <NumberInput
                label="F.S. Factor of Safety"
                unit="เท่า"
                value={hileyInput.FS}
                onChange={(value) =>
                  setHileyValue('FS', value)
                }
                helper="Hiley แนะนำให้ใช้ F.S. = 4"
              />
            </div>
          )}

          <div className="actions">
            <button
              type="button"
              className="primary"
              onClick={() =>
                setHasCalculated(true)
              }
            >
              คำนวณ
            </button>

            <button
              type="button"
              className="secondary"
              onClick={resetExample}
            >
              รีเซ็ตค่าตัวอย่าง
            </button>
          </div>
        </section>

        <ResultCard result={result} />
      </section>

      <section className="warning-card">
        <strong>หมายเหตุ</strong>

        <p>
          ผลลัพธ์ใช้เพื่อการศึกษาและประเมินเบื้องต้นเท่านั้น
          ไม่ควรใช้แทนการออกแบบ ตรวจสอบ
          หรืออนุมัติงานจริงโดยวิศวกรผู้มีใบอนุญาต
        </p>
      </section>
    </main>
  )
}

export default App