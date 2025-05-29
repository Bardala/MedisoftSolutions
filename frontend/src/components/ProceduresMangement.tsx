import React, { useState } from "react";
import { useIntl } from "react-intl";
import { Procedure } from "../types";
import {
  useProcedures,
  useCreateProcedure,
  useUpdateProcedure,
  useDeleteProcedure,
} from "../hooks/useProcedure";
import { ProcedureReqDTO } from "../dto";

export const ProceduresManagement: React.FC = () => {
  const { formatMessage: f } = useIntl();
  const { proceduresQuery } = useProcedures();
  const { createProcedureMutation } = useCreateProcedure();
  const { updateProcedureMutation } = useUpdateProcedure();
  const { deleteProcedureMutation } = useDeleteProcedure();

  const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(
    null,
  );
  const [newProcedure, setNewProcedure] = useState<ProcedureReqDTO>({
    serviceName: "",
    arabicName: "",
    cost: 0,
    description: "",
    // Add other procedure fields as needed
  });

  const handleCreate = () => {
    createProcedureMutation.mutate(newProcedure as Procedure);
    setNewProcedure({
      serviceName: "",
      arabicName: "",
      cost: 0,
      description: "",
    });
  };

  const handleUpdate = () => {
    if (editingProcedure) {
      updateProcedureMutation.mutate(editingProcedure);
      setEditingProcedure(null);
    }
  };

  const handleDelete = (id: number) => {
    deleteProcedureMutation.mutate(id);
  };

  if (proceduresQuery.isLoading) return <div>{f({ id: "loading" })}</div>;
  if (proceduresQuery.error) return <div>{f({ id: "error" })}</div>;

  return (
    <div className="procedures-management">
      <h2>{f({ id: "manageProcedures" })}</h2>

      {/* Create new procedure form */}
      <div className="create-form">
        <h3>{f({ id: "createNewProcedure" })}</h3>
        <input
          type="text"
          placeholder={f({ id: "serviceName" })}
          value={newProcedure.serviceName}
          onChange={(e) =>
            setNewProcedure({ ...newProcedure, serviceName: e.target.value })
          }
        />
        <input
          type="text"
          placeholder={f({ id: "arabicName" })}
          value={newProcedure.arabicName}
          onChange={(e) =>
            setNewProcedure({ ...newProcedure, arabicName: e.target.value })
          }
        />
        <input
          type="number"
          placeholder={f({ id: "cost" })}
          value={newProcedure.cost}
          onChange={(e) =>
            setNewProcedure({
              ...newProcedure,
              cost: parseFloat(e.target.value),
            })
          }
        />
        <button
          onClick={handleCreate}
          disabled={createProcedureMutation.isLoading}
        >
          {createProcedureMutation.isLoading
            ? f({ id: "creating" })
            : f({ id: "create" })}
        </button>
      </div>

      {/* Edit procedure form */}
      {editingProcedure && (
        <div className="edit-form">
          <h3>{f({ id: "editProcedure" })}</h3>
          <input
            type="text"
            value={editingProcedure.serviceName}
            onChange={(e) =>
              setEditingProcedure({
                ...editingProcedure,
                serviceName: e.target.value,
              })
            }
          />
          <input
            type="text"
            value={editingProcedure.arabicName}
            onChange={(e) =>
              setEditingProcedure({
                ...editingProcedure,
                arabicName: e.target.value,
              })
            }
          />
          <input
            type="number"
            value={editingProcedure.cost}
            onChange={(e) =>
              setEditingProcedure({
                ...editingProcedure,
                cost: parseFloat(e.target.value),
              })
            }
          />
          <button
            onClick={handleUpdate}
            disabled={updateProcedureMutation.isLoading}
          >
            {updateProcedureMutation.isLoading
              ? f({ id: "updating" })
              : f({ id: "update" })}
          </button>
          <button onClick={() => setEditingProcedure(null)}>
            {f({ id: "cancel" })}
          </button>
        </div>
      )}

      {/* Procedures list */}
      <div className="procedures-list">
        <h3>{f({ id: "proceduresList" })}</h3>
        <ul>
          {proceduresQuery.data?.map((procedure) => (
            <li key={procedure.id}>
              <div>
                <strong>{procedure.serviceName}</strong> ({procedure.arabicName}
                ) - {procedure.cost}
              </div>
              <div className="actions">
                <button onClick={() => setEditingProcedure(procedure)}>
                  {f({ id: "edit" })}
                </button>
                <button
                  onClick={() => handleDelete(procedure.id)}
                  disabled={deleteProcedureMutation.isLoading}
                >
                  {deleteProcedureMutation.isLoading
                    ? f({ id: "deleting" })
                    : f({ id: "delete" })}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
