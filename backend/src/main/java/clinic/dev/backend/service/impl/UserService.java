package clinic.dev.backend.service.impl;

import clinic.dev.backend.constants.ErrorMsg;
import clinic.dev.backend.dto.auth.SignupRequest;
import clinic.dev.backend.dto.user.UserReqDTO;
import clinic.dev.backend.dto.user.UserResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.exceptions.UserNotFoundException;
import clinic.dev.backend.exceptions.BadRequestException;
import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.User;
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

  // todo: You have to put authorities for admins to update and delete users

  @Transactional
  public UserResDTO signup(SignupRequest request) {
    String username = request.getUsername(), password = request.getPassword(), role = request.getRole();
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

  @Transactional
  public UserResDTO create(UserReqDTO req) {
    if (userRepo.existsByUsername(req.username()))
      throw new IllegalArgumentException("Username already exists, please select another username.");

    if (userRepo.existsByPhone(req.phone()))
      throw new IllegalArgumentException(ErrorMsg.PHONE_ALREADY_EXISTS);

    User user = req.toEntity(getClinicId());
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

  public List<UserResDTO> getByRole(String role) {
    return userRepo.findByRoleAndClinicId(role, getClinicId()).stream().map(UserResDTO::fromEntity).toList();
  }

  /**
   * * This method just permit user to update his data
   */

  @Transactional
  public UserResDTO update(Long id, UserReqDTO req) throws IllegalAccessException {
    User existing = userRepo.findByIdAndClinicId(id, getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    if (!authContext.getUserId().equals(id))
      throw new IllegalAccessException("You don't have authority to update this user");

    String encodedPassword = passwordEncoder.encode(req.password());
    UserReqDTO updatedReq = new UserReqDTO(
        req.username(), // updateEntity will ignore it.
        encodedPassword,
        req.name(),
        req.phone(),
        req.role(),
        req.profilePicture());

    updatedReq.updateEntity(existing, getClinicId());
    return UserResDTO.fromEntity(userRepo.save(existing));
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
}
