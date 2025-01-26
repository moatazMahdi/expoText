import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import {Typography} from 'elephanz-rn-ui';
import moment from 'moment';
import {tempTranslate} from 'src/utils/HelpersFunctions';
import SvgView from '../SvgView';
import {Assets} from 'assets';

const DAYS_IN_MONTH = new Array(36).fill(0).map((_, index) => index + 1);

const PADDING_DAYS = new Array(6).fill(null);

const specialDays = {
  1: 'gift',
  8: 'gift',
  15: 'gift',
  22: 'gift',
  29: 'gift',
};

const CalendarComponent = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const today = new Date().getDate();
  const navigation = useNavigation();
  
  const {
    images: {
      screens: {creditech},
    },
  } = Assets;

  const handleDayPress = day => {
    setSelectedDay(day);
    const selectedDate = new Date(2024, 10, day + 1);
    navigation.navigate('blueNovemberViewAll', {selectedDate});
  };

  const CalendarHeader = () => {
    return (
      <View
        style={{
          width: '100%',
          backgroundColor: '#FFCA00',
          paddingVertical: 8,
          flexDirection: 'row',
          alignItems: 'center',
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
        }}>
        <View
          style={{
            width: wp(60),
            height: hp(60),
            borderRadius: wp(99),
            backgroundColor: 'white',
            marginStart: wp(35),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <SvgView
            svgFile={creditech.calendarFavorite}
            width={30}
            height={30}
          />
        </View>
        <View style={{marginStart: 25}}>
          <Typography style={styles.dateText}>
            {tempTranslate('Date', 'تاريخ')}
          </Typography>
          <Typography style={styles.calenderDate}>
            {moment().format('D MMM, YYYY')}
          </Typography>
        </View>
      </View>
    );
  };

  const renderDay = ({item, index}) => {
    if (item === null || [36, 35, 34, 33, 32, 31].includes(item)) {
      return <View style={[styles.emptyDayContainer, {marginEnd: wp(14)}]} />;
    }
    

    const isSelected = selectedDay === item;
    const isSpecialDay = specialDays[item];
    const dayNumber = item.toString();
    const day =  item === today || item === today + 1 || item === today + 2 ;
    const isPastDay =  item < today || item > today + 2;
    
    return (
      <TouchableOpacity
        style={[
          styles.dayContainer,
          {
            marginEnd: wp(14),
            backgroundColor: isSpecialDay
              ? '#041F70'
              : day
              ? '#FF7900'
              : 'white',
          },
          // (isSelected && !isSpecialDay ) && styles.selectedDayContainer,
        ]}
        onPress={() => {
          // if(isClickable){
          // }
          handleDayPress(item)}}
        disabled={isPastDay} 
        >
        <Text
          style={[
            styles.dayText,
            {color: (day || isSpecialDay) ? 'white' : 'black'},
            isPastDay  && styles.disabledDayText,
          ]}>
          {dayNumber}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <CalendarHeader />
      <View style={{position: 'relative'}}>
        <FlatList
          data={[...PADDING_DAYS, ...DAYS_IN_MONTH]}
          renderItem={renderDay}
          keyExtractor={(item, index) => index.toString()}
          numColumns={7}
          columnWrapperStyle={[styles.dayRow]}
        />
        <Typography style={styles.novText}>
          {tempTranslate('NOVEMBER', 'نوفمبر')}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 40,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  weekDayContainer: {
    alignItems: 'center',
    width: wp(33),
  },
  weekText: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  dayRow: {
    justifyContent: 'flex-end',
    marginEnd: wp(6),
  },
  dayContainer: {
    width: wp(33),
    height: hp(33),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(40),
    marginTop: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  emptyDayContainer: {
    width: wp(33),
    height: hp(33),
  },
  dayText: {
    fontSize: 14,
  },
  selectedDayContainer: {
    backgroundColor: 'orange',
  },
  selectedDayText: {
    color: '#fff',
  },
  specialDayContainer: {
    borderWidth: 1,
    borderRadius: 20,
  },
  specialDayIcon: {
    fontSize: 18,
    position: 'absolute',
    bottom: -9,
  },
  disabledDayContainer: {
    backgroundColor: '#d3d3d3',
  },
  disabledDayText: {
    color: '#a9a9a9',
  },
  novText: {
    position: 'absolute',
    fontSize: 32,
    fontWeight: 'bold',
    top: 3,
    left: wp(30),
  },
  dateText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  calenderDate: {
    fontSize: 24,
    fontWeight: 'regular',
    color: 'white',
  },
});

export default CalendarComponent;
