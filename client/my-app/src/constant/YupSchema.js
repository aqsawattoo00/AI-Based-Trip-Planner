import * as yup from "yup";

export const AiPlanningSchema = yup.object({
  // Section 1 — Trip Basic Info
  startingCity: yup.string()
    .required("Enter your starting city")
    .min(2, "City name is too short")
    .matches(/^[a-zA-Z\s'\-\.,]+$/, "Please enter a valid city name"),
  destination: yup.string()
    .required("Enter your destination")
    .min(2, "Destination name is too short")
    .matches(/^[a-zA-Z\s'\-\.,]+$/, "Please enter a valid destination"),
  tripType:      yup.string().required("Select a trip type"),
  numberOfPeople: yup.number()
    .typeError("Enter number of people")
    .positive("Must be at least 1")
    .integer("Must be a whole number")
    .required("Enter number of people"),
  tripDuration:  yup.number()
    .typeError("Enter trip duration in days")
    .positive("Must be at least 1 day")
    .integer("Must be a whole number")
    .required("Enter trip duration"),

  // Section 2 — Budget & Travel Style
  budgetRange:          yup.string().required("Enter your budget range"),
  travelStyle:          yup.string().required("Select a travel style"),
  transportPreference:  yup.mixed().optional(),
  hotelType:            yup.mixed().optional(),

  // Section 3 — Travel Preferences (all optional)
  environmentPreference: yup.mixed().optional(),
  activities:            yup.mixed().optional(),
  foodPreference:        yup.string().optional(),
  familyFriendly:        yup.string().optional(),

  // Section 4 — Travel Details
  travelMonth:   yup.string().required("Enter your travel month"),
  flexibleDates: yup.string().optional(),

  // Section 5 — Special Requirements (optional)
  customRequests: yup.string().optional(),
});

export const RegisterSchema = yup.object({
  name: yup.string().trim().required("Enter full name"),
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Enter email address"),
  password: yup
    .string()
    .required("Enter password")
    .min(8, "Password must be at least 8 characters"),
 
});

export const LoginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Enter email address"),
  password: yup
    .string()
    .required("Enter password")
    .min(8, "Password must be at least 8 characters"),
});

export const ForgotPasswordSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Enter email address"),
});

export const ResetPasswordSchema = yup.object({
  password: yup
    .string()
    .required("Enter password")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});


export const testimonialSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  message: yup
    .string()
    .required('Testimonial message is required')
    .min(20, 'Message must be at least 20 characters')
    .max(500, 'Message must not exceed 500 characters'),
});