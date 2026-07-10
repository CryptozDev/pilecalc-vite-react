import { useMemo, useState } from 'react'
import NumberInput from './components/NumberInput.jsx'
import SelectInput from './components/SelectInput.jsx'
import ResultCard from './components/ResultCard.jsx'
import { calculateEngineeringNews, calculateJanbu, hammerTypeOptions } from './formulas/pileFormulas.js'

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

function App() {
  const [activeFormula, setActiveFormula] = useState('engineering')
  const [engineeringInput, setEngineeringInput] = useState(engineeringDefault)
  const [janbuInput, setJanbuInput] = useState(janbuDefault)
  const [hasCalculated, setHasCalculated] = useState(false)

  const result = useMemo(() => {
    if (!hasCalculated) return null
    return activeFormula === 'engineering'
      ? calculateEngineeringNews(engineeringInput)
      : calculateJanbu(janbuInput)
  }, [activeFormula, engineeringInput, janbuInput, hasCalculated])

  const setEngineeringValue = (key, value) => {
    setEngineeringInput((prev) => ({ ...prev, [key]: value }))
  }

  const setJanbuValue = (key, value) => {
    setJanbuInput((prev) => ({ ...prev, [key]: value }))
  }

  const resetExample = () => {
    setEngineeringInput(engineeringDefault)
    setJanbuInput(janbuDefault)
    setHasCalculated(false)
  }

  return (
    <main className="app">
      <section className="hero">
        <div>
          <p className="badge">Project 1</p>
          <h1>คำนวณการตอกเสาเข็ม</h1>
          <p className="hero-text">
            คำนวณการตอกเสาเข็มเบื้องต้น ใส่สูตร คำนวณระยะทรุดตัว ตามข้อมูลล่าสุด
          </p>
        </div>
      </section>

      <section className="grid-layout">
        <section className="card form-card">
          <div className="tabs">
            <button
              className={activeFormula === 'engineering' ? 'active' : ''}
              onClick={() => {
                setActiveFormula('engineering')
                setHasCalculated(false)
              }}
            >
              คำนวณระยะทรุดตัว
            </button>
            <button
              className={activeFormula === 'janbu' ? 'active' : ''}
              onClick={() => {
                setActiveFormula('janbu')
                setHasCalculated(false)
              }}
            >
              คำนวณการตอกเสาเข็ม
            </button>
          </div>

          <div className="section-title">
            <h2>กรอกข้อมูล</h2>
            <p>ตั้งค่าเริ่มต้นตามตัวอย่างในรูปแล้ว สามารถแก้ค่าเพื่อทดลองคำนวณได้</p>
          </div>

          {activeFormula === 'engineering' ? (
            <div className="input-grid">
              <NumberInput label="W น้ำหนักลูกตุ้ม" unit="ตัน" value={engineeringInput.W} onChange={(v) => setEngineeringValue('W', v)} />
              <NumberInput label="h ระยะยกลูกตุ้ม" unit="ซม." value={engineeringInput.h} onChange={(v) => setEngineeringValue('h', v)} />
              <NumberInput label="Qa Working Load" unit="ตัน" value={engineeringInput.Qa} onChange={(v) => setEngineeringValue('Qa', v)} />
              <NumberInput label="F.S. Factor of Safety" unit="เท่า" value={engineeringInput.FS} onChange={(v) => setEngineeringValue('FS', v)} helper="ตอนนี้ตั้งค่าเริ่มต้นเป็น 4 และแก้ได้ภายหลัง" />
              <SelectInput
                label="C ประเภทของลูกตุ้ม"
                value={engineeringInput.hammerType}
                onChange={(v) => setEngineeringValue('hammerType', v)}
                options={hammerTypeOptions}
                helper="ตอนนี้มีตัวเลือก Drop Hammer ก่อน ค่า C = 0.9"
              />
            </div>
          ) : (
            <div className="input-grid">
              <NumberInput label="W น้ำหนักลูกตุ้ม" unit="ตัน" value={janbuInput.W} onChange={(v) => setJanbuValue('W', v)} />
              <NumberInput label="h ระยะยกลูกตุ้ม" unit="ซม." value={janbuInput.h} onChange={(v) => setJanbuValue('h', v)} />
              <NumberInput label="P น้ำหนักเสาเข็ม" unit="ตัน" value={janbuInput.P} onChange={(v) => setJanbuValue('P', v)} />
              <NumberInput label="L ความยาวเสาเข็ม" unit="ซม." value={janbuInput.L} onChange={(v) => setJanbuValue('L', v)} />
              <NumberInput label="A พื้นที่หน้าตัด" unit="ตร.ซม." value={janbuInput.A} onChange={(v) => setJanbuValue('A', v)} />
              <NumberInput label="E Elastic Modulus" unit="ตัน/ตร.ซม." value={janbuInput.E} onChange={(v) => setJanbuValue('E', v)} />
              <NumberInput label="Qa Working Load" unit="ตัน" value={janbuInput.Qa} onChange={(v) => setJanbuValue('Qa', v)} />
              <NumberInput label="F.S. Factor of Safety" unit="เท่า" value={janbuInput.FS} onChange={(v) => setJanbuValue('FS', v)} />
            </div>
          )}

          <div className="actions">
            <button className="primary" onClick={() => setHasCalculated(true)}>คำนวณ</button>
            <button className="secondary" onClick={resetExample}>รีเซ็ตค่าตัวอย่าง</button>
          </div>
        </section>

        <ResultCard result={result} />
      </section>

      <section className="warning-card">
        <strong>หมายเหตุ</strong>
        <p>
          ผลลัพธ์นี้ใช้เพื่อการศึกษาและประเมินเบื้องต้นเท่านั้น ไม่ควรใช้แทนการออกแบบ ตรวจสอบ หรืออนุมัติงานจริงโดยวิศวกรผู้มีใบอนุญาต
        </p>
      </section>
    </main>
  )
}

export default App
