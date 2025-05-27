class ApiResponse {
  constructor(statusCode, data = null, message = "Success", errors = []) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // Consistent with HTTP success status codes
    this.errors = errors; // Add errors property for consistency
  }
}

export { ApiResponse };
