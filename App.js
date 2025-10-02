import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';


// Create a BMI calculator application. It should have the option to store BMI along with the current date. 
// The user may view how their BMI has changed over the course of time. 
// Your app may also provide feedback based on the BMI score of the user. 
// Use your design sense to come up with a standard design. 

export default function App() {
  const [BMI, setBMI] = useState('');
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [history, setHistory] = useState([]);
  const [displayHistory, setDisplayHistory] = useState(false);

  useEffect(() => {
      // Save BMI data to storage
    const saveBMI = async () => {
      try {
        const existingData = await AsyncStorage.getItem('bmiData');
        const bmiData = existingData ? JSON.parse(existingData) : [];
        bmiData.push({ bmi: BMI, date });
        await AsyncStorage.setItem('bmiData', JSON.stringify(bmiData));
      } catch (error) {
        console.error('Error saving BMI data:', error);
      }
    };  

    if (BMI && date) {
      saveBMI();
    }
  }, [BMI, date]);

  // Load previous BMI data 
  useEffect(() => {
    const loadBMI = async () => {
    try {
      const existingData = await AsyncStorage.getItem('bmiData');
      if (existingData) {
        const bmiData = JSON.parse(existingData);
        // Display or use the loaded data as needed
        setDisplayHistory(true);
        setHistory(bmiData);
      }
    } catch (error) {
      console.error('Error loading BMI data:', error);
    }
  };

    loadBMI();
  }, []);

  // BMI = (Weight in pounds) / (Height in inches)^2 x 703 
  const calculateBMI = (weight, height) => {
    // Validate inputs
    if (!weight || !height) {
      alert('Please enter both weight and height');
      return;
    }
    if (isNaN(weight) || isNaN(height)) {
      alert('Please enter valid numbers for weight and height');
      return;
    }
    const bmi = (weight / (height * height) * 703);
    setBMI(bmi.toFixed(2));
    // Get current date
    const currentDate = new Date().toLocaleDateString();
    setDate(currentDate);
  };

  // Display feedback based on BMI score
  const getBMIFeedback = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi < 24.9) return 'Normal weight';
    if (bmi >= 25 && bmi < 29.9) return 'Overweight';
    return 'Obesity';
  }

  const reset = () => {
    setBMI('');
    setDate('');
    setWeight('');
    setHeight('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>BMI Calculator</Text>
      <Text style={styles.text}>Enter your weight (lbs) and height (inches):</Text>
      <TextInput
        style={styles.input}
        placeholder="Weight in pounds"
        value={weight ? weight : ''}
        keyboardType="numeric"
        onChangeText={(text) => setWeight(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Height in inches"
        value={height ? height : ''}
        keyboardType="numeric"
        onChangeText={(text) => setHeight(text)}
      />
      <TouchableOpacity
        style={styles.calculateButton}
        onPress={() => calculateBMI(weight, height)}
      >
        <Text style={styles.buttonText}>Calculate BMI</Text>
      </TouchableOpacity>
      {BMI ? (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.text}>Your BMI is: {BMI}</Text>
          <Text style={styles.text}>Date: {date}</Text>
          <Text style={styles.text}>Feedback: {getBMIFeedback(BMI)}</Text>
        </View>
      ) : null}
      <TouchableOpacity
        style={styles.resetButton}      
        onPress={() => reset()}
      >
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.showHistoryButton}
        onPress={() => setDisplayHistory(!displayHistory)}
      >
        <Text style={styles.buttonText}>Show History</Text>
      </TouchableOpacity>
      {!displayHistory && history.length > 0 && (
        history.map((entry, index) => (
          <Text style={styles.text} key={index}>Date: {entry.date}, BMI: {entry.bmi}</Text>
        ))
      )}
      <StatusBar style="auto" />
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'floralwhite',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'darkolivegreen',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'darkolivegreen',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  calculateButton: { 
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'darkgoldenrod',
    padding: 7,
    borderRadius: 5,
  },
  showHistoryButton: { 
    marginTop: 25,
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'darkgoldenrod',
    padding: 7,
    borderRadius: 5,
  },
  resetButton: { 
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'darkgoldenrod',
    padding: 7,
    borderRadius: 5,
  },
  input: {
    height: 40, 
    borderWidth: 1, 
    marginBottom: 10, 
    width: 200, 
    paddingHorizontal: 10,
    borderColor: "darkgoldenrod",
    borderRadius: 20,
  }
});
