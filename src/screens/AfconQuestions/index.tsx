import React, {useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import ScrollContainerWithNavHeader from 'src/components/Wrappers/SafeAreaScrollContainer';
import DropShadowWrapper from 'src/components/Wrappers/DropShadowWrapper';
import DefaultOverLayLoading from 'src/components/DefaultOverLayLoading';
import {useLocalization, useNavigationUtils, useStores} from 'hooks';
import {Typography, useStyles, useTheme} from 'elephanz-rn-ui';
import {Question, SubmitResult, UserProgress} from 'src/Types';
import {ApplicationAnalytics} from 'src/utils/firebaseUtils';
import {tempTranslate} from 'src/utils/HelpersFunctions';
import DefaultButton from 'src/components/DefaultButton';
import CouponModal from './components/couponModal';
import {hp} from 'src/utils/Dimensions/dimen';
import Progress from './components/progress';
import Choices from './components/choices';
import {baseScreen} from 'hoc';
import styles from './styles';

const afconQuestions: React.FC = () => {
  const {todayQuestion} =
    (useRoute().params as {
      todayQuestion?: Question;
    }) || {};

  const [progressLoading, setProgressLoading] = useState<boolean>(true);
  const [userProgress, setUserProgress] = useState<UserProgress>();
  const [submitResult, setSubmitResult] = useState<SubmitResult>({
    isUserChoiceCorrect: null,
    shouldUserRewarded: null,
    voucher: null,
  });
  const [selectedChoice, setSelectedChoice] = useState<string>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [userChoice, setUserChoice] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const {selectStyle} = useStyles(styles);
  const {goBack} = useNavigationUtils();
  const {translate} = useLocalization();
  const stores = useStores();

  const {
    theme: {
      palette: {common},
    },
  } = useTheme();

  useEffect(() => {
    const getProgress = async () => {
      try {
        setProgressLoading(true);
        const progress = await stores.backend.general.getUserProgress();
        setUserProgress(progress);
      } finally {
        setProgressLoading(false);
      }
    };

    getProgress();
  }, [submitResult?.isUserChoiceCorrect]);

  const answerQuestion = async () => {
    try {
      setIsLoading(true);
      const data = await stores.backend.general.submitAfconAnswer({
        questionId: +todayQuestion?.id,
        choiceId: +selectedChoice,
      });
      ApplicationAnalytics(
        {eventKey: 'answer_afconQuestion', type: 'CTA'},
        stores,
      );
      setUserChoice(selectedChoice);
      setModalVisible(data?.shouldUserRewarded);
      setSubmitResult(data);
      setIsLoading(false);
    } catch ({response}) {
      setIsLoading(false);
      response?.data?.statusCode?.includes(5)
        ? Alert.alert('', translate('ERROR'), [
            {
              text: translate('GENERIC_CONFIRM'),
            },
          ])
        : Alert.alert('', response?.data?.message, [
            {
              text: translate('GENERIC_CONFIRM'),
            },
          ]);
    }
  };

  return (
    <View style={{flex: 1}}>
      {isLoading && <DefaultOverLayLoading />}

      <ScrollContainerWithNavHeader
        shapeVariant="orange"
        title={translate('TODAY_QUESTION')}>
        <CouponModal
          voucher={submitResult?.voucher}
          modalVisible={modalVisible}
          onCloseModal={() => setModalVisible(false)}
          stores={stores}
        />

        <Progress
          progressLoading={progressLoading}
          userProgress={userProgress}
          shouldUserRewarded={submitResult?.shouldUserRewarded}
        />

        {todayQuestion ? (
          <>
            <DropShadowWrapper
              style={[
                selectStyle('questionContainer'),
                {marginBottom: hp(24)},
              ]}>
              <View
                style={[
                  selectStyle('containerStyle'),
                  {backgroundColor: common.white},
                ]}>
                <Typography
                  customStyles={() => ({
                    text: selectStyle('questionStyle'),
                  })}>
                  {tempTranslate(
                    todayQuestion?.description?.en,
                    todayQuestion?.description?.ar,
                  )}
                </Typography>
              </View>
            </DropShadowWrapper>

            <Choices
              todayQuestion={todayQuestion}
              submitResult={submitResult}
              userChoice={userChoice}
              selectedChoice={selectedChoice}
              setSelectedChoice={setSelectedChoice}
            />

            <DefaultButton
              buttonStyle={selectStyle('buttonStyle')}
              loading={isLoading}
              disabled={!selectedChoice}
              onPress={
                submitResult?.isUserChoiceCorrect === null
                  ? answerQuestion
                  : () => goBack()
              }
              title={
                submitResult?.isUserChoiceCorrect === null
                  ? translate('CONFIRM')
                  : translate('GO_HOME')
              }
              titleStyle={selectStyle('T16_500')}
            />
          </>
        ) : (
          <Typography
            customStyles={() => ({
              text: selectStyle('questionStyle'),
            })}>
            {tempTranslate(
              `Excellent work on today's question! We'd love to have you back tomorrow for a new question.`,
              `انت جاوبت سؤال النهارده، متنساش كل يوم فيه سؤال جديد عشان تكسب الجايزة.`,
            )}
          </Typography>
        )}
      </ScrollContainerWithNavHeader>
    </View>
  );
};

export const AfconQuestions = baseScreen(afconQuestions, {
  allowedRoles: ['CLIENT', 'ADMIN', 'USER'],
});
