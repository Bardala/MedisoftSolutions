package clinic.dev.backend.constants;

public class ErrorMsg {

  public static final String USER_CANNOT_BE_NULL = "User cannot be null";
  public static final String VIDEO_CANNOT_BE_NULL = "Video cannot be null";
  public static final String CONTENT_CANNOT_BE_NULL = "Content cannot be null";
  public static final String MUST_NOT_BE_NULL = "This field must not be null";
  public static final String USERNAME_MUST_NOT_BE_NULL = "Username is required";
  public static final String EMAIL_MUST_BE_NULL = "Email is required";
  public static final String PASSWORD_MUST_NOT_BE_NULL = "Password is required";
  public static final String PLAYLIST_NAME_MUST_NOT_BE_NULL = "Playlist name must not be null";
  public static final String MESSAGE_CONTENT_SHOULD_NOT_BE_NULL = "Message Content should not be null";
  public static final String FIELD_MUST_NOT_BE_BLANK = "This field must not be blank";
  public static final String User_ID_MUST_NOT_BE_NULL = "User Id must not be null";
  public static final String VIDEO_ID_MUST_NOT_BE_NULL = "Video Id must not be null";
  public static final String TAG_MUST_NOT_BE_NULL = "Tag must not be null";
  public static final String TAG_ID_MUST_NOT_BE_NULL = "Tag Id must not be null";
  public static final String USERNAME_ALREADY_EXISTS = "Username already exists";
  public static final String USER_NOT_FOUND_WITH_USERNAME = "User not found with username";
  public static final String INVALID_USERNAME_OR_PASSWORD = "Invalid username or password";
  public static final String USER_DOES_NOT_EXIST = "User doesn't exist";
  public static final String AUTHENTICATION_FAILED = "Authentication failed";

  // todo: Replace the previous related messages with these by renaming them
  public static final String USERNAME_IS_REQUIRED = "Username is required";
  public static final String PASSWORD_IS_REQUIRED = "Password is required";
  public static final String EMAIL_IS_REQUIRED = "Email is required";

  public static final String EMAIL_SHOULD_BE_VALID = "Email should be valid";
  public static final String EMAIL_IS_IN_USED = "Email is in used";
  public static final String USER_NOT_FOUND_WITH_ID = "User not found with this id";
  public static final String VIDEO_NOT_FOUND_WITH_ID = "Video not found with this id";
  public static final String LINK_NOT_FOUND = "Like not found";
  public static final String COMMENT_NOT_FOUND = "Comment not found";
  public static final String TAG_NOT_FOUND = "Tag not found";
  public static final String VIDEO_TAG_NOT_FOUND = "Video tag not found";
  public static final String PLAYLIST_NOT_FOUND = "Playlist not found";
  public static final String SUBSCRIPTION_NOT_FOUND = "Subscription not found";
  public static final String CHAT_NOT_FOUND = "Chat not found";
  public static final String ROLE_NOT_FOUND = "Role not found";

  public static final String DATABASE_CONSTRAINS_VIOLATION = "Database constraint violation: ";
  public static final String SQL_CONSTRAINS_VIOLATION = "SQL constraint violation: ";
  public static final String ENTITY_NOT_FOUND = "SQL constraint violation: ";
  public static final String DATABASE_ERROR = "Database error: ";

  public static final String FILE_UPLOAD_FAILED = "File upload fail";
  public static final String FILE_NOT_FOUND = "File not found";
  public static final String FILE_NOT_FOUND_OR_UNREADABLE = "File not found or unreadable";
  public static final String FILE_RETRIEVAL_FAILED = "File retrieval failed";
  public static final String TITLE_IS_REQUIRED = "Title is required";
  public static final String DESCRIPTION_IS_REQUIRED = "Description is required";

  public static final String INVALID_ROLE = "Invalid role. Allowed roles are 'Doctor' and 'Assistant'";
  public static final String USER_NOT_FOUND_WITH_PHONE = "User not found with phone";
  public static final String PHONE_ALREADY_EXISTS = "Phone already exists";
  public static final String USERNAME_OR_PHONE_MUST_NOT_BE_NULL = "Username or phone must not be null";

  private ErrorMsg() {
  }
}
