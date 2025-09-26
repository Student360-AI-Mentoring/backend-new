import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

type RequestWithId = Request & { requestId?: string };

export function requestIdMiddleware(req: RequestWithId, res: Response, next: NextFunction): void {
  const headerRequestId = (req.headers['x-request-id'] as string | undefined) ?? null;
  const requestId = headerRequestId ?? uuidv4();

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  next();
}
