import React, { useContext } from 'react';
import { Switch, View } from 'react-native';
import styled from 'styled-components/native';
import { GameContext } from '../context/GameContext';
import { ThemeContext } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
  padding: 20px;
`;

const Header = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 20px;
`;

const StatCard = styled.View`
  background-color: ${(props) => props.theme.colors.surface};
  padding: 20px;
  border-radius: 15px;
  align-items: center;
  margin-bottom: 15px;
  elevation: 3;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
`;

const ThemeCard = styled(StatCard)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StatNumber = styled.Text`
  font-size: 40px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
`;

const StatLabel = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-top: 5px;
`;

const ThemeLabel = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
`;

const CompletedList = styled.ScrollView`
  flex: 1;
`;

const CompletedItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 15px;
  background-color: ${(props) => props.theme.colors.surface};
  margin-bottom: 10px;
  border-radius: 10px;
`;

const ItemText = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.colors.text};
  margin-left: 10px;
`;

export default function SettingsScreen() {
  const { challenges, score } = useContext(GameContext);
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

  const completedChallenges = challenges.filter((ch) => ch.completed);

  return (
    <Container>
      <ThemeCard>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name={isDarkTheme ? "moon" : "sunny"} size={24} color={isDarkTheme ? "#38bdf8" : "#f59e0b"} />
          <ThemeLabel style={{ marginLeft: 10 }}>Темна тема</ThemeLabel>
        </View>
        <Switch 
          value={isDarkTheme} 
          onValueChange={toggleTheme}
          trackColor={{ false: "#cbd5e1", true: "#0ea5e9" }}
          thumbColor={"#ffffff"}
        />
      </ThemeCard>

      <Header>Ваша Статистика</Header>

      <StatCard>
        <StatNumber>{score}</StatNumber>
        <StatLabel>Загальна кількість очок</StatLabel>
      </StatCard>

      <StatCard>
        <StatNumber>{completedChallenges.length} / {challenges.length}</StatNumber>
        <StatLabel>Завдань виконано</StatLabel>
      </StatCard>

      <Header>Виконані завдання:</Header>
      <CompletedList showsVerticalScrollIndicator={false}>
        {completedChallenges.length === 0 ? (
          <StatLabel>Ще немає виконаних завдань. Пограйте трохи!</StatLabel>
        ) : (
          completedChallenges.map((ch) => (
            <CompletedItem key={ch.id}>
              <Ionicons name="checkmark-done-circle" size={24} color="#22c55e" />
              <ItemText>{ch.title}</ItemText>
            </CompletedItem>
          ))
        )}
      </CompletedList>
    </Container>
  );
}