

const PresetOption = ({name, activeTable, setActiveTable}: {name: string, activeTable: string, setActiveTable: (name: string) => void}) => {
    const isActive = activeTable == name;
    
    const unstyled = "font-poppins mb-2 cursor-pointer";
    const styled = "font-poppins mb-2 cursor-pointer text-blue-25 border-b-2 border-blue-25 active";
    const style = isActive ? styled : unstyled;

    
      return (
        <button data-testid={'preset-option-'+name.toLowerCase()} className={style} onClick={() => setActiveTable(name)}>{name}</button>
      );
        
};

export default PresetOption;
