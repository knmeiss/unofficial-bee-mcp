import { execa } from "execa";
import {
  BeeCliError,
  BeeNotInstalledError,
  BeeNotAuthenticatedError,
} from "./errors.js";

interface BeeCliOptions {
  args: string[];
  timeout?: number;
}

export async function executeBee<T = unknown>(
  options: BeeCliOptions,
): Promise<T> {
  const { args, timeout = 30000 } = options;
  const fullArgs = [...args, "--json"];

  try {
    const result = await execa("bee", fullArgs, {
      timeout,
      env: {
        ...process.env,
        NO_COLOR: "1",
        CI: "1",
      },
    });

    return JSON.parse(result.stdout) as T;
  } catch (error: unknown) {
    throw classifyError(error);
  }
}

export async function executeBeeRaw(options: BeeCliOptions): Promise<string> {
  const { args, timeout = 30000 } = options;

  try {
    const result = await execa("bee", args, {
      timeout,
      env: {
        ...process.env,
        NO_COLOR: "1",
        CI: "1",
      },
    });

    return result.stdout;
  } catch (error: unknown) {
    throw classifyError(error);
  }
}

function isExecaError(
  error: unknown,
): error is { code?: string; exitCode?: number; stderr?: string; stdout?: string } {
  return error instanceof Error && "exitCode" in error;
}

function classifyError(error: unknown): BeeCliError {
  if (isExecaError(error) && error.code === "ENOENT") {
    return new BeeNotInstalledError();
  }

  if (isExecaError(error)) {
    const stderr = error.stderr ?? "";
    if (
      stderr.includes("not logged in") ||
      stderr.includes("unauthorized") ||
      error.exitCode === 401
    ) {
      return new BeeNotAuthenticatedError();
    }
    return new BeeCliError(
      `Bee CLI failed (exit ${error.exitCode}): ${stderr || error.stdout || "Unknown error"}`,
      error.exitCode ?? 1,
    );
  }

  if (error instanceof SyntaxError) {
    return new BeeCliError("Failed to parse Bee CLI JSON output", 0);
  }

  return new BeeCliError(String(error), 1);
}
