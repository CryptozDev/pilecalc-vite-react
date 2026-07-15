const ResultRow = ({ label, value, unit = '' }) => {
  if (
    value === undefined ||
    value === null
  ) {
    return null
  }

  return (
    <div>
      <span>{label}</span>

      <strong>
        {value}
        {unit ? ` ${unit}` : ''}
      </strong>
    </div>
  )
}

const ResultCard = ({ result }) => {
  if (!result) {
    return (
      <aside className="card result-card empty-result">
        <p className="result-eyebrow">
          Result
        </p>

        <h2>ยังไม่ได้คำนวณ</h2>

        <p>
          กรอกข้อมูลให้ครบ แล้วกดปุ่ม
          “คำนวณ” เพื่อดูผลลัพธ์
        </p>
      </aside>
    )
  }

  return (
    <aside className="card result-card">
      <p className="result-eyebrow">
        Result
      </p>

      <h2>{result.title}</h2>

      <div className="main-result">
        <span>
          {result.mainLabel ?? 'ค่า S'}
        </span>

        <strong>
          {result.mainValue ?? result.S}
        </strong>

        <span>
          {result.mainUnit ?? result.unit}
        </span>
      </div>

      <div className="conclusion-box">
        <strong>สรุปผล</strong>
        <p>{result.conclusion}</p>
      </div>

      <div className="result-list">
        <ResultRow
          label="Qu กำลังรับน้ำหนักสูงสุด"
          value={result.Qu}
          unit="ตัน"
        />

        <ResultRow
          label="Qa กำลังรับน้ำหนักที่ยอมให้"
          value={result.Qa}
          unit="ตัน"
        />

        <ResultRow
          label="S ระยะทรุดตัว"
          value={result.S}
          unit="ซม./ครั้ง"
        />

        <ResultRow
          label="ค่าทรุดรวม 10 ครั้ง"
          value={result.lastTenBlowSet}
          unit="ซม."
        />

        <ResultRow
          label="C"
          value={result.C}
        />

        <ResultRow
          label="Cd"
          value={result.Cd}
        />

        <ResultRow
          label="Ku"
          value={result.Ku}
        />

        <ResultRow
          label="e ประสิทธิผลการกระแทก"
          value={result.e}
        />

        <ResultRow
          label="C₁ การยุบตัวหมอนรอง"
          value={result.C1}
          unit="ซม."
        />

        <ResultRow
          label="C₂ การยุบตัวเสาเข็ม"
          value={result.C2}
          unit="ซม."
        />

        <ResultRow
          label="C₃ การยุบตัวของดิน"
          value={result.C3}
          unit="ซม."
        />

        <ResultRow
          label="F.S."
          value={result.FS}
        />
      </div>

      <div className="formula-box">
        <p>{result.formula}</p>
        <p>{result.rearranged}</p>
      </div>

      <p className="note">
        {result.note}
      </p>
    </aside>
  )
}

export default ResultCard