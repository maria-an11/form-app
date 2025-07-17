import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./App.css";

const STORAGE_KEY = "myFormData";

export default function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const savedValues = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    firstName: "",
    lastName: "",
    age: "",
    address: "",
    placeOfWork: "",
    jobTitle: "",
    phoneNumber: "",
    linkedin: "",
  };

  const formik = useFormik({
    initialValues: savedValues,
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      age: Yup.number()
        .positive("Must be positive")
        .integer("Must be an integer")
        .required("Required"),
      address: Yup.string().required("Required"),
      placeOfWork: Yup.string().required("Required"),
      jobTitle: Yup.string().required("Required"),
      phoneNumber: Yup.string().required("Required"),

      linkedin: Yup.string()
        .transform((value, originalValue) => {
          if (originalValue && !/^https?:\/\//i.test(originalValue)) {
            return `https://${originalValue}`;
          }
          return originalValue;
        })
        .url("Must be a valid URL")
        .test(
          "is-linkedin-url",
          "Must be a valid LinkedIn URL",
          (value) => value && value.toLowerCase().includes("linkedin.com/in/")
        )
        .required("Required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch("/api/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error("Failed to submit form");
        }

        setShowToast(true);
        resetForm();
        localStorage.removeItem(STORAGE_KEY);

        setTimeout(() => setShowToast(false), 3000);
      } catch (error) {
        alert("Error submitting form. Please try again.");
        console.error(error);
      }
    },
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formik.values));
  }, [formik.values]);

  return (
    <main className="container">
      {showToast && (
        <div className="success-toast" role="status" aria-live="polite">
          ✅ Form submitted successfully!
        </div>
      )}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Form</h1>
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="toggle-button"
        >
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </header>

      <form onSubmit={formik.handleSubmit} className="form">
        <div className="columns first-row">
          <div>
            <label htmlFor="firstName" className="visually-hidden">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              placeholder="First name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-describedby="firstName-error"
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className="error" id="firstName-error">
                {formik.errors.firstName}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="visually-hidden">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              placeholder="Last name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-describedby="lastName-error"
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className="error" id="lastName-error">
                {formik.errors.lastName}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="age" className="visually-hidden">
              Age
            </label>
            <input
              id="age"
              name="age"
              type="number"
              placeholder="Age"
              value={formik.values.age}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-describedby="age-error"
            />
            {formik.touched.age && formik.errors.age && (
              <div className="error" id="age-error">
                {formik.errors.age}
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="address" className="visually-hidden">
            Address
          </label>
          <input
            id="address"
            name="address"
            placeholder="Address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-describedby="address-error"
          />
          {formik.touched.address && formik.errors.address && (
            <div className="error" id="address-error">
              {formik.errors.address}
            </div>
          )}
        </div>

        <div className="columns">
          <div>
            <label htmlFor="placeOfWork" className="visually-hidden">
              Place of Work
            </label>
            <input
              id="placeOfWork"
              name="placeOfWork"
              placeholder="Place of work"
              value={formik.values.placeOfWork}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-describedby="placeOfWork-error"
            />
            {formik.touched.placeOfWork && formik.errors.placeOfWork && (
              <div className="error" id="placeOfWork-error">
                {formik.errors.placeOfWork}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="jobTitle" className="visually-hidden">
              Job Title
            </label>
            <input
              id="jobTitle"
              name="jobTitle"
              placeholder="Job title"
              value={formik.values.jobTitle}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-describedby="jobTitle-error"
            />
            {formik.touched.jobTitle && formik.errors.jobTitle && (
              <div className="error" id="jobTitle-error">
                {formik.errors.jobTitle}
              </div>
            )}
          </div>
        </div>

        <div className="columns">
          <div>
            <label htmlFor="phoneNumber" className="visually-hidden">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Phone number"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-describedby="phoneNumber-error"
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <div className="error" id="phoneNumber-error">
                {formik.errors.phoneNumber}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="linkedin" className="visually-hidden">
              LinkedIn
            </label>
            <input
              id="linkedin"
              name="linkedin"
              placeholder="LinkedIn"
              value={formik.values.linkedin}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-describedby="linkedin-error"
            />
            {formik.touched.linkedin && formik.errors.linkedin && (
              <div className="error" id="linkedin-error">
                {formik.errors.linkedin}
              </div>
            )}
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
