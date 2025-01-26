import {
  FormikHandlers,
} from 'formik';

export const fakeChangeEvent = (value: any): React.ChangeEvent<any> => ({
  target: {
    value,
  },
} as any);

export const onChange = (
  handleChange: FormikHandlers['handleChange'],
  location: string,
) => (value: any) => handleChange(location)(fakeChangeEvent(value));
