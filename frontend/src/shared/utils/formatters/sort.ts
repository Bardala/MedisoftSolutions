export const sortById = <T extends { id?: number }>(data: T[]): T[] =>
  data?.slice().sort((b, a) => a.id - b.id);
