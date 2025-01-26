import React from 'react';
import { formError } from 'src/Types';
import { Typography, useStyles } from 'elephanz-rn-ui';
import styles from './styles';

const ErrorField: React.FC<any> = (props: { data: formError }) => {
  const { data } = props;

  const { selectStyle } = useStyles(styles);

  return data?.errorCondition ? (
    <Typography
      customStyles={() => ({
        text: selectStyle('errorMessage'),
        ...data?.textStyle,
      })}
    >
      {data?.error}
    </Typography>
  ) : null;
};

export default ErrorField;
