import Select from "react-select";

const StudentSelect = ({ students = [], value, onChange }) => {
  const options = students.map((s) => ({
    value: s._id,
    label: `${s.studentNo} | ${s.lastName}, ${s.firstName} (${s.email})`,
  }));

  return (
    <Select
      options={options}
      value={options.find((opt) => opt.value === value) || null}
      onChange={(opt) => onChange(opt.value)}
      placeholder="Search student..."
      isSearchable
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#009150",
          boxShadow: "none",
          "&:hover": { borderColor: "#009150" },
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? "#e6f4ea" : "white",
          color: "#333",
        }),
      }}
    />
  );
};


const inputStyle = {
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
  width: "100%",
};

export default StudentSelect;
