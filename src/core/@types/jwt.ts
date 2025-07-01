export interface DecodeOptions {
  complete?: boolean | undefined;
  json?: boolean | undefined;
}

export interface JwtPayload {
  id?: string;
  exp?: number | undefined;
  role?: string;
}

export interface Options {
  secret: string;
  expiresIn: string;
}
