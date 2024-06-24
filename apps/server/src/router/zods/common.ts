import { z } from 'zod';

const zResponse = z.object({
  code: z.number(),
  message: z.string(),
  data: z.any(),
});
const createZResponse = <T>(schema: z.ZodType<T>) => {
  return zResponse.extend({
    data: schema.optional(),
  });
};

const zListResponse = z.object({
  code: z.number(),
  message: z.string(),
  data: z.array(z.any()),
  total: z.number().optional(),
});
const createZListResponse = <T>(schema: z.ZodType<T>) => {
  return zListResponse.extend({
    data: z.array(schema).optional(),
  });
};

const zLocation = z.object({
  locationName: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
});
type TLocation = z.infer<typeof zLocation>;

const zId = z.object({
  id: z.number(),
});
type TId = z.infer<typeof zId>;

const zPagination = z.object({
  offset: z.number(),
  size: z.number(),
});
type TPagination = z.infer<typeof zPagination>;

enum ERROR_CODE {
  SUCCESS = 0,
  FAIL_INVALID_REQUEST = 100,
  FAIL_INTERNAL_ERROR = 101,
}
enum ERROR_MESSAGE {
  SUCCESS = 'success',
  FAIL_INVALID_REQUEST = 'invalid request',
  FAIL_INTERNAL_ERROR = 'internal error',
}

export {
  ERROR_CODE,
  ERROR_MESSAGE,
  createZResponse,
  createZListResponse,
  zLocation,
  zId,
  zPagination,
};

export type { TLocation, TId, TPagination };
