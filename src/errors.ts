export class BeeCliError extends Error {
  constructor(
    message: string,
    public exitCode: number,
  ) {
    super(message);
    this.name = "BeeCliError";
  }
}

export class BeeNotInstalledError extends BeeCliError {
  constructor() {
    super(
      "The Bee CLI is not installed or not in PATH. Install it with: npm install -g @beeai/cli",
      127,
    );
    this.name = "BeeNotInstalledError";
  }
}

export class BeeNotAuthenticatedError extends BeeCliError {
  constructor() {
    super('Not authenticated with Bee. Run "bee login" to authenticate.', 401);
    this.name = "BeeNotAuthenticatedError";
  }
}
