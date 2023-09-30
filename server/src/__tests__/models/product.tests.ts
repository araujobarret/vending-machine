import request from "supertest";
import mongoose from "mongoose";
import app, { server } from "../../app";
import { userModel } from "../../models/user";
import { productModel } from "../../models/product";
import { createPasswordHash } from "../../services/auth";

beforeEach(async () => {
  // Connect to a test database
  await mongoose.connect(process.env.MONGODB_URI!);

  // Insert mock data into the database
  await userModel.create(mockSeller);
  await userModel.create(mockSeller2);
  await userModel.create(mockBuyer);
});

afterEach(async () => {
  // Disconnect from the test database and remove it
  server.close();
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("/product", () => {
  const getBearerToken = async (user: any) => {
    const login = await request(app).post("/login").send({
      email: user.email,
      password: user.password,
    });
    return `Bearer ${login.text}`;
  };

  const addProduct = async (user: any, body: any = product) => {
    return request(app)
      .post("/product")
      .set("Authorization", await getBearerToken(user))
      .send(body);
  };

  describe("POST", () => {
    test("successfully creates a product", async () => {
      const response = await addProduct(mockSeller);

      expect(response.status).toBe(200);
      expect(response.body.amountAvailable).toBe(10);
      expect(response.body.productName).toBe("chips");
      expect(response.body.cost).toBe(0.7);
    });

    test("returns an error given invalid body", async () => {
      const response = await addProduct(mockSeller, {
        productName: "chips",
        cost: 0.7,
      });

      expect(response.status).toBe(422);
    });

    test("returns an error given a buyer user type", async () => {
      const response = await addProduct(mockBuyer);

      expect(response.status).toBe(403);
    });
  });

  describe("GET", () => {
    test("successfully gets a product", async () => {
      const response = await addProduct(mockSeller);
      const productId = response.body.id;
      const getResponse = await request(app).get(`/product/${productId}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.id).toBe(productId);
      expect(getResponse.body.cost).toBe(0.7);
      expect(getResponse.body.amountAvailable).toBe(10);
    });

    test("returns 404 when getting a non existing product", async () => {
      const response = await request(app).get(
        `/product/${new mongoose.Types.ObjectId()}`
      );

      expect(response.status).toBe(404);
    });
  });

  describe("PUT", () => {
    test("successfully updates a product", async () => {
      const response = await addProduct(mockSeller);
      const putResponse = await request(app)
        .put(`/product/${response.body.id}`)
        .set("Authorization", await getBearerToken(mockSeller))
        .send({ ...product, cost: 2.0 });

      expect(putResponse.status).toBe(200);
      expect(putResponse.body.cost).toBe(2);
    });

    test("returns an error when updating with the wrong body", async () => {
      const response = await addProduct(mockSeller);

      const putResponse = await request(app)
        .put(`/product/${response.body.id}`)
        .set("Authorization", await getBearerToken(mockSeller))
        .send({ cost: 2.0 });

      expect(putResponse.status).toBe(422);
    });
  });

  describe("DELETE", () => {
    test("successfully deletes a product", async () => {
      const response = await addProduct(mockSeller);
      const deleteResponse = await request(app)
        .delete(`/product/${response.body.id}`)
        .set("Authorization", await getBearerToken(mockSeller));

      expect(deleteResponse.status).toBe(200);
    });

    test("returns an error when a different seller tries to delete a product", async () => {
      const response = await addProduct(mockSeller2);
      const deleteResponse = await request(app)
        .delete(`/product/${response.body.id}`)
        .set("Authorization", await getBearerToken(mockSeller));

      expect(deleteResponse.status).toBe(403);
    });

    test("returns 404 when trying to delete a non-existing product", async () => {
      const response = await request(app).get(
        `/product/${new mongoose.Types.ObjectId()}`
      );

      expect(response.status).toBe(404);
    });
  });
});

const sellerId = new mongoose.Types.ObjectId();
const sellerPassword = createPasswordHash("my-encrypted-pass");
const mockSeller = {
  _id: sellerId,
  id: sellerId,
  email: "seller@gmail.com",
  password: sellerPassword,
  role: "seller",
  deposit: 1.2,
};
const seller2Id = new mongoose.Types.ObjectId();
const seller2Password = createPasswordHash("my-encrypted-pass");
const mockSeller2 = {
  _id: seller2Id,
  id: seller2Id,
  email: "seller2@gmail.com",
  password: seller2Password,
  role: "seller",
  deposit: 1.2,
};

const buyerId = new mongoose.Types.ObjectId();
const buyerPassword = createPasswordHash("my-encrypted-pass");
const mockBuyer = {
  _id: buyerId,
  id: buyerId,
  email: "buyer@gmail.com",
  password: buyerPassword,
  role: "buyer",
  deposit: 1.2,
};

const product = {
  productName: "chips",
  cost: 0.7,
  amountAvailable: 10,
};
