import React, {useEffect, useState} from 'react';
import {Alert, View,StyleSheet} from 'react-native';
import {baseScreen} from 'hoc';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import {hp, wp} from 'src/utils/Dimensions/dimen';
import {Typography, useTheme} from 'elephanz-rn-ui';
import DefaultButton from 'src/components/DefaultButton';
import codePush from 'react-native-code-push';
import DeviceInfo from 'react-native-device-info';
import { UpdatingProgressBar } from 'components';
import SvgView from 'src/components/SvgView';
import { Assets } from 'assets';

const TARGET_VERSION = "4.0.2";

const checkUpdate = () => {
    const [appVersion, setAppVersion] = useState("");

    const {
      images: {
        screens: {instantApproval},
      },
    } = Assets;
    
    const {
        theme: {
          palette: {common, primary},
        },
      } = useTheme();
      
  useEffect(() => {
    const getAppVersion = async () => {
      const [update] = await Promise.all([codePush.getUpdateMetadata()]);
      if (update?.label) {
        const label = update.label.substring(1);
        setAppVersion(`${update.appVersion} (${label})`);
      } else {
        const deviceVersion = DeviceInfo.getVersion();
        setAppVersion(deviceVersion);
      }
    };
    getAppVersion();
  }, []);

  const checkVersion = () => {
    if (appVersion < TARGET_VERSION) {
      Alert.alert("Update Available", "Please update the app to the latest version.");
    } else {
      Alert.alert("Up to Date", "Your app is up to date.");
    }
  };

  const ImageContainer=()=>{
    return(
      <View style={styles.imageContainer}>
        <SvgView svgFile={instantApproval.correct} width={48} height={48}/>
      </View>
    )
  }
  
  const TextContainer=()=>{
    return(
      <View style={{justifyContent:'center',alignItems:'center',maxWidth:wp(343)}}>
       <Typography style={styles.newUpdate}>NEW UPDATE IS AVAILABLE (v {appVersion})</Typography>
       <Typography style={{fontSize:24,color:common.black,fontWeight:'700',textAlign:'center'}}>Update your application to the latest version</Typography>
       <Typography style={{fontSize:14,color:common.black,fontWeight:'500',textAlign:'center',lineHeight:24}}>A brand new version is available in the App Store. Please update your app to use all of our features.</Typography>
      </View>
    )
  }

  return (
    <View style={{flex: 1}}>
      <ScrollContainerWithNavHeader
        // title={translate('BUY_NOW')}
        shapeVariant="orange"
        removeCapitalization
        scrollViewStyle={{paddingVertical: hp(24)}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <ImageContainer/>
            <TextContainer/>
         
          <DefaultButton title="Check For Update" onPress={checkVersion} buttonStyle={{position:'absolute',bottom:hp(10)}}/>

        </View>
        {appVersion ? <UpdatingProgressBar /> : null}
      </ScrollContainerWithNavHeader>
    </View>
  );
};

export const CheckUpdate = baseScreen(checkUpdate, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER', 'GUEST'],
});

const styles =StyleSheet.create({
  imageContainer:{
    width:wp(96),
    height:hp(96),
    backgroundColor:'#F0F0F0',
    borderRadius:wp(100),
    alignItems:"center",
    justifyContent:'center'
  },
  newUpdate:{
    fontSize:12,
    fontWeight:'500',
    color:'#039754',
    marginTop:hp(16)
  }
})