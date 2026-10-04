import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {courseRepository} from '../../config/dependencies';
import {useCatalogViewModel} from '../../viewmodels/catalog/useCatalogViewModel';

export function CatalogScreen(): React.JSX.Element {
  const {
    courses,
    state,
    error,
    loadCourses,
  } = useCatalogViewModel(courseRepository);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  if (state === 'idle' || state === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Cargando cursos...</Text>
      </View>
    );
  }

  if (state === 'error') {
    return (
      <View style={styles.center}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (state === 'empty') {
    return (
      <View style={styles.center}>
        <Text>No hay cursos disponibles.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cursos disponibles</Text>

      <FlatList
        data={courses}
        keyExtractor={item => String(item.idCurso)}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.courseTitle}>
              {item.tituloCurso}
            </Text>

            <Text>
              {item.descripcion ?? 'Sin descripción'}
            </Text>

            <Text>
              Instructor: {item.instructorNombre ?? 'No asignado'}
            </Text>

            <Text>
              Costo: ${item.costo ?? '0.00'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EAF4FF',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF4FF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#0B3A67',
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderColor: '#0B3A67',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#0B3A67',
  },
  message: {
    marginTop: 12,
    color: '#0B3A67',
  },
});