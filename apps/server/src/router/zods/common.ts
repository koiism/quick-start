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
  address: z.string().optional(),
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
  FAIL_REQUEST_ERROR = 100,
  FAIL_BUSINESS_ERROR = 200,
  FAIL_SYSTEM_ERROR = 300,
}
enum ERROR_MESSAGE {
  SUCCESS = 'success',
  FAIL_REQUEST_ERROR = 'request error',
  FAIL_BUSINESS_ERROR = "business error",
  FAIL_SYSTEM_ERROR = "system error",
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
