declare namespace Express {
  interface Request {
    timestemp: string;
  }
}

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined;
  };
}
