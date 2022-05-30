import { toast, ToastOptions } from 'react-toastify';

const toastOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const notify = {
  warn: (text: string) => toast.warn(text, toastOptions),
  success: (text: string) => toast.success(text, toastOptions),
  error: (text: string) => toast.error(text, toastOptions),
};
