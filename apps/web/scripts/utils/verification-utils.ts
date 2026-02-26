/**
 * Shared utilities for verification scripts
 */

// ANSI color codes
export const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  bold: "\x1b[1m",
};

export function logSuccess(message: string) {
  console.log(`${colors.green}✅${colors.reset} ${message}`);
}

export function logError(message: string) {
  console.log(`${colors.red}❌${colors.reset} ${message}`);
}

export function logWarning(message: string) {
  console.log(`${colors.yellow}⚠️${colors.reset}  ${message}`);
}

export function logInfo(message: string) {
  console.log(`${colors.blue}ℹ${colors.reset}  ${message}`);
}

export function logHeader(message: string) {
  console.log(`\n${colors.bold}${message}${colors.reset}`);
  console.log("=".repeat(60));
}
