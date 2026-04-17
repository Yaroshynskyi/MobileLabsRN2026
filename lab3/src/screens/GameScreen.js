import React, { useContext, useRef } from 'react';
import { Animated, Alert } from 'react-native';
import styled from 'styled-components/native';
import {
  TapGestureHandler,
  LongPressGestureHandler,
  PanGestureHandler,
  FlingGestureHandler,
  PinchGestureHandler,
  State,
  Directions,
} from 'react-native-gesture-handler';
import { GameContext } from '../context/GameContext';

// --- Styled Components ---
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

export default function GameScreen() {
  const { score, addScore, updateChallengeProgress } = useContext(GameContext);

  const doubleTapRef = useRef(null);
  const panRef = useRef(null);

  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;


  const onSingleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      addScore(1);
      updateChallengeProgress('tap10');
    }
  };

  const onDoubleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      addScore(2);
      updateChallengeProgress('double5');
    }
  };

  const onLongPress = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      addScore(5);
      updateChallengeProgress('long3');
      Alert.alert('Бонус!', '+5 очок за довге натискання');
    }
  };

  const onSwipeRight = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const randomPoints = Math.floor(Math.random() * 10) + 1;
      addScore(randomPoints);
      updateChallengeProgress('swipeRight');
    }
  };

  const onSwipeLeft = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const randomPoints = Math.floor(Math.random() * 10) + 1;
      addScore(randomPoints);
      updateChallengeProgress('swipeLeft');
    }
  };

  const onPinchEvent = Animated.event([{ nativeEvent: { scale: scale } }], {
    useNativeDriver: true,
  });

  const onPinchStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      addScore(3);
      updateChallengeProgress('pinch');
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const onPanEvent = Animated.event(
    [{ nativeEvent: { translationX: pan.x, translationY: pan.y } }],
    { useNativeDriver: true }
  );

  const onPanStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      updateChallengeProgress('drag');
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
      }).start();
    }
  };

  const animatedStyle = {
    transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: scale }],
  };

  return (
    <Container>
      <ScoreContainer>
        <ScoreLabel>Score</ScoreLabel>
        <ScoreValue>{score}</ScoreValue>
      </ScoreContainer>

      <PanGestureHandler ref={panRef} onGestureEvent={onPanEvent} onHandlerStateChange={onPanStateChange}>
        <Animated.View>
          <FlingGestureHandler direction={Directions.RIGHT} onHandlerStateChange={onSwipeRight}>
            <Animated.View>
              <FlingGestureHandler direction={Directions.LEFT} onHandlerStateChange={onSwipeLeft}>
                <Animated.View>
                  <PinchGestureHandler onGestureEvent={onPinchEvent} onHandlerStateChange={onPinchStateChange}>
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
                  </PinchGestureHandler>
                </Animated.View>
              </FlingGestureHandler>
            </Animated.View>
          </FlingGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </Container>
  );
}