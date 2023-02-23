export interface IResponse {
  status: number;
  message: string;
  error?: Error;
}


export const apiBaseURI = "http://localhost:5510/api";
