import z from 'zod';

export const zodPatientSchema = z.object({
  //name: z.string().nonempty("Name is required"),
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  age: z.number({
    required_error: 'Age is required',
    invalid_type_error: 'Age must be a number',
  }),
  doctors: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/), {
    message: 'Invalid doctor ID',
  }),
  diseases: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/), {
    message: 'Invalid diseases ID',
  }),
});

export const zodPatientUpdateSchema = zodPatientSchema.partial();
