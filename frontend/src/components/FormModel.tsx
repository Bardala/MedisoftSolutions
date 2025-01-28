import React, { useState } from "react";

interface FormModalProps<T> {
  objectToEdit: T;
  onSave: (updatedObject: T) => void;
  onClose: () => void;
  title: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormModal = <T extends Record<string, any>>({
  objectToEdit,
  onSave,
  onClose,
  title,
}: FormModalProps<T>) => {
  const [formData, setFormData] = useState<T>(objectToEdit);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (key: keyof T, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div>
      <div>
        <h2>{title}</h2>
        <form>
          {Object.keys(objectToEdit).map((key) => (
            <div className="mb-4" key={key}>
              <label>{key}</label>
              <input
                type="text"
                value={formData[key] || ""}
                onChange={(e) => handleChange(key as keyof T, e.target.value)}
              />
            </div>
          ))}
        </form>
        <div>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
};
