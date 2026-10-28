import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "test-secret-that-is-at-least-32-characters-long";

const { authenticate, authorizeRoles } = await import("../middlewares/auth.js");
const { isPositiveInteger, isValidProductIdInput } = await import("../utils/cart.validation.js");
const { parsePagination } = await import("../utils/catalog.validation.js");

const response = () => {
    const result = {};
    return {
        result,
        status(code) {
            result.status = code;
            return this;
        },
        json(body) {
            result.body = body;
            return this;
        }
    };
};

test("customer middleware rejects missing authentication", () => {
    const res = response();
    authenticate({ headers: {} }, res, () => assert.fail("next should not run"));
    assert.equal(res.result.status, 401);
});

test("customer authorization rejects a vendor role", () => {
    const res = response();
    authorizeRoles("customer")({ user: { userId: 7, role: "vendor" } }, res, () => {
        assert.fail("next should not run");
    });
    assert.equal(res.result.status, 403);
});

test("customer JWT identity is read from the verified token", () => {
    const token = jwt.sign(
        { userId: 42, email: "customer@example.com", role: "customer" },
        process.env.JWT_SECRET,
        { algorithm: "HS256" }
    );
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = response();
    let nextCalled = false;
    authenticate(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    assert.equal(req.user.userId, 42);
    assert.equal(req.user.role, "customer");
});

test("cart quantities must be positive integers", () => {
    assert.equal(isPositiveInteger(1), true);
    assert.equal(isPositiveInteger(0), false);
    assert.equal(isPositiveInteger(-1), false);
    assert.equal(isPositiveInteger(1.5), false);
    assert.equal(isPositiveInteger("1"), false);
});

test("cart product IDs must be present strings", () => {
    assert.equal(isValidProductIdInput("507f1f77bcf86cd799439011"), true);
    assert.equal(isValidProductIdInput(""), false);
    assert.equal(isValidProductIdInput(null), false);
});

test("catalog pagination rejects invalid and oversized pages", () => {
    assert.deepEqual(parsePagination({}), { page: 1, pageSize: 20 });
    assert.throws(() => parsePagination({ page: "0" }), /positive integer/);
    assert.throws(() => parsePagination({ pageSize: "51" }), /between 1 and 50/);
});
