import { NextResponse } from 'next/server';

// Define common error responses with consistent format

export function notFoundError(message = 'Resource not found') {
  return NextResponse.json(
    { 
      error: {
        message,
        code: 'NOT_FOUND'
      }
    },
    { status: 404 }
  );
}

export function badRequestError(message = 'Bad request', validationErrors = {}) {
  return NextResponse.json(
    { 
      error: {
        message,
        code: 'BAD_REQUEST',
        validation: Object.keys(validationErrors).length ? validationErrors : undefined
      }
    },
    { status: 400 }
  );
}

export function serverError(message = 'Internal server error') {
  // You might want to log the error here
  console.error(`Server error: ${message}`);
  
  return NextResponse.json(
    { 
      error: {
        message: 'Something went wrong on our end. Please try again later.',
        code: 'INTERNAL_SERVER_ERROR'
      }
    },
    { status: 500 }
  );
}

export function unauthorizedError(message = 'Unauthorized') {
  return NextResponse.json(
    { 
      error: {
        message,
        code: 'UNAUTHORIZED'
      }
    },
    { status: 401 }
  );
}

export function forbiddenError(message = 'Forbidden') {
  return NextResponse.json(
    { 
      error: {
        message,
        code: 'FORBIDDEN'
      }
    },
    { status: 403 }
  );
}
