import React from 'react';
import {Text, View} from 'react-native';

import {styles} from './AuthBrand.styles';

export function AuthBrand(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>
          CMP
        </Text>
      </View>

      <View>
        <Text style={styles.brandTop}>
          Centro Médico
        </Text>

        <Text style={styles.brandName}>
          Pichardo
        </Text>
      </View>
    </View>
  );
}