// hooks/useAddUser.ts
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { UserApi } from "../apis";
import { ApiError } from "../fetch/ApiError";
import { UserReqDTO, UserResDTO } from "../dto";
import { UserRole } from "../types/types";
import { useLogin } from "../context/loginContext";

// export const useAddOwner = (defaultRole?: UserRole) => {
//   const { loggedInUser: currentUser } = useLogin();
//   const [username, setUsername] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [password, setPassword] = useState("");
//   const [phone, setPhone] = useState<string>("");
//   const [role, setRole] = useState<UserRole>(defaultRole || UserRole.ASSISTANT);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<boolean>(false);
//   const [qrUsername, setQrUsername] = useState("");
//   const [qrPassword, setQrPassword] = useState("");

//   const createUserMutation = useMutation<UserResDTO, ApiError, UserReqDTO>(
//     (userData) => UserApi.create(userData),
//     {
//       onSuccess: () => {
//         setSuccess(true);
//         setQrPassword(password);
//         setQrUsername(username);
//       },
//       onError: (error: ApiError) => {
//         setError(error.message || "Failed to create user account");
//       },
//     },
//   );

//   const resetForm = () => {
//     setUsername("");
//     setFullName("");
//     setPassword("");
//     setPhone("");
//     if (!defaultRole) {
//       setRole(UserRole.ASSISTANT);
//     }
//   };

//   const handleSubmit = async (userData: UserReqDTO) => {
//     setError(null);
//     setSuccess(false);

//     if (
//       !userData.username ||
//       !userData.name ||
//       !userData.password ||
//       !userData.phone
//     ) {
//       setError("All fields are required");
//       return false;
//     }

//     if (userData.role === UserRole.SUPER_ADMIN) {
//       setError("Cannot create Super Admin accounts");
//       return false;
//     }

//     if (
//       userData.role === UserRole.OWNER &&
//       currentUser?.role !== UserRole.SUPER_ADMIN
//     ) {
//       setError("Only Super Admin can create Owner accounts");
//       return false;
//     }

//     try {
//       await createUserMutation.mutateAsync(userData);
//       return true;
//     } catch (error) {
//       return false;
//     }
//   };

//   const availableRoles = Object.values(UserRole).filter((userRole) => {
//     if (
//       currentUser.role === UserRole.ASSISTANT ||
//       currentUser.role === UserRole.DOCTOR
//     )
//       return false;
//     if (userRole === UserRole.SUPER_ADMIN) return false;

//     if (userRole === UserRole.OWNER)
//       return currentUser?.role === UserRole.SUPER_ADMIN;

//     return true;
//   });

//   return {
//     handleSubmit,
//     error,
//     success,
//     username,
//     setUsername,
//     fullName,
//     setFullName,
//     password,
//     setPassword,
//     phone,
//     setPhone,
//     role,
//     setRole,
//     qrPassword,
//     qrUsername,
//     availableRoles,
//     isLoading: createUserMutation.isLoading,
//     resetForm,
//   };
// };

export const useAddUserMutation = () => {
  const { loggedInUser: currentUser } = useLogin();

  const validateUserData = (userData: UserReqDTO): string | null => {
    if (
      !userData.username ||
      !userData.name ||
      !userData.password ||
      !userData.phone
    ) {
      return "All fields are required";
    }

    if (userData.role === UserRole.SUPER_ADMIN) {
      return "Cannot create Super Admin accounts";
    }

    if (
      userData.role === UserRole.OWNER &&
      currentUser?.role !== UserRole.SUPER_ADMIN
    ) {
      return "Only Super Admin can create Owner accounts";
    }

    return null;
  };

  return useMutation<UserResDTO, ApiError, UserReqDTO>((userData) => {
    const validationError = validateUserData(userData);
    if (validationError) {
      throw new ApiError(400, validationError);
    }
    return UserApi.create(userData);
  });
};

export const useUserFormState = (defaultRole?: UserRole) => {
  const { loggedInUser: currentUser } = useLogin();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState<string>("");
  const [role, setRole] = useState<UserRole>(defaultRole || UserRole.ASSISTANT);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [qrUsername, setQrUsername] = useState("");
  const [qrPassword, setQrPassword] = useState("");

  const resetForm = () => {
    setUsername("");
    setFullName("");
    setPassword("");
    setPhone("");
    if (!defaultRole) {
      setRole(UserRole.ASSISTANT);
    }
    setError(null);
    setSuccess(false);
  };

  const prepareUserData = () => ({
    username,
    name: fullName,
    password,
    phone,
    role,
  });

  const availableRoles = Object.values(UserRole).filter((userRole) => {
    if (
      currentUser.role === UserRole.ASSISTANT ||
      currentUser.role === UserRole.DOCTOR
    )
      return false;
    if (userRole === UserRole.SUPER_ADMIN) return false;

    if (userRole === UserRole.OWNER)
      return currentUser?.role === UserRole.SUPER_ADMIN;

    return true;
  });

  return {
    formState: {
      username,
      fullName,
      password,
      phone,
      role,
      error,
      success,
      qrUsername,
      qrPassword,
    },
    formActions: {
      setUsername,
      setFullName,
      setPassword,
      setPhone,
      setRole,
      setError,
      setSuccess,
      setQrUsername,
      setQrPassword,
      resetForm,
      prepareUserData,
    },
    availableRoles,
  };
};
