// src/components/Input/index.tsx
import { Text, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import styles from './styles';
import React, { useState } from 'react';
import { HidePassIcon, ViewPassIcon } from '../../assets/icons/index';

interface IInput {
  onBlur?: () => void;
  value: string;
  onChangeText: (text: string) => void;
  placeholderColor?: string;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  additionalContainerStyle?: ViewStyle;
  additionInputStyle?: ViewStyle;
  onFocus?: () => void;
}

export default function Input({
  onBlur,
  placeholder,
  value,
  onChangeText,
  placeholderColor = 'rgba(221, 227, 227, 0.35)',
  error,
  secureTextEntry = false,
  additionalContainerStyle,
  additionInputStyle,
  onFocus,
}: IInput) {
  const [isPassHidden, setIsPassHidden] = useState(secureTextEntry);

  return (
    <>
      <View style={[styles.inputContainer, additionalContainerStyle]}>
        <TextInput
          placeholder={placeholder}
          style={[styles.input, additionInputStyle]}
          placeholderTextColor={placeholderColor}
          onBlur={onBlur}
          onFocus={onFocus}
          value={value}
          onChangeText={text => onChangeText(text)}
          secureTextEntry={isPassHidden}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => {
              setIsPassHidden(!isPassHidden);
            }}
            hitSlop={{ top: 15, bottom: 15, right: 15, left: 15 }}
          >
            {isPassHidden ? (
              <ViewPassIcon fill={'rgb(13, 255, 106)'} />
            ) : (
              <HidePassIcon fill={'rgb(195, 255, 13)'} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
}