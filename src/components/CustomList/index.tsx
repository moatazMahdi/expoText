import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { hp, wp } from 'src/utils/Dimensions/dimen';

const CustomList = ({ messages, colors }) => {
  return (
    <View
      style={[styles.container, { backgroundColor: colors.backgroundColor }]}
    >
      {messages.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <View style={[styles.bullet, { borderColor: colors.bullet }]} />
          <Text style={[styles.itemText, { color: colors.text }]}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: wp(8),
    paddingLeft: wp(8),
    paddingRight: wp(16),
    borderRadius: wp(6),
    justifyContent: 'center',
    // height: ,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
    // ,
    // backgroundColor: 'red'
  },
  bullet: {
    width: wp(6),
    height: hp(6),
    borderWidth: wp(3),
    borderRadius: wp(20),
    marginRight: wp(8),
    marginTop: hp(4),
  },
  itemText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#31363F',
    lineHeight: 16,
  },
});

export default CustomList;
