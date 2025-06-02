const request = require("supertest");
const app = require("../app");

describe("User validation (autenticado)", () => {
  let token;

  beforeAll(async () => {
    const testUser = {
      email: "testuser@example.com",
      userName: "testuser",
      password: "Password123",
    };

    // Crear usuario
    await request(app).post("/api/auth/signup").send(testUser);

    // Login y guardar token
    const loginRes = await request(app).post("/api/auth/login").send({
      credential: testUser.email,
      password: testUser.password,
    });

    token = loginRes.body.token;
  });

  test("PATCH /api/profile - sin datos", async () => {
    const res = await request(app)
      .patch("/api/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("errors.validation.failed");
    expect(res.body.details).toContain("errors.user.no_valid_fields");
  });
});
