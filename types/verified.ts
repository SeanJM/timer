import Validator from "verified";

Validator.create({
  StringNumber: (value) => typeof value === "string" && /^[0-9]+$/.test(value)
});