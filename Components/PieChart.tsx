import React from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import PieChart from 'react-native-pie-chart';

const TestChart = (widthAndHeight, series) => {
  return (
    <ScrollView style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.title}>Basic</Text>
        <PieChart widthAndHeight={widthAndHeight} series={series} />

        <Text style={styles.title}>Doughnut</Text>
        <PieChart
          widthAndHeight={widthAndHeight}
          series={series}
          cover={0.45}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default TestChart;
