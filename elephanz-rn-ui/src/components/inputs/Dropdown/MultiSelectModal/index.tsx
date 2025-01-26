import React,
{
  useState,
} from 'react';
import {
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Typography,
} from 'elephanz-rn-ui/src/components/dataDisplay';
import {
  MultiSelectModalProps,
} from './types';
import {
  Button,
} from '../../Button';

export const MultiSelectModal = (props: MultiSelectModalProps) => {
  const {
    options,
    onSelect,
    values,
  } = props;

  const [
    selectedValues,
    setSelectedValues,
  ] = useState(values || [] as number[]);

  return (
    <View style={{
      height: '100%',
      width: '100%',
    }}
    >
      {
        options?.map((option, index) => (
          <TouchableOpacity
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            onPress={() => {
              let newValues = selectedValues;
              if (newValues?.includes(option.value)) {
                newValues = newValues?.filter((value) => value !== option.value);
              } else {
                newValues = selectedValues?.concat([option.value]);
              }
              setSelectedValues(newValues);
            }}
          >
            <Typography
              customStyles={() => ({
                text: {
                  backgroundColor: selectedValues?.includes(option.value) ? '#eaeaea' : 'white',
                  padding: 12,
                },
              })}
            >
              {option.label}
            </Typography>
          </TouchableOpacity>
        ))
      }
      <Button
        onPress={() => onSelect(selectedValues)}
      >
        Select
      </Button>
    </View>
  );
};

export * from './types';
