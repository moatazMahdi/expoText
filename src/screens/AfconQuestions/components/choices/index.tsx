import React from 'react';
import { Pressable } from 'react-native';
import { View } from 'native-base';
import DropShadowWrapper from 'src/components/Wrappers/DropShadowWrapper';
import { Typography, useStyles, useTheme } from 'elephanz-rn-ui';
import { tempTranslate } from 'src/utils/HelpersFunctions';
import { hp } from 'src/utils/Dimensions/dimen';
import SvgView from 'src/components/SvgView';
import { Assets } from 'assets';
import styles from './styles';

const Choices: React.FC<any> = (props) => {
  const {
    todayQuestion,
    submitResult,
    userChoice,
    selectedChoice,
    setSelectedChoice,
  } = props;

  const { selectStyle } = useStyles(styles);

  const {
    images: {
      screens: { creditech },
    },
  } = Assets;

  const {
    theme: {
      palette: { common },
    },
  } = useTheme();

  return todayQuestion
    ? todayQuestion?.choices?.map((choice) => {
        const isCorrect =
          (choice?.isCorrect && submitResult?.isUserChoiceCorrect !== null) ||
          (submitResult?.isUserChoiceCorrect && choice?.id === userChoice);

        const wrongAnswerIsPressed =
          !submitResult?.isUserChoiceCorrect && choice?.id === userChoice;

        return (
          <DropShadowWrapper
            style={[
              selectStyle('questionContainer'),
              { marginVertical: hp(7) },
            ]}
          >
            <Pressable
              disabled={submitResult?.isUserChoiceCorrect !== null}
              style={[
                selectStyle('containerStyle'),
                selectStyle('choicesContainer'),
                {
                  borderColor: isCorrect
                    ? '#56C490'
                    : wrongAnswerIsPressed
                    ? '#FE5353'
                    : common.white,
                },
              ]}
              key={choice.id}
              onPress={() => {
                setSelectedChoice(choice.id);
              }}
            >
              <View style={selectStyle('rowCenterView')}>
                <View
                  style={[
                    selectStyle('radioButton'),
                    {
                      backgroundColor:
                        choice?.id === selectedChoice
                          ? common.darkOrange
                          : common.brightGray,
                    },
                  ]}
                >
                  <View
                    style={[
                      selectStyle('smallCircle'),
                      {
                        backgroundColor:
                          choice?.id === selectedChoice
                            ? common.white
                            : common.brightGray,
                      },
                    ]}
                  />
                </View>

                <Typography
                  customStyles={() => ({
                    text: selectStyle('choiceStyle'),
                  })}
                >
                  {tempTranslate(
                    choice?.description?.en,
                    choice?.description?.ar,
                  )}
                </Typography>
              </View>

              {isCorrect || wrongAnswerIsPressed ? (
                <View
                  style={[
                    selectStyle('correctOrWrong'),
                    { backgroundColor: isCorrect ? '#56C490' : '#FE5353' },
                  ]}
                >
                  <SvgView
                    svgFile={isCorrect ? creditech.Correct : creditech.Wrong}
                    width={16}
                    height={16}
                  />

                  <Typography
                    customStyles={() => ({
                      text: selectStyle('answerText'),
                    })}
                  >
                    {isCorrect
                      ? tempTranslate('Correct answer', 'اجابة صحيحة')
                      : tempTranslate('Your answer', 'اجابتك')}
                  </Typography>
                </View>
              ) : null}
            </Pressable>
          </DropShadowWrapper>
        );
      })
    : null;
};

export default Choices;
