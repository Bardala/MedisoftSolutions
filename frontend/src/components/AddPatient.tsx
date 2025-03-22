import { useState } from "react";
import { useCreatePatient } from "../hooks/usePatient"; // Adjust the path to your hook
import SearchComponent from "./SearchComponent"; // Import the SearchComponent
import "../styles/cardComponents.css";
import { isArabic } from "../utils";
import { Patient } from "../types";
import { usePatientSearch } from "../hooks/usePatientSearch";

const AddPatient: React.FC = () => {
  const {
    success,
    createPatient,
    isLoading,
    isError,
    error,
    patient,
    dispatch,
  } = useCreatePatient();
  const [showInfo, setShowInfo] = useState(false);
  const { allPatients } = usePatientSearch();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "fullName":
        dispatch({ type: "SET_FULL_NAME", payload: value });
        break;
      case "age":
        dispatch({ type: "SET_AGE", payload: Number(value) });
        break;
      case "notes":
        dispatch({ type: "SET_NOTES", payload: value });
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createPatient(patient);
      dispatch({ type: "RESET" }); // Reset the form fields
    } catch (err) {
      console.error("Error creating patient:", err);
    }
  };

  return (
    <div className="card-container">
      <h2>Add New Patient</h2>
      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="form-group">
          <input
            className={isArabic(patient.fullName) ? "arabic" : ""}
            type="text"
            name="fullName"
            placeholder="👤Full Name"
            value={patient.fullName || ""}
            onChange={handleInputChange}
            required
          />
          <button
            type="button"
            className="info-button"
            onClick={() => setShowInfo(!showInfo)}
          >
            ❗
          </button>

          {showInfo && (
            <div className="info-message arabic">
              <p>
                ⚠️ يُرجى استخدام الكتابة العربية الصحيحة لتفادي الأخطاء في
                استدعاء المرضى.
              </p>
              <ul>
                <li>
                  ✅ بدلاً من <b>'احمد'</b> اكتب <b>'أحمد'</b>
                </li>
                <li>
                  ✅ بدلاً من <b>'على'</b> اكتب <b>'علي'</b>
                </li>
                <li>
                  ✅ بدلاً من <b>'اسماعيل'</b> اكتب <b>'إسماعيل'</b>
                </li>
                <li>
                  ✅ بدلاً من <b>'عبدالمجيد'</b> اكتب <b>'عبد المجيد'</b>
                </li>
                <li>
                  ✅ بدلاً من <b>'بشري'</b> اكتب <b>'بشرى'</b>
                </li>
                <li>
                  ✅ استخدم التشكيل الصحيح مثل: <b>'إبراهيم'</b> بدلاً من{" "}
                  <b>'ابراهيم'</b>
                </li>
                <li>
                  ✅ في بعض الكلمات، يكون من الصحيح استخدام <b>'ي'</b> بدلاً من{" "}
                  <b>'ى'</b>؛ لذا يُرجى مراجعة القواعد الإملائية لكل حالة.
                </li>
              </ul>
              <p>⚠️ تأكد من وضع الهمزات بالشكل الصحيح</p>
              <p>
                ⚠️ تأكد من اختيار الحرف الصحيح في نهاية الكلمة: استخدم{" "}
                <b>'ى'</b> بدلاً من <b>'ي'</b> في الحالات التي تستدعي ذلك،
              </p>
            </div>
          )}
        </div>

        {/* Phone */}
        <div className="form-group">
          <input
            type="tel"
            name="phone"
            placeholder="📞Phone Number"
            value={patient.phone}
            onChange={(e) =>
              dispatch({
                type: "SET_PHONE",
                payload: e.target.value,
              })
            }
            required
          />
        </div>

        {/* Age */}
        <div className="form-group">
          <input
            type="number"
            name="age"
            placeholder="📅Age (optional)"
            value={patient.age || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* Address */}
        <div className="form-group">
          <SearchComponent<Patient>
            data={allPatients}
            searchKey="address"
            displayKey="address"
            placeholder="🏠Address (optional)"
            onSelect={(item) =>
              dispatch({ type: "SET_ADDRESS", payload: item.address })
            }
          />
        </div>

        {/* Medical History */}
        <div className="form-group">
          <SearchComponent<Patient>
            data={allPatients}
            searchKey="medicalHistory"
            displayKey="medicalHistory"
            placeholder="💊Medical History (optional)"
            onSelect={(item) =>
              dispatch({
                type: "SET_MEDICAL_HISTORY",
                payload: item.medicalHistory,
              })
            }
          />
        </div>

        {/* Notes */}
        <div className="form-group">
          <textarea
            className={isArabic(patient.notes) ? "arabic" : ""}
            name="notes"
            placeholder="📝Notes (optional)"
            value={patient.notes || ""}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </button>
      </form>

      {success && <p className="success">Patient registered successfully!</p>}
      {isError && <p className="error">Error: {error?.message}</p>}
    </div>
  );
};

export default AddPatient;
