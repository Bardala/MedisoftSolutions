import { FC, FormEvent, useState } from "react";
import {
  useCreateProcedure,
  useProcedures,
  useUpdateProcedure,
} from "../hooks/useProcedure";
import { useIntl } from "react-intl";
import { Procedure, Visit } from "../types";
import { useRecordVisitDentalProcedure } from "../hooks/useVisitDentalProcedure";

export const ProcedureSearch: FC<{ visit: Visit }> = ({ visit }) => {
  const { formatMessage: f } = useIntl();
  const { proceduresQuery } = useProcedures();
  const { createProcedureMutation } = useCreateProcedure();
  const { updateProcedureMutation } = useUpdateProcedure();
  // const { deleteProcedureMutation } = useDeleteProcedure();
  const { recordVisitDentalProcedureMutation } =
    useRecordVisitDentalProcedure();

  const procedures = proceduresQuery.data;
  const [procedureName, setProcedureName] = useState("");
  const [arabicName, setArabicName] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState(0);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(
    null,
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let procedure: Procedure;

    if (selectedProcedure) {
      if (procedureName !== selectedProcedure.serviceName) {
        const newProcedure = {
          arabicName,
          description,
          cost,
          serviceName: procedureName,
        };
        const createdProcedure = await createProcedureMutation.mutateAsync(
          newProcedure,
        );
        procedure = createdProcedure;
      } else {
        const updatedProcedure = {
          ...selectedProcedure,
          cost,
          arabicName,
          description,
        };
        const updated = await updateProcedureMutation.mutateAsync(
          updatedProcedure,
        );
        procedure = updated;
      }
    } else {
      const newProcedure = {
        serviceName: procedureName,
        arabicName,
        description,
        cost,
      };
      const createdProcedure = await createProcedureMutation.mutateAsync(
        newProcedure,
      );
      procedure = createdProcedure;
    }

    await recordVisitDentalProcedureMutation.mutateAsync({
      visit: { id: visit.id },
      dentalProcedure: { id: procedure.id },
    });

    setArabicName("");
    setProcedureName("");
    setCost(0);
    setDescription("");
  }

  function handleProcedureSelect(procedure: Procedure): void {
    setSelectedProcedure(procedure);
    setProcedureName(procedure.serviceName);
    setArabicName("اختبار");
    setDescription("");
    setCost(0);
  }

  return (
    <>
      <h3>{f({ id: "createPrescription" })}</h3>
      <form onSubmit={handleSubmit}>
        {/* Medicine Search and Selection */}
        <div className="medicine-search">
          <input
            type="text"
            placeholder={f({ id: "searchMedicine" })}
            value={procedureName}
            onChange={(e) => setProcedureName(e.target.value)}
          />
          {procedures && (
            <ul className="search-list visible">
              {procedures
                .filter((p) =>
                  p.serviceName
                    .toLowerCase()
                    .includes(procedureName.toLowerCase()),
                )
                .map((p) => (
                  <li key={p.id} onClick={() => handleProcedureSelect(p)}>
                    {p.serviceName} - {p.arabicName}
                  </li>
                ))}
            </ul>
          )}
        </div>

        <button type="submit">
          {selectedProcedure
            ? procedureName !== selectedProcedure.serviceName
              ? f({ id: "addNewMedicine" })
              : f({ id: "updateMedicine" })
            : f({ id: "addToPrescription" })}
        </button>
      </form>
    </>
  );
};
