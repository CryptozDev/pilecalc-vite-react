const NumberInput = ({ label, value, onChange, unit, helper }) => {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <div className="input-row">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="0"
        />
        {unit && <span className="unit">{unit}</span>}
      </div>
      {helper && <small>{helper}</small>}
    </label>
  )
}

export default NumberInput
