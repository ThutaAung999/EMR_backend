import z from "zod";

export const zodPatientSchema = z.object({

    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
    }),
    description: z.string({
        required_error: "description is required",
        invalid_type_error: "Description must be a string",
    }),
    doctors: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/), {message: "Invalid doctor ID"}),
    diseases: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/), {message: "Invalid diseases ID"}),
});

export const zodPatientUpdateSchema = zodPatientSchema.partial();
