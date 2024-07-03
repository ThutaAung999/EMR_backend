import React, { useContext } from 'react';
import axios from 'axios';
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Paper, Title, Container, Notification } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { AuthContext } from '../providers/AuthContext';

const Login = () => {
  const { setAuth } = useContext(AuthContext)!;
  const [notification, setNotification] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 8 ? null : 'Password must be at least 8 characters long'),
    },
  });

  const handleLogin = async (values: typeof form.values) => {
    try {
      const response = await axios.post('/api/login', values);
      console.log('Login successful:', response.data);
      setAuth({
        token: response.data.token,
        isAuthenticated: true,
      });
      setNotification({ message: 'Login successful!', type: 'success' });
      // Handle successful login (e.g., redirect or store token)
    } catch (error) {
      console.error('Login error:', error);
      setNotification({ message: 'Login failed. Please check your credentials and try again.', type: 'error' });
    }
  };

  return (
    <Container size={420} className="min-h-screen flex items-center justify-center">
      {notification && (
        <Notification
          icon={notification.type === 'success' ? <IconCheck size={18} /> : <IconX size={18} />}
          color={notification.type === 'success' ? 'teal' : 'red'}
          onClose={() => setNotification(null)}
          className="absolute top-4"
        >
          {notification.message}
        </Notification>
      )}
      <Paper withBorder shadow="md" p={30} radius="md" className="w-full">
        <Title align="center" className="mb-6 text-2xl font-bold">Log In</Title>
        <form onSubmit={form.onSubmit(handleLogin)}>
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
            className="mb-6"
          />
          <Button fullWidth mt="xl" type="submit" className="bg-blue-500 hover:bg-blue-600">
            Log In
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
