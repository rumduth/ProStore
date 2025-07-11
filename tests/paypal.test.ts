import { generateAccessToken } from "../lib/paypal";
import { paypal } from "../lib/paypal";
// Test to generate access token from paypal
test("generates token from paypal", async () => {
  const tokenResponse = await generateAccessToken();
  expect(typeof tokenResponse).toBe("string");
  expect(tokenResponse.length).toBeGreaterThan(0);
});

// Test to create a paypal order
test("creates a paypal order", async function () {
  const price = 10.0;
  const orderResponse = await paypal.createOrder(price);
  expect(orderResponse).toHaveProperty("id");
  expect(orderResponse).toHaveProperty("status");
  expect(orderResponse.status).toBe("CREATED");
});

// Test to capture payment with a mock order
test("simulate capturing a payment from an order", async function () {
  const orderId = "100";
  const mockCapturePayment = jest
    .spyOn(paypal, "capturePayment")
    .mockResolvedValue({
      status: "COMPLETED",
    });
  const captureResponse = await paypal.capturePayment(orderId);
  expect(captureResponse).toHaveProperty("status", "COMPLETED");
  mockCapturePayment.mockRestore();
});
