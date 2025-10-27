import { Patient, Payment, Visit } from "@/shared/types";
import { isArabic } from "@/utils";
import { useState, useEffect } from "react";

interface FormModalProps<T> {
  objectToEdit: T;
  onSave: (updatedObject: T) => void;
  onClose: () => void;
  title: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormModal = <T extends Record<string, any>>({
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
      const { amount } = obj as unknown as Payment;
      return { amount };
    } else if ("reason" in obj) {
      const { reason, patientId, doctorId } = obj as unknown as Visit;
      return { reason, patientId, doctorId };
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
                className={isArabic(formData[key]) ? "arabic" : ""}
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

export default FormModal;
