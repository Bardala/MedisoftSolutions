package clinic.dev.backend.service.impl;

import clinic.dev.backend.constants.ErrorMsg;
import clinic.dev.backend.dto.auth.SignupRequest;
import clinic.dev.backend.dto.user.UpdateUserReqDTO;
import clinic.dev.backend.dto.user.UserReqDTO;
import clinic.dev.backend.dto.user.UserResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.exceptions.UnauthorizedAccessException;
import clinic.dev.backend.exceptions.UserNotFoundException;
import clinic.dev.backend.exceptions.BadRequestException;
import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.ClinicLimits;
import clinic.dev.backend.model.User;
import clinic.dev.backend.model.enums.UserRole;
import clinic.dev.backend.repository.ClinicLimitsRepo;
import clinic.dev.backend.repository.UserRepo;
import clinic.dev.backend.util.AuthContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

  @Autowired
  private UserRepo userRepo;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private AuthContext authContext;

  @Autowired
  private ClinicLimitsRepo clinicLimitsRepo;

  // todo: You have to put authorities for admins to update and delete users

  @Transactional
  public UserResDTO signup(SignupRequest request) {
    String username = request.getUsername(), password = request.getPassword();
    UserRole role = request.getRole();
    Long clinicId = request.getClinicId();

    if (userRepo.existsByUsername(username)) {
      throw new IllegalArgumentException(ErrorMsg.USERNAME_ALREADY_EXISTS);
    }

    if (userRepo.existsByPhone(request.getPhone())) {
      throw new IllegalArgumentException(ErrorMsg.PHONE_ALREADY_EXISTS);
    }

    User user = new User();
    user.setUsername(username);
    user.setPassword(passwordEncoder.encode(password));
    user.setRole(role);
    user.setPhone(request.getPhone());
    user.setName(request.getName());
    user.setClinic(new Clinic(clinicId));

    return UserResDTO.fromEntity(userRepo.save(user));
  }

  public boolean validateUsersNumberLimits() {
    ClinicLimits clinicLimits = clinicLimitsRepo.findByClinicId(authContext.getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Clinic Limits Not Found"));

    Integer currentUsersNumber = userRepo.countUsersByClinicId(authContext.getClinicId());
    Integer maxAllowedUsers = clinicLimits.getMaxUsers();

    if (maxAllowedUsers == null) {
      throw new IllegalStateException("Max users limit is not configured for this clinic.");
    }

    return currentUsersNumber < maxAllowedUsers;
  }

  @Transactional
  public UserResDTO create(UserReqDTO req) {
    if (!validateUsersNumberLimits())
      throw new IllegalStateException("User creation limit reached for this clinic.");

    if (userRepo.existsByUsername(req.username()))
      throw new IllegalArgumentException("Username already exists, please select another username.");

    if (userRepo.existsByPhone(req.phone()))
      throw new IllegalArgumentException(ErrorMsg.PHONE_ALREADY_EXISTS);

    User user = req.toEntity(authContext.getClinicId());
    user.setPassword(passwordEncoder.encode(user.getPassword()));

    return UserResDTO.fromEntity(userRepo.save(user));
  }

  @Transactional
  public UserResDTO createOwner(UserReqDTO req, Long clinicId) {
    if (userRepo.existsByUsername(req.username()))
      throw new IllegalArgumentException("Username already exists, please select another username.");

    if (userRepo.existsByPhone(req.phone()))
      throw new IllegalArgumentException(ErrorMsg.PHONE_ALREADY_EXISTS);

    User user = req.toEntity(clinicId);
    user.setPassword(passwordEncoder.encode(user.getPassword()));

    return UserResDTO.fromEntity(userRepo.save(user));
  }

  public UserResDTO getById(Long id) {
    User user = userRepo.findByIdAndClinicId(id, getClinicId())
        .orElseThrow(() -> new UserNotFoundException(ErrorMsg.USER_NOT_FOUND_WITH_ID));

    return UserResDTO.fromEntity(user);
  }

  public UserResDTO getByUsername(String username) {
    User user = userRepo.findByUsernameAndClinicId(username, getClinicId())
        .orElseThrow(() -> new UserNotFoundException(ErrorMsg.USER_NOT_FOUND_WITH_USERNAME));

    return UserResDTO.fromEntity(user);
  }

  public UserResDTO getByPhone(String phone) {
    return UserResDTO.fromEntity(userRepo.findByPhoneAndClinicId(phone, getClinicId())
        .orElseThrow(() -> new UserNotFoundException(ErrorMsg.USER_NOT_FOUND_WITH_PHONE)));
  }

  public List<UserResDTO> getAll() {
    return userRepo.findAllByClinicId(getClinicId()).stream().map(UserResDTO::fromEntity).toList();
  }

  public List<UserResDTO> getByRole(UserRole role) {
    return userRepo.findByRoleAndClinicId(role, getClinicId()).stream().map(UserResDTO::fromEntity).toList();
  }

  @Transactional
  public UserResDTO updateUser(Long targetUserId, UpdateUserReqDTO req) {
    User currentUser = getCurrentUser();
    User targetUser = getSecureUser(targetUserId);

    if (!canUpdateUser(currentUser, targetUser)) {
      throw new UnauthorizedAccessException("Unauthorized update attempt");
    }

    if (req.password() != null && !req.password().isEmpty()) {
      req = handlePasswordUpdate(req, currentUser, targetUser);
    }

    req.updateEntity(targetUser, targetUser.getClinic().getId());
    return UserResDTO.fromEntity(userRepo.save(targetUser));
  }

  private UpdateUserReqDTO handlePasswordUpdate(UpdateUserReqDTO req, User currentUser, User targetUser) {
    if (!isAdminOperation(currentUser, targetUser)) {
      if (req.lastPassword() == null || !passwordEncoder.matches(req.lastPassword(), targetUser.getPassword())) {
        throw new IllegalArgumentException("Password change verification failed");
      }
    }

    String encodedPassword = passwordEncoder.encode(req.password());
    return req.withPassword(encodedPassword);
  }

  /** current user can update himself or his clinic owner or super admin */
  private boolean canUpdateUser(User currentUser, User targetUser) {
    return currentUser.getId().equals(targetUser.getId()) ||
        isSuperAdmin(currentUser) ||
        (isOwner(currentUser) &&
            currentUser.getClinic().getId().equals(targetUser.getClinic().getId()));
  }

  private boolean isAdminOperation(User currentUser, User targetUser) {
    return !currentUser.getId().equals(targetUser.getId()) &&
        (isSuperAdmin(currentUser) ||
            isOwner(currentUser));
  }

  private User getCurrentUser() {
    return userRepo.findById(authContext.getUserId())
        .orElseThrow(() -> new UserNotFoundException("Current user not found"));
  }

  private User getSecureUser(Long userId) {
    return userRepo.findByIdWithSecurityContext(
        userId,
        authContext.getClinicId(), // Will be ignored if isSuperAdmin=true
        authContext.isSuperAdmin()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
  }

  private boolean isSuperAdmin(User u) {
    return UserRole.SUPER_ADMIN.equals(u.getRole());
  }

  private boolean isOwner(User u) {
    return UserRole.OWNER.equals(u.getRole());
  }

  @Transactional
  public void deleteById(Long id) {
    if (!userRepo.existsByIdAndClinicId(id, getClinicId()))
      throw new UserNotFoundException("User not found");

    userRepo.deleteByIdAndClinicId(id, getClinicId());
  }

  @Transactional
  public void deleteByUsername(String username) {
    if (!userRepo.existsByUsernameAndClinicId(username, getClinicId()))
      throw new UserNotFoundException(ErrorMsg.USER_NOT_FOUND_WITH_USERNAME);

    userRepo.deleteUserByUsernameAndClinicId(username, getClinicId());
  }

  @Transactional
  public void deleteByPhone(String phone) {
    if (!userRepo.existsByPhoneAndClinicId(phone, getClinicId()))
      throw new UserNotFoundException(ErrorMsg.USER_NOT_FOUND_WITH_PHONE);

    userRepo.deleteUserByPhoneAndClinicId(phone, getClinicId());
  }

  @Transactional
  public void deleteAll() {
    userRepo.deleteAllByClinicId(getClinicId());
  }

  @Transactional
  public void resetPassword(String newPassword) {
    String username = authContext.getUsername();

    User user = userRepo.findByUsername(username)
        .orElseThrow(() -> new UserNotFoundException("User not found"));

    user.setPassword(passwordEncoder.encode(newPassword));
    userRepo.save(user);
  }

  private Long getClinicId() {
    return authContext.getClinicId();
  };

  public List<UserResDTO> getUsersByIds(List<Long> ids) {
    if (ids == null || ids.isEmpty()) {
      throw new BadRequestException("User IDs cannot be empty");
    }

    List<User> users = userRepo.findByIdInAndClinicId(ids, authContext.getClinicId());

    if (users.size() != ids.size()) {
      Set<Long> foundIds = users.stream()
          .map(User::getId)
          .collect(Collectors.toSet());

      List<Long> missingIds = ids.stream()
          .filter(id -> !foundIds.contains(id))
          .collect(Collectors.toList());

      throw new ResourceNotFoundException(
          "Some User not found or not accessible: " + missingIds);
    }

    return users.stream()
        .map(UserResDTO::fromEntity)
        .collect(Collectors.toList());

  }

  public List<UserResDTO> getClinicStaff(Long clinicId) {
    return userRepo.findAllByClinicId(clinicId).stream().map(UserResDTO::fromEntity).toList();
  }
}
