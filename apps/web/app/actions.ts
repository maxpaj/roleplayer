"use server";

import { z } from "zod";

const schema = z.object({
  name: z.string({
    invalid_type_error: "Invalid Email",
  }),
});

export async function createCampaign(formData: FormData) {
  const validatedFields = schema.safeParse({
    name: formData.get("name"),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Mutate data
}
