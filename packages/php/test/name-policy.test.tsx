import { describe, expect, it } from "vitest";
import { createPhpNamePolicy } from "../src/name-policy.js";

describe("PHP Name Policy", () => {
  const namePolicy = createPhpNamePolicy();

  describe("Class naming", () => {
    it("should convert to PascalCase", () => {
      expect(namePolicy.getName("user_profile", "class")).toBe("UserProfile");
      expect(namePolicy.getName("my-class", "class")).toBe("MyClass");
    });

    it("should handle reserved words", () => {
      expect(namePolicy.getName("class", "class")).toBe("Class_");
      expect(namePolicy.getName("interface", "interface")).toBe("Interface_");
    });
  });

  describe("Method naming", () => {
    it("should convert to camelCase", () => {
      expect(namePolicy.getName("get_user_name", "method")).toBe("getUserName");
      expect(namePolicy.getName("process-data", "method")).toBe("processData");
    });

    it("should handle reserved words", () => {
      expect(namePolicy.getName("function", "method")).toBe("function_");
    });
  });

  describe("Property naming", () => {
    it("should convert to camelCase", () => {
      expect(namePolicy.getName("user_name", "property")).toBe("userName");
      expect(namePolicy.getName("first-name", "property")).toBe("firstName");
    });
  });

  describe("Constant naming", () => {
    it("should convert to CONSTANT_CASE", () => {
      expect(namePolicy.getName("maxUsers", "constant")).toBe("MAX_USERS");
      expect(namePolicy.getName("api-key", "constant")).toBe("API_KEY");
    });
  });

  describe("Function naming", () => {
    it("should convert to snake_case", () => {
      expect(namePolicy.getName("getUserData", "function")).toBe(
        "get_user_data",
      );
      expect(namePolicy.getName("processPayment", "function")).toBe(
        "process_payment",
      );
    });
  });

  describe("Namespace naming", () => {
    it("should convert to PascalCase", () => {
      expect(namePolicy.getName("user_models", "namespace")).toBe("UserModels");
      expect(namePolicy.getName("api-controllers", "namespace")).toBe(
        "ApiControllers",
      );
    });
  });
});
