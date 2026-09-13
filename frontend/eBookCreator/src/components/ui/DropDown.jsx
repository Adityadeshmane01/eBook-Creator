import { useEffect, useRef, useState } from "react";

const DropDown = ({ trigger, children, align = "right" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div onClick={() => setIsOpen((current) => !current)}>{trigger}</div>
      {isOpen && (
        <div className={`absolute z-30 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl ${align === "left" ? "left-0" : "right-0"}`} role="menu">
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ children, onClick, danger = false }) => (
  <button type="button" onClick={onClick} className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm ${danger ? "text-red-600 hover:bg-red-50" : "text-gray-700 hover:bg-gray-50"}`} role="menuitem">
    {children}
  </button>
);

export default DropDown;
