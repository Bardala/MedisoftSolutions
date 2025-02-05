import React, { useState, useEffect } from "react";
import { Patient, Payment } from "../types";

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
  const determineEditableFields = (obj: T) => {
    if ("fullName" in obj) {
      const { id, createdAt, ...rest } = obj as unknown as Patient;
      return rest;
    } else if ("amount" in obj) {
      const { id, createdAt, patient, recordedBy, ...rest } =
        obj as unknown as Payment;
      return rest;
    } else {
      return obj;
    }
  };

  const [formData, setFormData] = useState<T>(objectToEdit as T);

  useEffect(() => {
    const editedObject = determineEditableFields(objectToEdit);
    setFormData(editedObject as T);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectToEdit]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (key: keyof T, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    // Include all properties in the submitted object
    onSave({ ...objectToEdit, ...formData });
    onClose();
  };

  return (
    <div>
      <div>
        <h2>{title}</h2>
        <form>
          {Object.keys(formData).map((key) => (
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
