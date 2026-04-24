import { sendAlert } from "./sendgrid";

// Spy that replaces sgMail.send() — records calls without sending real emails
const mockSend = jest.fn().mockResolvedValue({});

// Replace the entire @sendgrid/mail package with a fake for all tests in this file
jest.mock("@sendgrid/mail", () => ({
  __esModule: true,
  default: {
    setApiKey: jest.fn(),
    setDataResidency: jest.fn(),
    send: (...args: any[]) => mockSend(...args),
  },
}));

// Helper to set or delete env vars — pass undefined to simulate a missing var
function setEnv(overrides: Record<string, string | undefined>) {
  Object.entries(overrides).forEach(([k, v]) => {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  });
}

// A fully valid env — every test starts from this state
const validEnv = {
  SENDGRID_API_KEY: "SG.test",
  ALERT_EMAIL_TO: "to@example.com",
  ALERT_EMAIL_FROM: "from@example.com",
};

// Reset the spy and restore valid env before each test so they don't affect each other
beforeEach(() => {
  mockSend.mockClear();
  setEnv(validEnv);
});

// Clean up env vars after each test so they don't leak into other test suites
afterEach(() => {
  setEnv({
    SENDGRID_API_KEY: undefined,
    ALERT_EMAIL_TO: undefined,
    ALERT_EMAIL_FROM: undefined,
  });
});

describe("sendAlert", () => {
  it("sends an email with the correct fields", async () => {
    await sendAlert("Site down", "example.com is not responding");

    // Should have called send exactly once with the right payload
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "to@example.com",
        from: "from@example.com",
        subject: "Site down",
        text: "example.com is not responding",
      })
    );
  });

  it("skips sending when SENDGRID_API_KEY is missing", async () => {
    setEnv({ SENDGRID_API_KEY: undefined });
    await sendAlert("Site down", "example.com is not responding");
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("skips sending when ALERT_EMAIL_TO is missing", async () => {
    setEnv({ ALERT_EMAIL_TO: undefined });
    await sendAlert("Site down", "example.com is not responding");
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("skips sending when ALERT_EMAIL_FROM is missing", async () => {
    setEnv({ ALERT_EMAIL_FROM: undefined });
    await sendAlert("Site down", "example.com is not responding");
    expect(mockSend).not.toHaveBeenCalled();
  });
});
