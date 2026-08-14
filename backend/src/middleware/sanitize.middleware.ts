import { Request, Response, NextFunction } from 'express';

/**
 * Deep recursive sanitizer to scrub NoSQL injection operators ($ and .)
 * from request body, query params, and route parameters.
 */
function cleanNoSqlInjection(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanNoSqlInjection);
  }

  const cleaned: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    // Strip leading $ or keys containing dots used in NoSQL operator injection
    const sanitizedKey = key.replace(/^\$|\./g, '_');
    cleaned[sanitizedKey] = cleanNoSqlInjection(obj[key]);
  }

  return cleaned;
}

export const noSqlSanitizer = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body) {
    req.body = cleanNoSqlInjection(req.body);
  }
  if (req.query) {
    req.query = cleanNoSqlInjection(req.query);
  }
  if (req.params) {
    req.params = cleanNoSqlInjection(req.params);
  }
  next();
};
