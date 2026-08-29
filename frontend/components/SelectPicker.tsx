import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { getThemeColors } from '../styles/theme';
import { useApp } from '../context/AppContext';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectPickerProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: any;
}

export const SelectPicker: React.FC<SelectPickerProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  style
}) => {
  const { theme } = useApp();
  const colors = getThemeColors(theme);
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(o => o.value === value);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setIsOpen(true)}
        style={[
          styles.trigger,
          {
            backgroundColor: colors.bgInput,
            borderColor: colors.border,
          },
          style
        ]}
      >
        <Text style={[styles.triggerText, { color: selectedOption ? colors.textMain : colors.textMuted }]} numberOfLines={1}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <FontAwesome6 name="chevron-down" size={10} color={colors.textMuted} style={{ marginLeft: 6 }} />
      </TouchableOpacity>

      {isOpen && (
        <Modal transparent animationType="fade" visible={isOpen}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsOpen(false)}
          >
            <View
              style={[
                styles.dropdownMenu,
                {
                  backgroundColor: colors.bgCard,
                  borderColor: colors.border,
                  shadowColor: '#000',
                }
              ]}
            >
              <ScrollView style={{ maxHeight: 260 }}>
                {options.map(opt => {
                  const isSelected = opt.value === value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      activeOpacity={0.7}
                      onPress={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                      }}
                      style={[
                        styles.optionItem,
                        isSelected && {
                          backgroundColor: colors.isDark ? 'rgba(22, 93, 255, 0.2)' : 'rgba(18, 63, 168, 0.1)',
                        }
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color: isSelected ? colors.brandAccent : colors.textMain,
                            fontWeight: isSelected ? '700' : '500',
                          }
                        ]}
                      >
                        {opt.label}
                      </Text>
                      {isSelected && <FontAwesome6 name="check" size={11} color={colors.brandAccent} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 110,
  },
  triggerText: {
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdownMenu: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 8,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  optionText: {
    fontSize: 13,
  }
});
