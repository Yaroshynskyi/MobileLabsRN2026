import React, { useContext, useRef } from 'react';
import { Animated, Alert } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import {
  TapGestureHandler,
  LongPressGestureHandler,
  PanGestureHandler,
  FlingGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  State,
  Directions,
} from 'react-native-gesture-handler';
import { GameContext } from '../context/GameContext';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.background};
`;

const ScoreContainer = styled.View`
  position: absolute;
  top: 50px;
  align-items: center;
  background-color: ${(props) => props.theme.colors.surface};
  padding: 20px 40px;
  border-radius: 15px;
  elevation: 3;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
`;

const ScoreLabel = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const ScoreValue = styled.Text`
  font-size: 48px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
`;

const ClickerObject = styled(Animated.View)`
  width: 150px;
  height: 150px;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 75px;
  align-items: center;
  justify-content: center;
  border: 5px solid ${(props) => props.theme.colors.surface};
  elevation: 5;
`;

const ClickerText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 18px;
`;

const LegendContainer = styled.View`
  position: absolute;
  bottom: 20px;
  background-color: ${(props) => props.theme.colors.surface};
  padding: 15px 20px;
  border-radius: 15px;
  width: 90%;
  elevation: 3;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
`;

const LegendRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 6px;
`;

const LegendText = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  margin-left: 10px;
`;

export default function GameScreen() {
  const { score, addScore, updateChallengeProgress } = useContext(GameContext);

  const doubleTapRef = useRef(null);
  const panRef = useRef(null);
  const pinchRef = useRef(null);
  const rotationRef = useRef(null);

  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  const animatePressIn = () => {
    Animated.spring(pressScale, { toValue: 0.9, useNativeDriver: true }).start();
  };

  const animatePressOut = () => {
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true }).start();
  };

  // --- Обробники ---

  const onSingleTap = (event) => {
    if (event.nativeEvent.state === State.BEGAN) {
      animatePressIn();
    } else if (event.nativeEvent.state === State.ACTIVE) {
      addScore(1);
      updateChallengeProgress('tap10');
      animatePressOut();
    } else if (event.nativeEvent.state === State.FAILED || event.nativeEvent.state === State.CANCELLED || event.nativeEvent.state === State.END) {
      animatePressOut();
    }
  };

  const onDoubleTap = (event) => {
    if (event.nativeEvent.state === State.BEGAN) {
      animatePressIn();
    } else if (event.nativeEvent.state === State.ACTIVE) {
      addScore(2);
      updateChallengeProgress('double5');
      animatePressOut();
    } else if (event.nativeEvent.state === State.FAILED || event.nativeEvent.state === State.CANCELLED || event.nativeEvent.state === State.END) {
      animatePressOut();
    }
  };

  const onLongPress = (event) => {
    if (event.nativeEvent.state === State.BEGAN) {
      animatePressIn();
    } else if (event.nativeEvent.state === State.ACTIVE) {
      addScore(5);
      updateChallengeProgress('long3');
      animatePressOut();
      Alert.alert('Бонус!', '+5 очок за довге натискання');
    } else if (event.nativeEvent.state === State.FAILED || event.nativeEvent.state === State.CANCELLED || event.nativeEvent.state === State.END) {
      animatePressOut();
    }
  };

  const onSwipeRight = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      addScore(Math.floor(Math.random() * 10) + 1);
      updateChallengeProgress('swipeRight');
    }
  };

  const onSwipeLeft = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      addScore(Math.floor(Math.random() * 10) + 1);
      updateChallengeProgress('swipeLeft');
    }
  };

  const onPinchEvent = Animated.event([{ nativeEvent: { scale: scale } }], { useNativeDriver: true });
  const onPinchStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      addScore(3);
      updateChallengeProgress('pinch');
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
    }
  };

  const onPanEvent = Animated.event([{ nativeEvent: { translationX: pan.x, translationY: pan.y } }], { useNativeDriver: true });
  const onPanStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      updateChallengeProgress('drag');
      Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
    }
  };

  const onRotateEvent = Animated.event([{ nativeEvent: { rotation: rotation } }], { useNativeDriver: true });
  const onRotateStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      addScore(4);
      updateChallengeProgress('custom');
      Animated.spring(rotation, { toValue: 0, useNativeDriver: true }).start();
    }
  };

  const spin = rotation.interpolate({
    inputRange: [-Math.PI, Math.PI],
    outputRange: ['-180deg', '180deg'],
  });


  const animatedStyle = {
    transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: scale }, { scale: pressScale }, { rotate: spin }],

  };

  return (
    <Container>
      <ScoreContainer>
        <ScoreLabel>Score</ScoreLabel>
        <ScoreValue>{score}</ScoreValue>
      </ScoreContainer>

      <PanGestureHandler ref={panRef} simultaneousHandlers={[pinchRef, rotationRef]} onGestureEvent={onPanEvent} onHandlerStateChange={onPanStateChange}>
        <Animated.View>
          <PinchGestureHandler ref={pinchRef} simultaneousHandlers={[panRef, rotationRef]} onGestureEvent={onPinchEvent} onHandlerStateChange={onPinchStateChange}>
            <Animated.View>
              <RotationGestureHandler ref={rotationRef} simultaneousHandlers={[panRef, pinchRef]} onGestureEvent={onRotateEvent} onHandlerStateChange={onRotateStateChange}>
                <Animated.View>
                  <FlingGestureHandler direction={Directions.RIGHT} onHandlerStateChange={onSwipeRight}>
                    <Animated.View>
                      <FlingGestureHandler direction={Directions.LEFT} onHandlerStateChange={onSwipeLeft}>
                        <Animated.View>
                          <LongPressGestureHandler onHandlerStateChange={onLongPress} minDurationMs={800}>
                            <Animated.View>
                              <TapGestureHandler onHandlerStateChange={onSingleTap} waitFor={doubleTapRef}>
                                <Animated.View>
                                  <TapGestureHandler ref={doubleTapRef} onHandlerStateChange={onDoubleTap} numberOfTaps={2}>
                                    <ClickerObject style={animatedStyle}>
                                      <ClickerText>TAP ME</ClickerText>
                                    </ClickerObject>
                                  </TapGestureHandler>
                                </Animated.View>
                              </TapGestureHandler>
                            </Animated.View>
                          </LongPressGestureHandler>
                        </Animated.View>
                      </FlingGestureHandler>
                    </Animated.View>
                  </FlingGestureHandler>
                </Animated.View>
              </RotationGestureHandler>
            </Animated.View>
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>
      <LegendContainer pointerEvents="none">
        <LegendRow><Ionicons name="finger-print-outline" size={18} color="#0ea5e9" /><LegendText>Tap: +1 point</LegendText></LegendRow>
        <LegendRow><Ionicons name="albums-outline" size={18} color="#0ea5e9" /><LegendText>Double tap: +2 points</LegendText></LegendRow>
        <LegendRow><Ionicons name="time-outline" size={18} color="#0ea5e9" /><LegendText>Long press: +5 points</LegendText></LegendRow>
        <LegendRow><Ionicons name="swap-horizontal-outline" size={18} color="#0ea5e9" /><LegendText>Swipe: +1 to 10 points</LegendText></LegendRow>
        <LegendRow><Ionicons name="contract-outline" size={18} color="#0ea5e9" /><LegendText>Pinch: +3 points</LegendText></LegendRow>
        <LegendRow><Ionicons name="refresh-outline" size={18} color="#0ea5e9" /><LegendText>Rotate: +4 points</LegendText></LegendRow>
      </LegendContainer>
    </Container>
  );
}