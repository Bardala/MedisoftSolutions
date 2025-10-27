// // src/components/clinic/BillingPlanManagement.tsx
// import { useQuery, useMutation } from "@tanstack/react-query";
// import React from "react";
// import { useForm } from "react-hook-form";
// import { useIntl } from "react-intl";
// import { useParams } from "react-router-dom";
// import { ClinicApi } from "../apis";
// import { PlanType, SubscriptionStatus } from "../types";
// import { ClinicBillingPlanReq, ClinicBillingPlanRes } from "../dto";

// export const BillingPlanManagement = ({ clinicId }) => {
//   const { formatMessage: f } = useIntl();

//   const {
//     data: billingPlan,
//     isLoading: isLoadingPlan,
//     refetch,
//   } = useQuery<ClinicBillingPlanRes>(
//     ["billingPlan", clinicId],
//     () => ClinicApi.getBillingPlan(Number(clinicId)),
//     { enabled: !!clinicId },
//   );

//   const { mutateAsync: updatePlan, isLoading: isUpdating } = useMutation(
//     (data: ClinicBillingPlanReq) =>
//       ClinicApi.updateBillingPlan(Number(clinicId), data),
//     {
//       onSuccess: () => refetch(),
//     },
//   );

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isDirty },
//   } = useForm<ClinicBillingPlanReq>({
//     defaultValues: billingPlan || {
//       planType: PlanType.MONTHLY,
//       startDate: new Date().toISOString(),
//       endDate: "",
//       pricePerVisit: 0,
//       monthlyPrice: 0,
//       yearlyPrice: 0,
//       status: SubscriptionStatus.ACTIVE,
//       autoRenew: true,
//     },
//   });

//   // Reset form when billingPlan changes
//   React.useEffect(() => {
//     if (billingPlan) {
//       reset(billingPlan);
//     }
//   }, [billingPlan, reset]);

//   const onSubmit = async (data: ClinicBillingPlanReq) => {
//     try {
//       await updatePlan(data);
//     } catch (error) {
//       console.error("Update failed:", error);
//     }
//   };

//   if (isLoadingPlan) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="billing-plan-container">
//       <h2>{f({ id: "billing_plan_management" })}</h2>

//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="form-section">
//           <div className={`form-group ${errors.planType ? "has-error" : ""}`}>
//             <label>{f({ id: "plan_type" })}*</label>
//             <select
//               {...register("planType", {
//                 required: f({ id: "plan_type_required" }),
//               })}
//             >
//               {Object.values(PlanType).map((type) => (
//                 <option key={type} value={type}>
//                   {f({ id: `plan_type.${type.toLowerCase()}` })}
//                 </option>
//               ))}
//             </select>
//             {errors.planType && (
//               <span className="error-text">{errors.planType.message}</span>
//             )}
//           </div>

//           <div className={`form-group ${errors.startDate ? "has-error" : ""}`}>
//             <label>{f({ id: "start_date" })}*</label>
//             <input
//               type="datetime-local"
//               {...register("startDate", {
//                 required: f({ id: "start_date_required" }),
//               })}
//             />
//             {errors.startDate && (
//               <span className="error-text">{errors.startDate.message}</span>
//             )}
//           </div>

//           <div className="form-group">
//             <label>{f({ id: "end_date" })}</label>
//             <input type="datetime-local" {...register("endDate")} />
//           </div>

//           <div
//             className={`form-group ${errors.pricePerVisit ? "has-error" : ""}`}
//           >
//             <label>{f({ id: "price_per_visit" })}*</label>
//             <input
//               type="number"
//               min="0"
//               step="0.01"
//               {...register("pricePerVisit", {
//                 required: f({ id: "price_required" }),
//                 valueAsNumber: true,
//                 min: {
//                   value: 0,
//                   message: f({ id: "invalid_price" }),
//                 },
//               })}
//             />
//             {errors.pricePerVisit && (
//               <span className="error-text">{errors.pricePerVisit.message}</span>
//             )}
//           </div>

