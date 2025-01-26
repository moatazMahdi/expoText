/* eslint-disable default-case */
import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {useTheme, useStyles} from 'elephanz-rn-ui';
import * as Progress from 'react-native-progress';
import codePush from 'react-native-code-push';
import styles from './styles';

export const UpdatingProgressBar = () => {
  const [showDownloadingBar, setShowDownloadingBar] = useState(false);
  const [progress, setProgress] = useState(0);

  const {selectStyle} = useStyles(styles);

  const {
    theme: {
      palette: {primary},
    },
  } = useTheme();

  const immediateUpdate = () => {
    codePush.sync(
      {
        // installMode: codePush.InstallMode.ON_NEXT_RESTART
        installMode: codePush.InstallMode.IMMEDIATE,
        rollbackRetryOptions: {
          maxRetryAttempts: 10,
          delayInHours: 1,
        },
      },
      status => {
        switch (status) {
          case codePush.SyncStatus.CHECKING_FOR_UPDATE:
            break;
          case codePush.SyncStatus.AWAITING_USER_ACTION:
            break;
          case codePush.SyncStatus.DOWNLOADING_PACKAGE:
            // Show "downloading" modal
            setShowDownloadingBar(true);
            break;
          case codePush.SyncStatus.INSTALLING_UPDATE:
            // Hide "downloading" modal
            setShowDownloadingBar(false);
            break;
          case codePush.SyncStatus.UP_TO_DATE:
            break;
          case codePush.SyncStatus.UPDATE_IGNORED:
            setShowDownloadingBar(false);

            break;
          case codePush.SyncStatus.UPDATE_INSTALLED:
            setShowDownloadingBar(false); // need to be revised

            break;
          case codePush.SyncStatus.SYNC_IN_PROGRESS:
            break;
          case codePush.SyncStatus.UNKNOWN_ERROR:
            setShowDownloadingBar(false);

            break;
        }
      },
      ({receivedBytes, totalBytes}) => {
        /* Update download bar progress */
        setProgress(receivedBytes / totalBytes);
      },
    );
  };

  const appCheckUpdate = () => {
    codePush.checkForUpdate().then(update => {
      if (update) {
        immediateUpdate();
      }
    });
  };

  useEffect(() => {
    codePush.notifyAppReady().then(() => {
      appCheckUpdate();
    });
  }, []);

  if (showDownloadingBar) {
    return (
      <View style={selectStyle('container')}>
        <Progress.Bar
          style={selectStyle('progress')}
          progress={progress}
          width={250}
          borderRadius={0}
          useNativeDriver
          color={primary.value}
          unfilledColor="rgba(35, 148, 184, 0.25)"
          borderWidth={0}
        />
        <Text style={selectStyle('updatingText')}>updating...</Text>
      </View>
    );
  }

  return null;
};
