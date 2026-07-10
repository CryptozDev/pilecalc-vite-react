const ResultCard = ({ result }) => {
  if (!result) {
    return (
      <aside className="card result-card empty-result">
        <p className="result-eyebrow">Result</p>
        <h2>ยังไม่ได้คำนวณ</h2>
        <p>กรอกข้อมูล แล้วกดปุ่ม “คำนวณ” เพื่อดูค่า S และค่ารวม 10 ครั้งสุดท้าย</p>
      </aside>
    )
  }

  return (
    <aside className="card result-card">
      <p className="result-eyebrow">Result</p>
      <h2>{result.title}</h2>

      <div className="main-result">
        <span>ค่า S</span>
        <strong>{result.S}</strong>
        <span>{result.unit}</span>
      </div>

      <div className="conclusion-box">
        <strong>สรุปผล</strong>
        <p>{result.conclusion}</p>
      </div>

      <div className="result-list">
        <div>
          <span>Qu</span>
          <strong>{result.Qu} ตัน</strong>
        </div>
        {result.C !== undefined && (
          <div>
            <span>C</span>
            <strong>{result.C}</strong>
          </div>
        )}
        <div>
          <span>ค่าทรุดรวม 10 ครั้ง</span>
          <strong>{result.lastTenBlowSet ?? '-'} ซม.</strong>
        </div>
        {result.Cd !== undefined && (
          <div>
            <span>Cd</span>
            <strong>{result.Cd}</strong>
          </div>
        )}
        {result.Ku !== undefined && (
          <div>
            <span>Ku</span>
            <strong>{result.Ku}</strong>
          </div>
        )}
      </div>

      <div className="formula-box">
        <p>{result.formula}</p>
        <p>{result.rearranged}</p>
      </div>

      <p className="note">{result.note}</p>
    </aside>
  )
}

export default ResultCard
