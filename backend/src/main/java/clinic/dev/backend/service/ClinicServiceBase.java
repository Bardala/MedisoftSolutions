package clinic.dev.backend.service;

import java.util.List;

import org.springframework.data.domain.Page;

import clinic.dev.backend.dto.clinic.req.ClinicBillingPlanReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicLimitsReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicSearchReq;
import clinic.dev.backend.dto.clinic.req.ClinicSettingsReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicUsageReqDTO;
import clinic.dev.backend.dto.clinic.req.CreateClinicWithOwnerReq;
import clinic.dev.backend.dto.clinic.res.ClinicBillingPlanResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicLimitsResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicSettingsResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicWithOwnerRes;
import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.ClinicUsage;
import clinic.dev.backend.model.User;

public interface ClinicServiceBase {

  List<ClinicResDTO> getAllClinics();

  ClinicResDTO getClinicById(Long id);

  ClinicResDTO getUserClinic();

  ClinicResDTO updateClinicById(Long id, ClinicReqDTO request);

  ClinicResDTO updateClinic(ClinicReqDTO request);

  void deleteClinic(Long id);

  ClinicSettingsResDTO updateSettings(ClinicSettingsReqDTO request);

  ClinicLimitsResDTO updateLimits(ClinicLimitsReqDTO request, Long clinicId);

  ClinicLimitsResDTO getLimits();

  ClinicLimitsResDTO getLimitsById(Long clinicId);

  ClinicSettingsResDTO getSettings();

  Page<ClinicResDTO> searchClinicsByName(String name, int page, int size);

  Page<ClinicResDTO> searchClinics(ClinicSearchReq req);

  ClinicWithOwnerRes createClinicWithOwner(
      CreateClinicWithOwnerReq req);

  ClinicWithOwnerRes getClinicWithOwner(Long id);

  void updateClinicBillingPlan(ClinicBillingPlanReqDTO req, Long clinicId);

  ClinicBillingPlanResDTO getBillingPlan(Long clinicId);

  ClinicUsage createClinicUsage(ClinicUsageReqDTO req);

  void createDefaultClinicSettings(Clinic clinic, User owner);

  void initializeMedicinesForDentals(Long clinicId);

}