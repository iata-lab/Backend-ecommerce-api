const request = require("supertest");
const app = require("../app");

describe("Auth validation", () => {
  test("POST /api/auth/signup - datos inválidos", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      email: "no-es-email",
      userName: "x",
      password: "123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("errors.validation.failed");
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  test("POST /api/auth/login - sin credenciales", async () => {
    const res = await request(app).post("/api/auth/login").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("errors.validation.failed");
    expect(res.body.details).toContain("errors.validation.required");
  });
});
