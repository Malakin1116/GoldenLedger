import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import styles from './styles';

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="#5a8a9a" />
    </View>
  );
};

export default LoadingOverlay;