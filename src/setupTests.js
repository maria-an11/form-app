import "@testing-library/jest-dom";

beforeAll(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
});
