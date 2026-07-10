const SelectInput = ({ label, value, onChange, options, helper }) => {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <div className="select-row">
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {helper && <small>{helper}</small>}
    </label>
  )
}

export default SelectInput
