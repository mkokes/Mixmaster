import * as React from 'react';
import { View, Text, Pressable, Modal, FlatList, ViewStyle, TextStyle } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

const Select = React.forwardRef<View, SelectProps>(
  ({ options, value, onValueChange, placeholder = 'Select...', disabled, style, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    
    const selectedOption = options.find(option => option.value === value);

    const handleSelect = (optionValue: string) => {
      onValueChange?.(optionValue);
      setIsOpen(false);
    };

    const triggerStyles: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 16,
      paddingVertical: 12,
      minHeight: 44,
      opacity: disabled ? 0.5 : 1,
      ...style,
    };

    const triggerTextStyles: TextStyle = {
      color: selectedOption ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
      fontSize: 16,
      fontWeight: '500',
      flex: 1,
    };

    const modalStyles: ViewStyle = {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    };

    const contentStyles: ViewStyle = {
      backgroundColor: '#1a1a1a',
      borderRadius: 12,
      width: '90%',
      maxWidth: 400,
      maxHeight: '60%',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    };

    const optionStyles: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    };

    const optionTextStyles: TextStyle = {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '500',
      flex: 1,
    };

    const renderOption = ({ item, index }: { item: SelectOption; index: number }) => {
      const isSelected = item.value === value;
      const isLast = index === options.length - 1;

      return (
        <Pressable
          style={[
            optionStyles,
            isLast && { borderBottomWidth: 0 },
            { backgroundColor: isSelected ? 'rgba(34, 197, 94, 0.1)' : 'transparent' }
          ]}
          onPress={() => handleSelect(item.value)}
        >
          <Text style={[optionTextStyles, isSelected && { color: '#22c55e' }]}>
            {item.label}
          </Text>
          {isSelected && (
            <Check size={20} color="#22c55e" />
          )}
        </Pressable>
      );
    };

    return (
      <>
        <Pressable
          ref={ref}
          style={({ pressed }) => [
            triggerStyles,
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => !disabled && setIsOpen(true)}
          disabled={disabled}
          {...props}
        >
          <Text style={triggerTextStyles}>
            {selectedOption?.label || placeholder}
          </Text>
          <ChevronDown 
            size={20} 
            color="rgba(255, 255, 255, 0.6)" 
            style={{ 
              transform: [{ rotate: isOpen ? '180deg' : '0deg' }] 
            }} 
          />
        </Pressable>

        <Modal
          visible={isOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsOpen(false)}
        >
          <Pressable style={modalStyles} onPress={() => setIsOpen(false)}>
            <Pressable style={contentStyles} onPress={(e) => e.stopPropagation()}>
              <FlatList
                data={options}
                renderItem={renderOption}
                keyExtractor={(item) => item.value}
                showsVerticalScrollIndicator={false}
              />
            </Pressable>
          </Pressable>
        </Modal>
      </>
    );
  }
);

Select.displayName = 'Select';

export { Select };
export type { SelectOption, SelectProps };
