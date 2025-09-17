
import React from 'react';

interface ToggleSwitchProps {
  isChecked: boolean;
  onChange: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isChecked, onChange }) => {
  return (
    <div className="flex items-center space-x-3">
      <span className={`font-medium transition-colors duration-300 ${!isChecked ? 'text-accent' : 'text-text-secondary'}`}>
        Manual Mode
      </span>
      <label htmlFor="toggle" className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" id="toggle" className="sr-only peer" checked={isChecked} onChange={onChange} />
        <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
      </label>
      <span className={`font-medium transition-colors duration-300 ${isChecked ? 'text-accent' : 'text-text-secondary'}`}>
        AI Mode
      </span>
    </div>
  );
};

export default ToggleSwitch;
