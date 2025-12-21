import "server-only";

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { HttpError } from "./error";

export function handleError(error: unknown) {
  // Zod
  if (error instanceof ZodError) {
    console.info(error);
    return NextResponse.json(
      { error: error.flatten() },
      { status: 422 }
    );
  }

  // Custom HTTP error
  if (error instanceof HttpError) {
    console.info(error);
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }

  // Unknown
  console.error(error);
  return NextResponse.json(
    { error: "Unexpected server error" },
    { status: 500 }
  );
}
