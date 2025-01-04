package clinic.dev.backend.service;

import java.util.List;

public interface BaseService<T> {
  T create(T entity);

  T update(Long id, T entity);

  void delete(Long id);

  T getById(Long id);

  List<T> getAll();
}
