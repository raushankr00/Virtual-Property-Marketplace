import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [alertInfo, setAlertInfo] = useState({
    display: false,
    message: '',
    type: '',
  });

  const toggleAlert = (message, type) => {
    setAlertInfo({ display: true, message, type });
    setTimeout(() => {
      setAlertInfo({ display: false, message: '', type: '' });
    }, 5000);
  };

  const onSubmit = (data) => {
    console.log('Form submitted', data);
    toggleAlert('Form submission was successful!', 'success');
    reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-4">Contact Us</h2>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <input
              type="text"
              {...register('name', { required: 'Please enter your name' })}
              className="w-full p-2 border rounded-md"
              placeholder="Name"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <input
              type="email"
              {...register('email', {
                required: 'Please enter a valid email address',
              })}
              className="w-full p-2 border rounded-md"
              placeholder="Email"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <input
              type="text"
              {...register('subject', { required: 'Please enter a subject' })}
              className="w-full p-2 border rounded-md"
              placeholder="Subject"
            />
            {errors.subject && (
              <span className="text-red-500 text-sm">
                {errors.subject.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <textarea
              rows={4}
              {...register('message', { required: 'Please enter a message' })}
              className="w-full p-2 border rounded-md"
              placeholder="Message"
            ></textarea>
            {errors.message && (
              <span className="text-red-500 text-sm">
                {errors.message.message}
              </span>
            )}
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
      {alertInfo.display && (
        <div
          className={`mt-4 text-center text-${
            alertInfo.type === 'success' ? 'green' : 'red'
          }-500`}
        >
          {alertInfo.message}
        </div>
      )}
    </div>
  );
}