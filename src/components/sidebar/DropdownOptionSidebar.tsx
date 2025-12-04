import React from "react";
import { Link } from "react-router-dom";
import { DownArrow, SubmenuArrow } from "../sidebar/SubmenuSvg";

interface SubItem {
  label: string;
  link: string;
  type: "sub";
}

interface DropdownSelectOptions {
  type: "dropdown";
  label: string;
}

interface SubSelectOptions {
  type: "sub";
  link: string;
  label: string;
}

interface DropdownOptionSidebarProps {
  label: string;
  icon: React.FC;
  subItems?: SubItem[];
  selected: string | null;
  onSelect: (options: DropdownSelectOptions | SubSelectOptions) => void;
  isOpen: boolean;
}

const DropdownOptionSidebar: React.FC<DropdownOptionSidebarProps> = ({
  label,
  icon: Icon,
  subItems,
  selected,
  onSelect,
  isOpen,
}) => {
  const handleSubItemClick = (link: string) => {
    onSelect({ type: "sub", label, link });
  };

  return (
    <div>
      <div
        className={`sidebar-item ${isOpen ? "sidebar-item-dropped" : ""}`}
        onClick={() => onSelect({ type: "dropdown", label })}
      >
        <div className="sidebar-main-item">
          <div className="sidebar-icon">
            <Icon />
          </div>
          <div>
            <div className="sidebar-main-item">{label}</div>
          </div>
        </div>
        <div>
          <DownArrow />
        </div>
      </div>
      {isOpen &&
        subItems?.map((subItem, index) => (
          <Link
            key={index}
            to={subItem.link}
            className={`sidebar-item ${
              selected === subItem.link ? "sidebar-item-selected" : ""
            }`}
            onClick={() => handleSubItemClick(subItem.link)}
          >
            <div className="sidebar-sub-item">
              <SubmenuArrow />
              {subItem.label}
            </div>
          </Link>
        ))}
    </div>
  );
};

export default DropdownOptionSidebar;
