import React,
{
  useState,
  useEffect,
} from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Animated,
  ViewStyle,
  Dimensions,
  I18nManager,
} from 'react-native';
import styles from './styles';
import {
  GeneralTooltipProps,
  Dimensions as TooltipDimensions,
  TooltipPosition,
} from './types';
import {
  useStyles,
} from '../../../theming/utils/useStyles';
import {
  Typography,
} from '..';

const SCREEN_WIDTH = Dimensions.get('window').width;
export const TRIANGLE_WIDTH = 16;
const MARGIN_HORIZONTAL = 24;

export const Tooltip = (props: GeneralTooltipProps) => {
  const {
    children,
    onClose,
    text,
    isVisible,
    contentContainer,
    tooltipPosition = TooltipPosition.TOP,
  } = props;

  const {
    selectStyle,
  } = useStyles(styles);

  const {
    isRTL,
  } = I18nManager;

  const [
    postionValue,
  ] = useState(new Animated.ValueXY({
    x: 0,
    y: 0,
  }));

  const [
    tooltipDirection,
    setTooltipDirection,
  ] = useState(tooltipPosition);

  useEffect(() => {
    if (isRTL) {
      if (tooltipPosition === TooltipPosition.LEFT) {
        setTooltipDirection(TooltipPosition.RIGHT);
      }
      if (tooltipPosition === TooltipPosition.RIGHT) {
        setTooltipDirection(TooltipPosition.LEFT);
      }
    }
  }, []);

  const [
    layout,
    setLayout,
  ] = useState<TooltipDimensions>({
    width: 0,
    height: 0,
  });

  const [
    tooltipLayout,
    setTooltipLayout,
  ] = useState<TooltipDimensions>({
    width: 0,
    height: 0,
  });

  const [
    containerLayout,
    setContainerLayout,
  ] = useState<TooltipDimensions>({
    width: 0,
    height: 0,
  });

  const [
    ref,
    setRef,
  ] = useState<any>();

  const [
    isTootltipVisible,
    setTootltipVisibility,
  ] = useState(true);

  function hideTooltip() {
    setTootltipVisibility(false);
    onClose();
  }
  const position: Animated.AnimatedProps<React.ComponentPropsWithRef<typeof View>>['style'] = layout ? {
    transform: [
      {
        translateY: postionValue.y,
      },
      {
        translateX: postionValue.x,
      },
    ],
    height: layout.height,
    width: layout.width,
    position: 'absolute',
    display: isRTL ? 'none' : 'flex',
  } : {};
  const OldChild = React.cloneElement(children);
  const NewChild = React.cloneElement(children);

  if (ref && ref.measure) {
    ref.measure((fx: number, fy: number, w: number, h: number, pageX: number, pageY: number) => {
      if (!Number.isNaN(pageX) && !Number.isNaN(pageY)) {
        postionValue.setValue({
          x: pageX,
          y: pageY,
        });
      }
    });
  }

  const getTriangleStyle = (_position: TooltipPosition): ViewStyle[] => {
    const triangleStyles: any[] = [selectStyle('triangle')];
    switch (_position) {
      case TooltipPosition.TOP:
        triangleStyles.push({
          transform: [
            {
              translateX: Animated.add(postionValue.x, new Animated.Value(layout.width / 2 - TRIANGLE_WIDTH / 2)),
            },
            {
              translateY: Animated.subtract(postionValue.y, new Animated.Value(TRIANGLE_WIDTH)),
            },
          ],
        });
        triangleStyles.push(selectStyle('triangleBottom'));
        break;
      case TooltipPosition.BOTTOM:
        triangleStyles.push({
          transform: [
            {
              translateX: Animated.add(postionValue.x, new Animated.Value(layout.width / 2 - TRIANGLE_WIDTH / 2)),
            },
            {
              translateY: Animated.add(postionValue.y, new Animated.Value(layout.height)),
            },
          ],
        });
        triangleStyles.push(selectStyle('triangleTop'));
        break;
      case TooltipPosition.LEFT:
        triangleStyles.push({
          transform: [
            {
              translateX: Animated.subtract(postionValue.x, new Animated.Value(TRIANGLE_WIDTH)),
            },
            {
              translateY: Animated.add(postionValue.y, new Animated.Value(layout.height / 2 - TRIANGLE_WIDTH / 2)),
            },
          ],
        });
        triangleStyles.push(isRTL ? selectStyle('triangleLeft') : selectStyle('triangleRight'));
        break;
      default:
        triangleStyles.push(isRTL ? selectStyle('triangleRight') : selectStyle('triangleLeft'));
        triangleStyles.push({
          transform: [
            {
              translateX: Animated.add(postionValue.x, new Animated.Value(layout.width)),
            },
            {
              translateY: Animated.add(postionValue.y, new Animated.Value(layout.height / 2 - TRIANGLE_WIDTH / 2)),
            },
          ],
        });
        break;
    }
    return triangleStyles as ViewStyle[];
  };
  const getTextContainerStyles = (_position: TooltipPosition): ViewStyle[] => {
    const textContainerStyles: any[] = [{
      position: 'absolute',
    }];
    const horizontalTextContainerStyle = {
      justifyContent: 'center',
      top: '50%',
      bottom: '50%',
      marginVertical: 'auto',
      alignContent: 'center',
      alignItems: 'center',
      transform: [
        {
          translateY: Animated.add(postionValue.y, new Animated.Value((layout.height - containerLayout.height) / 2)),
        },
      ],
      marginHorizontal: 0,
    };
    const maxLeft = Math.max(MARGIN_HORIZONTAL, SCREEN_WIDTH - tooltipLayout.width - 24);
    const verticalTextContainerStyle = {
      left: isRTL
        ? undefined
        : Animated.add(postionValue.x, new Animated.Value(layout.width / 2 - tooltipLayout.width / 2))
          .interpolate({
            inputRange: [-99999, MARGIN_HORIZONTAL, maxLeft, 99999],
            outputRange: [MARGIN_HORIZONTAL, MARGIN_HORIZONTAL, maxLeft, maxLeft],
          }),
      right: !isRTL
        ? undefined
        : Animated.add(postionValue.x, new Animated.Value(layout.width / 2 - tooltipLayout.width / 2))
          .interpolate({
            inputRange: [-99999, MARGIN_HORIZONTAL, maxLeft, 99999],
            outputRange: [MARGIN_HORIZONTAL, MARGIN_HORIZONTAL, maxLeft, maxLeft],
          }),
      maxWidth: SCREEN_WIDTH - MARGIN_HORIZONTAL * 2,
    };
    switch (_position) {
      case TooltipPosition.TOP:
        textContainerStyles.push(verticalTextContainerStyle);
        textContainerStyles.push({
          flexDirection: 'column-reverse',
          bottom: Animated.subtract(new Animated.Value(containerLayout.height + TRIANGLE_WIDTH), postionValue.y),
        });
        break;
      case TooltipPosition.BOTTOM:
        textContainerStyles.push(verticalTextContainerStyle);
        textContainerStyles.push({
          top: Animated.add(postionValue.y, new Animated.Value(layout.height + TRIANGLE_WIDTH)),
        });
        break;
      case TooltipPosition.LEFT:
        textContainerStyles.push(horizontalTextContainerStyle);
        textContainerStyles.push({
          maxWidth: Animated.subtract(postionValue.x, new Animated.Value(MARGIN_HORIZONTAL + TRIANGLE_WIDTH)),
          right: isRTL
            ? undefined
            : Animated.subtract(new Animated.Value(SCREEN_WIDTH + TRIANGLE_WIDTH), postionValue.x),
          left: !isRTL
            ? undefined
            : Animated.subtract(new Animated.Value(SCREEN_WIDTH + TRIANGLE_WIDTH), postionValue.x),
        });
        break;
      default:
        textContainerStyles.push(horizontalTextContainerStyle);
        textContainerStyles.push({
          maxWidth: Animated.subtract(
            new Animated.Value(SCREEN_WIDTH - layout.width - MARGIN_HORIZONTAL - TRIANGLE_WIDTH),
            postionValue.x,
          ),
          left: isRTL
            ? undefined
            : Animated.add(new Animated.Value(layout.width + TRIANGLE_WIDTH), postionValue.x),
          right: !isRTL
            ? undefined
            : Animated.add(new Animated.Value(layout.width + TRIANGLE_WIDTH), postionValue.x),
        });
        break;
    }
    return textContainerStyles as ViewStyle[];
  };

  return (
    <>
      <Modal
        animated
        animationType="fade"
        visible={isVisible && isTootltipVisible}
        transparent
      >
        <TouchableOpacity
          onPress={() => hideTooltip()}
          style={selectStyle('container')}
          onLayout={(ev) => {
            setContainerLayout({
              width: ev.nativeEvent.layout.width,
              height: ev.nativeEvent.layout.height,
            });
          }}
        >
          <Animated.View style={[position]}>
            <View
              style={contentContainer}
            >
              {OldChild}
            </View>
          </Animated.View>
          <Animated.View
            style={getTriangleStyle(tooltipDirection)}
          />
          <Animated.View
            style={getTextContainerStyles(tooltipDirection)}
          >
            <View
              style={selectStyle('textBody')}
            >
              <View
                onLayout={(event) => {
                  setTooltipLayout(event.nativeEvent.layout);
                }}
                style={[
                  selectStyle('textStyle'),
                ]}
              >
                <Typography
                  variant="button"
                  customStyles={() => ({
                    text: selectStyle('tip'),
                  })}
                >
                  {text}
                </Typography>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
      <View
        ref={(e) => {
          setRef(e);
        }}
        onLayout={(event) => {
          setLayout(event.nativeEvent.layout);
        }}
        style={contentContainer}
      >
        {NewChild}
      </View>
    </>
  );
};

export * from './types';