//           <div
//             className={`form-group ${errors.monthlyPrice ? "has-error" : ""}`}
//           >
//             <label>{f({ id: "monthly_price" })}*</label>
//             <input
//               type="number"
//               min="0"
//               step="0.01"
//               {...register("monthlyPrice", {
//                 required: f({ id: "price_required" }),
//                 valueAsNumber: true,
//                 min: {
//                   value: 0,
//                   message: f({ id: "invalid_price" }),
//                 },
//               })}
//             />
//             {errors.monthlyPrice && (
//               <span className="error-text">{errors.monthlyPrice.message}</span>
//             )}
//           </div>

//           <div
//             className={`form-group ${errors.yearlyPrice ? "has-error" : ""}`}
//           >
//             <label>{f({ id: "yearly_price" })}*</label>
//             <input
//               type="number"
//               min="0"
//               step="0.01"
//               {...register("yearlyPrice", {
//                 required: f({ id: "price_required" }),
//                 valueAsNumber: true,
//                 min: {
//                   value: 0,
//                   message: f({ id: "invalid_price" }),
//                 },
//               })}
//             />
//             {errors.yearlyPrice && (
//               <span className="error-text">{errors.yearlyPrice.message}</span>
//             )}
//           </div>

//           <div className={`form-group ${errors.status ? "has-error" : ""}`}>
//             <label>{f({ id: "status" })}*</label>
//             <select
//               {...register("status", {
//                 required: f({ id: "status_required" }),
//               })}
//             >
//               {Object.values(SubscriptionStatus).map((status) => (
//                 <option key={status} value={status}>
//                   {f({ id: `subscription_status.${status.toLowerCase()}` })}
//                 </option>
//               ))}
//             </select>
//             {errors.status && (
//               <span className="error-text">{errors.status.message}</span>
//             )}
//           </div>

//           <div className="form-group checkbox-group">
//             <label>
//               <input type="checkbox" {...register("autoRenew")} />
//               {f({ id: "auto_renew" })}
//             </label>
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="submit-btn"
//           disabled={isUpdating || !isDirty}
//         >
//           {isUpdating ? f({ id: "updating" }) : f({ id: "update_plan" })}
//         </button>
//       </form>

//       {billingPlan && (
//         <div className="current-plan-info">
//           <h3>{f({ id: "current_plan" })}</h3>
//           <div className="info-grid">
//             <div>
//               <strong>{f({ id: "plan_type" })}:</strong>
//               <span>
//                 {f({ id: `plan_type.${billingPlan.planType.toLowerCase()}` })}
//               </span>
//             </div>
//             <div>
//               <strong>{f({ id: "start_date" })}:</strong>
//               <span>{formatDate(billingPlan.startDate)}</span>
//             </div>
//             {billingPlan.endDate && (
//               <div>
//                 <strong>{f({ id: "end_date" })}:</strong>
//                 <span>{formatDate(billingPlan.endDate)}</span>
//               </div>
//             )}
//             <div>
//               <strong>{f({ id: "price_per_visit" })}:</strong>
//               <span>{billingPlan.pricePerVisit.toFixed(2)}</span>
//             </div>
//             <div>
//               <strong>{f({ id: "monthly_price" })}:</strong>
//               <span>{billingPlan.monthlyPrice.toFixed(2)}</span>
//             </div>
//             <div>
//               <strong>{f({ id: "yearly_price" })}:</strong>
//               <span>{billingPlan.yearlyPrice.toFixed(2)}</span>
//             </div>
//             <div>
//               <strong>{f({ id: "status" })}:</strong>
//               <span>
//                 {f({
//                   id: `subscription_status.${billingPlan.status.toLowerCase()}`,
//                 })}
//               </span>
//             </div>
//             <div>
//               <strong>{f({ id: "auto_renew" })}:</strong>
//               <span>
//                 {billingPlan.autoRenew ? f({ id: "yes" }) : f({ id: "no" })}
//               </span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
