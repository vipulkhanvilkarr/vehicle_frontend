import React from "react";

interface Props {
  label: string;
  icon?: string;
  link: string;
  isSelected: boolean;
  onSelect: (options: { type: "main"; link: string }) => void;
}

const MainOptionSidebar: React.FC<Props> = ({ label, icon, link, isSelected, onSelect }) => (
  <button
    className={`sidebar-main-option${isSelected ? " selected" : ""}`}
    onClick={() => onSelect({ type: "main", link })}
    style={{
      width: "100%",
      textAlign: "left",
      padding: "12px 20px",
      background: isSelected ? "#2980b9" : "none",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      fontWeight: 500,
      cursor: "pointer",
      marginBottom: 4,
      fontSize: 16,
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}
  >
    {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
    {label}
  </button>
);

export default MainOptionSidebar;
