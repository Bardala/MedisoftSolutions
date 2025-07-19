import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useLogin } from "../context/loginContext";
import { FormModal } from "./FormModel";
import { isDoctorRole } from "../types";

interface UpdateModelProps<T> {
  objectToEdit: T;
  handelUpdate: (updatedObject: T) => void;
  handelDelete: () => void;
  title: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UpdateModel = <T extends Record<string, any>>({
  objectToEdit,
  handelUpdate,
  handelDelete,
  title,
}: UpdateModelProps<T>) => {
  const { loggedInUser } = useLogin();
  const { formatMessage: f } = useIntl();
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <>
      {/* Action buttons */}
      {isDoctorRole(loggedInUser.role) && (
        <div className="edit-patient">
          <button onClick={() => setUpdateModalOpen(!isUpdateModalOpen)}>
            <FontAwesomeIcon icon={faEdit} />
          </button>

          {!!handelDelete && (
            <button onClick={() => setConfirmDelete(true)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && objectToEdit && (
        <div>
          <FormModal
            objectToEdit={objectToEdit}
            onSave={handelUpdate}
            onClose={() => setUpdateModalOpen(false)}
            title={title}
          />
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div>
          <div>
            <h2>{f({ id: "confirm_delete" })}</h2>
            <p>{f({ id: "delete_confirmation_message" })}</p>
            <div>
              <button onClick={() => setConfirmDelete(false)}>
                {f({ id: "cancel" })}
              </button>
              <button onClick={handelDelete}>{f({ id: "delete" })}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
