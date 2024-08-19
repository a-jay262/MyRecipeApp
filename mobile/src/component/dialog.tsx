import React from 'react';
import { View, StyleSheet } from 'react-native';
import Dialog from 'react-native-dialog';

interface ConfirmDialogProps {
  visible: boolean;
  onConfirm: (confirm: boolean) => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ visible, onConfirm, onCancel }) => {
  return (
    <View style={styles.overlay}>
      <Dialog.Container visible={visible}>
        <View style={styles.dialogContainer}>
          <Dialog.Title style={styles.dialogTitle}>Make Recipe Public</Dialog.Title>
          <Dialog.Description style={styles.dialogDescription}>
            Do you want to make this recipe public?
          </Dialog.Description>
          <View style={styles.buttonContainer}>
            <Dialog.Button
              label="No"
              onPress={() => { onCancel(); onConfirm(false); }}
              style={styles.buttonNo}
            />
            <Dialog.Button
              label="Yes"
              onPress={() => { onCancel(); onConfirm(true); }}
              style={styles.buttonYes}
            />
          </View>
        </View>
      </Dialog.Container>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  dialogTitle: {
    color: '#333',
  },
  dialogDescription: {
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonNo: {
    color: '#999', // Adjust color if necessary
  },
  buttonYes: {
    color: '#28a745', // Green color
  },
});

export default ConfirmDialog;
