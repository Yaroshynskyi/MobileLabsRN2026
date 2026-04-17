import React, { useContext } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { GameContext } from '../context/GameContext';

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
  padding: 15px;
`;

const ChallengeCard = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.surface};
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 12px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
`;

const InfoContainer = styled.View`
  flex: 1;
  margin-left: 15px;
`;

const ChallengeTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 4px;
`;

const ProgressBarContainer = styled.View`
  height: 6px;
  background-color: ${(props) => props.theme.colors.border};
  border-radius: 3px;
  overflow: hidden;
  margin-right: 15px;
`;

const ProgressBarFill = styled.View`
  height: 100%;
  background-color: ${(props) => (props.completed ? props.theme.colors.success : props.theme.colors.primary)};
  width: ${(props) => props.percentage}%;
`;

const ProgressText = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-top: 4px;
`;

export default function ChallengesScreen() {
  const { challenges } = useContext(GameContext);

  const renderItem = ({ item }) => {
    const progressPercentage = Math.min((item.progress / item.target) * 100, 100);

    return (
      <ChallengeCard>
        <Ionicons
          name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={28}
          color={item.completed ? '#22c55e' : '#64748b'}
        />
        <InfoContainer>
          <ChallengeTitle>{item.title}</ChallengeTitle>
          <ProgressBarContainer>
            <ProgressBarFill completed={item.completed} percentage={progressPercentage} />
          </ProgressBarContainer>
          <ProgressText>
            {item.progress} / {item.target}
          </ProgressText>
        </InfoContainer>
      </ChallengeCard>
    );
  };

  return (
    <Container>
      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}