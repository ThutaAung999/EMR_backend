import React from 'react';
import instance from '../../../utils/axios'; // Import the custom Axios instance
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Paper, Title, Container } from '@mantine/core';

const Signup: React.FC = () => {
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },

    validate: {
      name: (value) => (value ? null : 'Name is required'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 8 ? null : 'Password must be at least 8 characters long'),
      passwordConfirm: (value, values) => value === values.password ? null : 'Passwords do not match',
    },
  });

  const handleSignup = async (values: typeof form.values) => {
    try {
      // Send a POST request to the signup endpoint with form values
      const response = await instance.post('/api/users/signup', values);

      // Log the success message and response data
      console.log('Registration successful:', response.data);

      // Optionally, handle successful registration (e.g., redirect or show success message)
      // Example: Redirect to login page after successful registration
      // history.push('/login');
    } catch (error) {
      // Log the error message
      console.error('Registration error:', error);

      // Handle error (e.g., show error message to the user)
      // Example: Show an error message using a toast notification library
      // showToast('error', 'Registration failed. Please try again.');
    }
  };

  return (
    <Container size={420} my={40} className="w-full flex flex-grow flex-col">
      <Title align="center">Sign Up</Title>
      <Paper withBorder shadow="md" padding="lg" mt="lg" radius="md" className="p-3">
        <form onSubmit={form.onSubmit(handleSignup)}>
          <TextInput
            label="Name"
            placeholder="Your name"
            {...form.getInputProps('name')}
            className="mb-4"
          />
          <TextInput
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps('email')}
            className="mb-4"
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            {...form.getInputProps('password')}
            className="mb-4"
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            {...form.getInputProps('passwordConfirm')}
            className="mb-4"
          />
          <Button fullWidth mt="xl" type="submit">
            Sign Up
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Signup;
