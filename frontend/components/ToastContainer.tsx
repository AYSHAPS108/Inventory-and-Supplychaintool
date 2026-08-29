import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { FontAwesome6 } from '@expo/vector-icons';
import { getThemeColors } from '../styles/theme';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast, theme } = useApp();
  const colors = getThemeColors(theme);

  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map(toast => {
        let iconName = 'circle-info';
        let iconColor = colors.brandAccent;
        let borderColor = colors.border;
        let bgColor = colors.bgCard;

        if (toast.type === 'success') {
          iconName = 'circle-check';
          iconColor = colors.statusSuccess;
          borderColor = colors.statusSuccess;
        } else if (toast.type === 'danger') {
          iconName = 'circle-exclamation';
          iconColor = colors.statusDanger;
          borderColor = colors.statusDanger;
        } else if (toast.type === 'warning') {
          iconName = 'triangle-exclamation';
          iconColor = colors.statusWarning;
          borderColor = colors.statusWarning;
        }

        return (
          <TouchableOpacity
            key={toast.id}
            activeOpacity={0.8}
            onPress={() => removeToast(toast.id)}
            style={[
              styles.toast,
              {
                backgroundColor: bgColor,
                borderColor: borderColor,
              }
            ]}
          >
            <FontAwesome6 name={iconName} size={16} color={iconColor} style={{ marginRight: 10 }} />
            <Text style={[styles.text, { color: colors.textMain }]}>{toast.message}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 9999,
    maxWidth: 380,
    gap: 8,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 6,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
  }
});
