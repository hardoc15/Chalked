import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import { useAppStore } from '../../stores/appStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'ClassSelection'>;

// Mock professor data - in real app this would come from school's faculty directory API
const MOCK_PROFESSORS = [
  { id: 'prof-1', name: 'Dr. Sarah Smith', department: 'Computer Science', courses: ['CS 101', 'CS 201'] },
  { id: 'prof-2', name: 'Prof. Michael Johnson', department: 'Mathematics', courses: ['MATH 201', 'MATH 301'] },
  { id: 'prof-3', name: 'Dr. Emily Williams', department: 'English', courses: ['ENG 102', 'ENG 205'] },
  { id: 'prof-4', name: 'Prof. David Brown', department: 'History', courses: ['HIST 150', 'HIST 250'] },
  { id: 'prof-5', name: 'Dr. Lisa Davis', department: 'Physics', courses: ['PHYS 201', 'PHYS 301'] },
  { id: 'prof-6', name: 'Prof. James Miller', department: 'Chemistry', courses: ['CHEM 101', 'CHEM 201'] },
  { id: 'prof-7', name: 'Dr. Maria Garcia', department: 'Biology', courses: ['BIO 101', 'BIO 202'] },
  { id: 'prof-8', name: 'Prof. Robert Wilson', department: 'Economics', courses: ['ECON 101', 'ECON 201'] },
  { id: 'prof-9', name: 'Dr. Jennifer Taylor', department: 'Psychology', courses: ['PSYC 101', 'PSYC 201'] },
  { id: 'prof-10', name: 'Prof. Thomas Anderson', department: 'Philosophy', courses: ['PHIL 101', 'PHIL 201'] },
];

const MAX_PROFESSORS = 7;

export default function ClassSelectionScreen({ navigation }: Props) {
  const [selectedProfessors, setSelectedProfessors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthenticated, user, setUser } = useAppStore();

  const handleProfessorToggle = (professorId: string) => {
    setSelectedProfessors(prev => {
      if (prev.includes(professorId)) {
        // Remove professor
        return prev.filter(id => id !== professorId);
      } else {
        // Add professor if under limit
        if (prev.length >= MAX_PROFESSORS) {
          Alert.alert('Limit Reached', `You can only select up to ${MAX_PROFESSORS} professors.`);
          return prev;
        }
        return [...prev, professorId];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedProfessors.length === 0) {
      Alert.alert('Error', 'Please select at least one professor');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement API call to save selected professors
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user with selected professors
      if (user) {
        const updatedUser = {
          ...user,
          selectedProfessors: selectedProfessors,
        };
        setUser(updatedUser);
      }

      setAuthenticated(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to save professors. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Your Professors</Text>
        <Text style={styles.subtitle}>
          Choose up to {MAX_PROFESSORS} professors you currently have classes with
        </Text>
      </View>

      <ScrollView style={styles.classList} showsVerticalScrollIndicator={false}>
        {MOCK_PROFESSORS.map((professor) => {
          const isSelected = selectedProfessors.includes(professor.id);
          const isDisabled = !isSelected && selectedProfessors.length >= MAX_PROFESSORS;
          return (
            <TouchableOpacity
              key={professor.id}
              style={[
                styles.classItem,
                isSelected && styles.classItemSelected,
                isDisabled && styles.classItemDisabled
              ]}
              onPress={() => handleProfessorToggle(professor.id)}
              disabled={isDisabled}
            >
              <View style={styles.classInfo}>
                <Text style={[
                  styles.className,
                  isSelected && styles.classNameSelected,
                  isDisabled && styles.classNameDisabled
                ]}>
                  {professor.name}
                </Text>
                <Text style={[
                  styles.professorName,
                  isSelected && styles.professorNameSelected,
                  isDisabled && styles.professorNameDisabled
                ]}>
                  {professor.department} • {professor.courses.join(', ')}
                </Text>
              </View>
              <View style={[
                styles.checkbox,
                isSelected && styles.checkboxSelected,
                isDisabled && styles.checkboxDisabled
              ]}>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.selectedCount}>
          {selectedProfessors.length} / {MAX_PROFESSORS} professor{selectedProfessors.length !== 1 ? 's' : ''} selected
        </Text>
        <TouchableOpacity
          style={[styles.continueButton, isLoading && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={isLoading}
        >
          <Text style={styles.continueButtonText}>
            {isLoading ? 'Saving...' : 'Continue to Chalked'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8892b0',
    textAlign: 'center',
  },
  classList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  classItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  classItemSelected: {
    borderColor: '#00d4aa',
    backgroundColor: '#1a2332',
  },
  classItemDisabled: {
    opacity: 0.5,
    backgroundColor: '#0f1419',
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  classNameSelected: {
    color: '#00d4aa',
  },
  classNameDisabled: {
    color: '#4a5568',
  },
  professorName: {
    fontSize: 14,
    color: '#8892b0',
  },
  professorNameSelected: {
    color: '#10b981',
  },
  professorNameDisabled: {
    color: '#374151',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#00d4aa',
    borderColor: '#00d4aa',
  },
  checkboxDisabled: {
    borderColor: '#1e293b',
    backgroundColor: '#0f1419',
  },
  checkmark: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderTopColor: '#374151',
    borderTopWidth: 1,
  },
  selectedCount: {
    fontSize: 14,
    color: '#8892b0',
    textAlign: 'center',
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: '#00d4aa',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#4a5568',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
});