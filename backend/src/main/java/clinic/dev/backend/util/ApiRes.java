package clinic.dev.backend.util;

import java.util.Map;

public class ApiRes<T> {
  private T data;
  private Map<String, String> error;

  public ApiRes(T data) {
    this.data = data;
    this.error = null;
  }

  public ApiRes(Map<String, String> error) {
    this.data = null;
    this.error = error;
  }

  // Getters and setters
  public T getData() {
    return data;
  }

  public void setData(T data) {
    this.data = data;
  }

  public Map<String, String> getError() {
    return error;
  }

  public void setError(Map<String, String> error) {
    this.error = error;
  }
}
