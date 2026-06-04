import { z } from "zod";
import {
  businessTypeOptions,
  currencyOptions,
  timezoneOptions,
} from "@/lib/organizations";

const businessTypes = businessTypeOptions.map((option) => option.value);
const currencies = currencyOptions.map((option) => option.value);
const timezones = timezoneOptions.map((option) => option.value);

export const organizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter a workspace name.")
    .max(100, "Workspace name must be 100 characters or fewer."),
  businessType: z.enum(businessTypes, {
    error: "Choose a business type.",
  }),
  currency: z.enum(currencies, {
    error: "Choose a currency.",
  }),
  timezone: z.enum(timezones, {
    error: "Choose a timezone.",
  }),
});
