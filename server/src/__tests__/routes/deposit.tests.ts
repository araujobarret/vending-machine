import request from "supertest";
import mongoose from "mongoose";
import app, { server } from "../../app";
import { userModel } from "../../models/user";
import { createPasswordHash } from "../../services/auth";

beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  await userModel.create(mockBuyer);
});

afterEach(async () => {
  // Disconnect from the test database and remove it
  server.close();
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("POST /deposit", () => {
  const getBearerToken = async () => {
    const login = await request(app).post("/login").send({
      email: mockBuyer.email,
      password: mockBuyer.password,
    });
    return `Bearer ${login.text}`;
  };

  test("successfully deposits a coin", async () => {
    const response = await request(app)
      .post("/deposit")
      .set("Authorization", await getBearerToken())
      .send({ coin: 50 });

    expect(response.status).toBe(200);
    expect(response.body.deposit).toBe(0.5);
  });

  test("successfully deposits more than a coin", async () => {
    const bearer = await getBearerToken();
    const response = await request(app)
      .post("/deposit")
      .set("Authorization", bearer)
      .send({ coin: 50 });

    expect(response.status).toBe(200);
    expect(response.body.deposit).toBe(0.5);

    const secondResponse = await request(app)
      .post("/deposit")
      .set("Authorization", bearer)
      .send({ coin: 20 });

    expect(secondResponse.body.deposit).toBe(0.7);
  });

  test("returns an error given invalid coin", async () => {
    const response = await request(app)
      .post("/deposit")
      .set("Authorization", await getBearerToken())
      .send({ coin: 30 });

    expect(response.status).toBe(422);
  });

  test("returns an error given invalid body", async () => {
    const response = await request(app)
      .post("/deposit")
      .set("Authorization", await getBearerToken())
      .send({ smt: 123 });

    expect(response.status).toBe(422);
  });
});

const buyerId = new mongoose.Types.ObjectId();
const buyerPassword = createPasswordHash("my-encrypted-pass");
const mockBuyer = {
  _id: buyerId,
  id: buyerId,
  email: "buyer@gmail.com",
  password: buyerPassword,
  role: "buyer",
  deposit: 0,
};
