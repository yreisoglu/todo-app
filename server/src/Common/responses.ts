import { Response } from 'express';

export const successResponse = (successMessage: any, response: Response) =>
  response.status(200).json(successMessage);

export const errorResponse = (error: any, response: Response) =>
  response.status(404).json(error);

export const noContentResponse = (response: Response) => response.status(204);