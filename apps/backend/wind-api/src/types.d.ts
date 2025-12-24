declare namespace Express {
  interface Request {
    timestemp: string;
    userId: string | undefined;
  }
}

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined;
  };
}
